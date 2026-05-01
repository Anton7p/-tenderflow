"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeMarkerValue = sanitizeMarkerValue;
exports.sanitizeEntityName = sanitizeEntityName;
exports.compactTemplateFields = compactTemplateFields;
function sanitizeMarkerValue(value) {
    const normalized = (value || '').trim();
    if (!normalized) {
        return '';
    }
    return /^\(\d+\)$/u.test(normalized) || /^\[\d+\]$/u.test(normalized) ? '' : normalized;
}
function sanitizeEntityName(value) {
    const normalized = (value || '').trim();
    if (!normalized) {
        return '';
    }
    const lower = normalized.toLowerCase();
    if (lower.includes('наименование экономического субъекта')) {
        return '';
    }
    if (/^\[\d+\]$/u.test(normalized)) {
        return '';
    }
    return normalized;
}
function compactTemplateFields(fields) {
    const keepEmptyKeys = new Set([
        'shipment_additional_info',
        'acceptance_additional_info',
    ]);
    return Object.fromEntries(Object.entries(fields).filter(([key, value]) => value !== '' || keepEmptyKeys.has(key)));
}
//# sourceMappingURL=docx-template-fields.helpers.js.map