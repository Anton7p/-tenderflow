"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFooterFields = extractFooterFields;
const upload_excel_parser_utils_1 = require("./upload-excel-parser.utils");
function extractFooterFields(rows) {
    const textRows = rows.map((row) => row.map((cell) => toCellRaw(cell)));
    const totals = findItemTotals(textRows);
    return {
        pagesInfo: findValueOrInlineAfterLabel(textRows, 'Документ составлен на') ||
            findValueOrInlineAfterLabel(textRows, 'Документ на'),
        directorPositionName: findValue(textRows, 'Руководитель организации') ||
            findValue(textRows, 'или иное уполномоченное лицо', 0),
        chiefAccountantPositionName: findValue(textRows, 'Главный бухгалтер') ||
            findValue(textRows, 'или иное уполномоченное лицо', 1),
        transferBasis: findValueBeforeMarker(textRows, '[8]') || findValue(textRows, 'Основание передачи'),
        transportData: findValueBeforeMarker(textRows, '[9]') || findValue(textRows, 'Данные о транспортировке и грузе'),
        transferDate: findValue(textRows, 'Дата отгрузки, передачи (сдачи)'),
        transferInfo: findValueBeforeMarker(textRows, '[12]') || findValue(textRows, 'Иные сведения об отгрузке, передаче'),
        receiverDate: findValue(textRows, 'Дата получения (приемки)'),
        receiverInfo: findValueBeforeMarker(textRows, '[17]') || findValue(textRows, 'Иные сведения о получении, приемке'),
        sellerResponsiblePosition: findFirstBeforeMarker(textRows, '[13]') ||
            findValue(textRows, 'Ответственный за правильность оформления факта хозяйственной жизни ', 0),
        sellerResponsible: findLastBeforeMarker(textRows, '[13]') ||
            findValue(textRows, 'Ответственный за правильность оформления факта хозяйственной жизни ', 0),
        buyerResponsiblePosition: findPenultimateBeforeMarker(textRows, '[18]') ||
            findValue(textRows, 'Ответственный за правильность оформления факта хозяйственной жизни', 0),
        buyerResponsible: findLastBeforeMarker(textRows, '[18]') ||
            findValue(textRows, 'Ответственный за правильность оформления факта хозяйственной жизни', 0),
        sellerEntityName: findValueBeforeMarker(textRows, '[14]') ||
            findValueExact(textRows, 'Наименование экономического субъекта – составителя документа (в т.ч. комиссионера / агента)'),
        buyerEntityName: findValueBeforeMarker(textRows, '[19]') ||
            findValueExact(textRows, 'Наименование экономического субъекта – составителя документа'),
        transferorPosition: findFirstBeforeMarker(textRows, '[10]'),
        transferorName: findLastBeforeMarker(textRows, '[10]'),
        receiverPosition: findPenultimateBeforeMarker(textRows, '[15]'),
        receiverName: findLastBeforeMarker(textRows, '[15]'),
        ipAuthorizedPersonName: findLastBeforeMarker(textRows, '[13]'),
        ipDetailsFull: findFirstByContains(textRows, 'ОГРНИП'),
        itemTotalAmountWithoutVat: totals.itemTotalAmountWithoutVat,
        itemTotalVatAmount: totals.itemTotalVatAmount,
        itemTotalWithVat: totals.itemTotalWithVat,
    };
}
function findValueOrInlineAfterLabel(rows, label, occurrence = 0) {
    const normalizedLabel = normalizeLabelText(label);
    let seen = 0;
    for (const row of rows) {
        for (let i = 0; i < row.length; i += 1) {
            const cell = row[i] || '';
            const normalizedCell = normalizeLabelText(cell);
            if (!normalizedCell.includes(normalizedLabel)) {
                continue;
            }
            if (seen < occurrence) {
                seen += 1;
                continue;
            }
            const inlineValue = cell
                .replace(new RegExp(label, 'iu'), '')
                .replace(/\s+/g, ' ')
                .trim();
            if (inlineValue) {
                return inlineValue;
            }
            const tail = row.slice(i + 1).filter((nextCell) => nextCell.trim().length > 0);
            return tail[0] ?? '';
        }
    }
    return '';
}
function findValue(rows, label, occurrence = 0) {
    const normalizedLabel = normalizeLabelText(label);
    let seen = 0;
    for (const row of rows) {
        for (let i = 0; i < row.length; i += 1) {
            if (!normalizeLabelText(row[i]).includes(normalizedLabel)) {
                continue;
            }
            if (seen < occurrence) {
                seen += 1;
                continue;
            }
            const tail = row.slice(i + 1).filter((cell) => cell.trim().length > 0);
            return tail[0] ?? '';
        }
    }
    return '';
}
function findValueExact(rows, label, occurrence = 0) {
    const normalizedLabel = normalizeLabelText(label);
    let seen = 0;
    for (const row of rows) {
        for (let i = 0; i < row.length; i += 1) {
            if (normalizeLabelText(row[i]) !== normalizedLabel) {
                continue;
            }
            if (seen < occurrence) {
                seen += 1;
                continue;
            }
            const tail = row.slice(i + 1).filter((cell) => cell.trim().length > 0);
            return tail[0] ?? '';
        }
    }
    return '';
}
function findValueBeforeMarker(rows, marker) {
    for (const row of rows) {
        const markerIndex = row.findIndex((cell) => normalizeLabelText(cell) === normalizeLabelText(marker));
        if (markerIndex < 0) {
            continue;
        }
        const candidate = row
            .slice(0, markerIndex)
            .reverse()
            .find((cell) => {
            const value = normalizeLabelText(cell);
            if (!value) {
                return false;
            }
            if (/^\[\d+\]$/u.test(value)) {
                return false;
            }
            if (value.includes('данные о транспортировке') ||
                value.includes('основание передачи') ||
                value.includes('иные сведения') ||
                value.includes('наименование экономического субъекта')) {
                return false;
            }
            return true;
        });
        return candidate ?? '';
    }
    return '';
}
function normalizeLabelText(value) {
    return (0, upload_excel_parser_utils_1.normalize)((value || '').replace(/[–—]/g, '-'));
}
function toCellRaw(value) {
    if (value === null || value === undefined) {
        return '';
    }
    return String(value);
}
function findFirstByContains(rows, needle) {
    const normalizedNeedle = normalizeLabelText(needle);
    for (const row of rows) {
        for (const cell of row) {
            const value = (cell || '').trim();
            if (!value) {
                continue;
            }
            if (normalizeLabelText(value).includes(normalizedNeedle)) {
                return value;
            }
        }
    }
    return '';
}
function findFirstBeforeMarker(rows, marker) {
    const normalizedMarker = normalizeLabelText(marker);
    for (const row of rows) {
        const markerIndex = row.findIndex((cell) => normalizeLabelText(cell) === normalizedMarker);
        if (markerIndex < 0) {
            continue;
        }
        const values = row
            .slice(0, markerIndex)
            .map((cell) => (cell || '').trim())
            .filter((cell) => {
            if (!cell.length || /^\[\d+\]$/u.test(cell)) {
                return false;
            }
            const normalized = normalizeLabelText(cell);
            if (normalized.includes('ответственный за правильность оформления факта хозяйственной жизни')) {
                return false;
            }
            return true;
        });
        return values[0] ?? '';
    }
    return '';
}
function findLastBeforeMarker(rows, marker) {
    const normalizedMarker = normalizeLabelText(marker);
    for (const row of rows) {
        const markerIndex = row.findIndex((cell) => normalizeLabelText(cell) === normalizedMarker);
        if (markerIndex < 0) {
            continue;
        }
        const values = row
            .slice(0, markerIndex)
            .map((cell) => (cell || '').trim())
            .filter((cell) => {
            if (!cell.length || /^\[\d+\]$/u.test(cell)) {
                return false;
            }
            const normalized = normalizeLabelText(cell);
            if (normalized.includes('ответственный за правильность оформления факта хозяйственной жизни')) {
                return false;
            }
            return true;
        });
        return values.length ? values[values.length - 1] : '';
    }
    return '';
}
function findPenultimateBeforeMarker(rows, marker) {
    const normalizedMarker = normalizeLabelText(marker);
    for (const row of rows) {
        const markerIndex = row.findIndex((cell) => normalizeLabelText(cell) === normalizedMarker);
        if (markerIndex < 0) {
            continue;
        }
        const values = row
            .slice(0, markerIndex)
            .map((cell) => (cell || '').trim())
            .filter((cell) => {
            if (!cell.length || /^\[\d+\]$/u.test(cell)) {
                return false;
            }
            const normalized = normalizeLabelText(cell);
            if (normalized.includes('ответственный за правильность оформления факта хозяйственной жизни')) {
                return false;
            }
            return true;
        });
        if (values.length >= 2) {
            return values[values.length - 2];
        }
        return values[0] ?? '';
    }
    return '';
}
function findItemTotals(rows) {
    const anchorPhrases = ['всего к оплате', 'итого к оплате', 'всего'];
    for (const row of rows) {
        const normalizedRow = row.map((cell) => normalizeLabelText(cell));
        const anchorIndex = normalizedRow.findIndex((cell) => anchorPhrases.some((phrase) => cell.includes(phrase)));
        if (anchorIndex < 0) {
            continue;
        }
        const numericCells = row
            .slice(anchorIndex + 1)
            .map((cell) => (cell || '').trim())
            .filter(isNumericLikeCell);
        if (numericCells.length >= 3) {
            return {
                itemTotalAmountWithoutVat: numericCells[numericCells.length - 3] ?? '',
                itemTotalVatAmount: numericCells[numericCells.length - 2] ?? '',
                itemTotalWithVat: numericCells[numericCells.length - 1] ?? '',
            };
        }
    }
    return {
        itemTotalAmountWithoutVat: '',
        itemTotalVatAmount: '',
        itemTotalWithVat: '',
    };
}
function isNumericLikeCell(value) {
    const normalized = normalizeNumericCell(value);
    if (!normalized) {
        return false;
    }
    return /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/iu.test(normalized);
}
function normalizeNumericCell(value) {
    const compact = (value || '').trim().replace(/\s+/g, '');
    if (!compact) {
        return '';
    }
    const hasComma = compact.includes(',');
    const hasDot = compact.includes('.');
    if (hasComma && hasDot) {
        const lastComma = compact.lastIndexOf(',');
        const lastDot = compact.lastIndexOf('.');
        const decimalSeparator = lastComma > lastDot ? ',' : '.';
        const thousandSeparator = decimalSeparator === ',' ? '.' : ',';
        return compact
            .split(thousandSeparator)
            .join('')
            .replace(decimalSeparator, '.');
    }
    if (hasComma) {
        return compact.replace(',', '.');
    }
    return compact;
}
//# sourceMappingURL=upload-excel-footer.parser.js.map