"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractHeaderFields = extractHeaderFields;
const upload_excel_parser_utils_1 = require("./upload-excel-parser.utils");
function extractHeaderFields(rows) {
    const textRows = rows.map((row) => row.map((cell) => (0, upload_excel_parser_utils_1.toCellString)(cell)));
    const invoiceLine = findHeaderLineByMarker(textRows, '(1)') ||
        findSegmentAfterLabel(textRows, 'Счет-фактура №', { stopAtMarker: true });
    const correctionLine = findHeaderLineByMarker(textRows, '(1а)') ||
        findSegmentAfterLabel(textRows, 'Исправление №', { stopAtMarker: true });
    const invoicePair = parseNumberDatePair(invoiceLine);
    const correctionPair = parseNumberDatePair(correctionLine);
    const paymentDoc = cleanupFieldValue(findValueBeforeMarker(textRows, '(5)') ||
        findSegmentAfterLabel(textRows, 'К платежно-расчетному документу №', { stopAtMarker: true }));
    const contractIdRaw = findValueBeforeMarker(textRows, '(8)') ||
        findSegmentAfterExactLabel(textRows, 'Идентификатор государственного контракта, договора (соглашения) (при наличии):', { stopAtMarker: true });
    return {
        status: findValue(textRows, 'Статус:'),
        documentNumber: invoicePair.number,
        documentDate: invoicePair.date,
        correctionNumber: correctionPair.number,
        correctionDate: correctionPair.date,
        shipperNameAddress: findValueBeforeMarker(textRows, '(3)') ||
            findSegmentAfterLabel(textRows, 'Грузоотправитель и его адрес', { stopAtMarker: true }),
        consigneeFull: findValueBeforeMarker(textRows, '(4)') ||
            findSegmentAfterLabel(textRows, 'Грузополучатель и его адрес', { stopAtMarker: true }),
        paymentDoc,
        shipmentDoc: findValueBeforeMarker(textRows, '(5а)') ||
            findSegmentAfterLabel(textRows, 'Документ об отгрузке', { stopAtMarker: true }),
        advanceInvoiceRef: findValueBeforeMarker(textRows, '(5б)') ||
            findSegmentAfterLabel(textRows, 'К счету-фактуре (счетам-фактурам), выставленному', {
                stopAtMarker: true,
            }) ||
            findSegmentAfterLabel(textRows, 'К счету-фактуре', { stopAtMarker: true }),
        currency: findValueBeforeMarker(textRows, '(7)') ||
            findSegmentAfterLabel(textRows, 'Валюта: наименование, код', { stopAtMarker: true }),
        contractId: sanitizeContractId(contractIdRaw),
        baseDocument: findValue(textRows, 'Основание передачи'),
    };
}
function findValue(rows, label, occurrence = 0, pivot = '') {
    const normalizedLabel = (0, upload_excel_parser_utils_1.normalize)(label);
    const normalizedPivot = (0, upload_excel_parser_utils_1.normalize)(pivot);
    let seen = 0;
    for (const row of rows) {
        for (let i = 0; i < row.length; i += 1) {
            if (!(0, upload_excel_parser_utils_1.normalize)(row[i]).includes(normalizedLabel)) {
                continue;
            }
            if (seen < occurrence) {
                seen += 1;
                continue;
            }
            const tail = row.slice(i + 1).filter((cell) => cell.trim().length > 0);
            if (!tail.length) {
                return '';
            }
            if (!normalizedPivot) {
                return tail[0] ?? '';
            }
            const pivotIndex = tail.findIndex((cell) => (0, upload_excel_parser_utils_1.normalize)(cell) === normalizedPivot);
            if (pivotIndex >= 0 && tail[pivotIndex + 1]) {
                return tail[pivotIndex + 1];
            }
            return tail[0] ?? '';
        }
    }
    return '';
}
function parseNumberDatePair(value) {
    const cleaned = cleanupFieldValue(value);
    if (!cleaned) {
        return { number: '', date: '' };
    }
    const parts = cleaned.split(/\s+от\s+/iu);
    if (parts.length >= 2) {
        return {
            number: extractNumberPart(parts[0]),
            date: cleanupFieldValue(parts.slice(1).join(' от ')),
        };
    }
    return { number: extractNumberPart(cleaned), date: '' };
}
function extractNumberPart(value) {
    const cleaned = cleanupFieldValue(value);
    const numberMarkIndex = cleaned.lastIndexOf('№');
    if (numberMarkIndex >= 0) {
        return cleanupFieldValue(cleaned.slice(numberMarkIndex + 1));
    }
    return cleaned;
}
function findSegmentAfterLabel(rows, label, options) {
    const normalizedLabel = (0, upload_excel_parser_utils_1.normalize)(label);
    for (const row of rows) {
        for (let i = 0; i < row.length; i += 1) {
            if (!(0, upload_excel_parser_utils_1.normalize)(row[i]).includes(normalizedLabel)) {
                continue;
            }
            const tail = row.slice(i + 1).map((cell) => cell.trim()).filter(Boolean);
            if (!tail.length) {
                return '';
            }
            const values = options?.stopAtMarker
                ? tail.filter((cell) => !isMarkerCell(cell))
                : tail;
            return cleanupFieldValue(values.join(' '));
        }
    }
    return '';
}
function findSegmentAfterExactLabel(rows, label, options) {
    const normalizedLabel = (0, upload_excel_parser_utils_1.normalize)(label);
    for (const row of rows) {
        for (let i = 0; i < row.length; i += 1) {
            if ((0, upload_excel_parser_utils_1.normalize)(row[i]) !== normalizedLabel) {
                continue;
            }
            const tail = row.slice(i + 1).map((cell) => cell.trim()).filter(Boolean);
            if (!tail.length) {
                return '';
            }
            const values = options?.stopAtMarker
                ? tail.filter((cell) => !isMarkerCell(cell))
                : tail;
            return cleanupFieldValue(values.join(' '));
        }
    }
    return '';
}
function findValueBeforeMarker(rows, marker) {
    const normalizedMarker = (0, upload_excel_parser_utils_1.normalize)(marker);
    for (const row of rows) {
        const markerIndex = row.findIndex((cell) => (0, upload_excel_parser_utils_1.normalize)(cell) === normalizedMarker);
        if (markerIndex < 0) {
            continue;
        }
        const values = row
            .slice(0, markerIndex)
            .map((cell) => cell.trim())
            .filter((cell) => Boolean(cell) && !isMarkerCell(cell));
        if (!values.length) {
            return '';
        }
        return cleanupFieldValue(values[values.length - 1]);
    }
    return '';
}
function findHeaderLineByMarker(rows, marker) {
    const normalizedMarker = (0, upload_excel_parser_utils_1.normalize)(marker);
    for (const row of rows) {
        const markerIndex = row.findIndex((cell) => (0, upload_excel_parser_utils_1.normalize)(cell) === normalizedMarker);
        if (markerIndex < 0) {
            continue;
        }
        const leftSegment = cleanupFieldValue(row.slice(0, markerIndex).join(' '));
        if (leftSegment) {
            return leftSegment;
        }
    }
    return '';
}
function isMarkerCell(value) {
    const trimmed = value.trim();
    return /^\(\d+[а-я]?\)$/iu.test(trimmed) || /^\[\d+\]$/u.test(trimmed);
}
function cleanupFieldValue(value) {
    return value
        .replace(/[ \t]+/g, ' ')
        .replace(/\s*\(\d+[а-я]?\)\s*$/iu, '')
        .trim();
}
function sanitizeContractId(value) {
    const cleaned = cleanupFieldValue(value);
    const normalized = (0, upload_excel_parser_utils_1.normalize)(cleaned);
    if (!cleaned) {
        return '';
    }
    if (normalized.includes('идентификатор государственного контракта')) {
        return '';
    }
    return cleaned;
}
//# sourceMappingURL=upload-excel-header.parser.js.map