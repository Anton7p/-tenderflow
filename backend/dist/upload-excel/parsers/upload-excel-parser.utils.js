"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCellString = toCellString;
exports.toNumber = toNumber;
exports.normalize = normalize;
exports.getByIndex = getByIndex;
exports.mergeRow = mergeRow;
exports.isColumnNotationRow = isColumnNotationRow;
exports.isServiceCell = isServiceCell;
exports.isFooterSectionRow = isFooterSectionRow;
exports.normalizeFileName = normalizeFileName;
function toCellString(value) {
    if (value === null || value === undefined) {
        return '';
    }
    return String(value).trim();
}
function toNumber(value) {
    if (!value) {
        return 0;
    }
    const normalized = value.replace(/\s/g, '').replace(',', '.');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
}
function normalize(value) {
    return value.toLowerCase().replace(/\s+/g, ' ').trim();
}
function getByIndex(row, index) {
    if (index < 0) {
        return '';
    }
    return row[index] ?? '';
}
function mergeRow(target, source) {
    for (let i = 0; i < source.length; i += 1) {
        if (!target[i] && source[i]) {
            target[i] = source[i];
        }
    }
}
function isColumnNotationRow(row) {
    const normalized = row.map((cell) => normalize(cell)).filter(Boolean);
    const hasColumnA = normalized.includes('а') || normalized.includes('a');
    const hasOne = normalized.includes('1');
    const hasOneA = normalized.includes('1а') || normalized.includes('1a');
    const hasOneB = normalized.includes('1б') || normalized.includes('1b');
    return hasColumnA && hasOne && hasOneA && hasOneB;
}
function isServiceCell(value) {
    const normalizedValue = normalize(value);
    return (normalizedValue.includes('универсальный передаточный документ') ||
        normalizedValue.includes('код товара') ||
        normalizedValue.includes('документ составлен'));
}
function isFooterSectionRow(row) {
    const rowText = normalize(row.join(' '));
    return (rowText.includes('основание передачи') ||
        rowText.includes('товар (груз) получил') ||
        rowText.includes('документ составлен на') ||
        rowText.includes('руководитель организации') ||
        rowText.includes('главный бухгалтер'));
}
function normalizeFileName(fileName) {
    if (!fileName) {
        return '';
    }
    if (/[а-яё]/i.test(fileName)) {
        return fileName;
    }
    const decoded = Buffer.from(fileName, 'latin1').toString('utf8');
    return /[а-яё]/i.test(decoded) ? decoded : fileName;
}
//# sourceMappingURL=upload-excel-parser.utils.js.map