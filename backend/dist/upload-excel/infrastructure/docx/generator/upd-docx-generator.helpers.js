"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNumber = formatNumber;
exports.formatMoney = formatMoney;
exports.formatRowNumericRaw = formatRowNumericRaw;
exports.formatRowMoneyRaw = formatRowMoneyRaw;
exports.toRussianHumanDate = toRussianHumanDate;
exports.buildUpdDocumentTitle = buildUpdDocumentTitle;
exports.extractPagesCount = extractPagesCount;
exports.extractTotalPagesFromPagesInfo = extractTotalPagesFromPagesInfo;
const docx_template_fields_1 = require("../template-fields/docx-template-fields");
function formatNumber(value) {
    if (!Number.isFinite(value)) {
        return '';
    }
    return new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
}
function formatMoney(value) {
    if (!Number.isFinite(value)) {
        return '';
    }
    return new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}
function formatRowNumericRaw(raw, fallback) {
    if (Number.isFinite(raw ?? NaN)) {
        return formatNumber(raw);
    }
    return formatNumber(fallback);
}
function formatRowMoneyRaw(raw, fallback) {
    if (Number.isFinite(raw ?? NaN)) {
        return formatMoney(raw);
    }
    return formatMoney(fallback);
}
function toRussianHumanDate(input) {
    const raw = (input || '').trim();
    if (!raw) {
        return '';
    }
    const direct = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (direct) {
        const day = Number(direct[1]);
        const month = Number(direct[2]);
        const year = Number(direct[3]);
        return formatRussianDateParts(day, month, year);
    }
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
        return raw.replace(/\s*г\.?$/u, '').trim();
    }
    return formatRussianDateParts(parsed.getDate(), parsed.getMonth() + 1, parsed.getFullYear());
}
function buildUpdDocumentTitle(payload, prebuiltTemplateFields) {
    const templateFields = prebuiltTemplateFields ?? {
        ...(0, docx_template_fields_1.buildDocxTemplateFields)(payload),
        ...(payload.docxFields ?? {}),
    };
    const documentNumber = templateFields['invoice_number']?.trim() || payload.headerFields.documentNumber || '';
    const documentDateHuman = toRussianHumanDate(templateFields['invoice_date'] || payload.headerFields.documentDate || '');
    return `Универсальный передаточный документ № ${documentNumber || '--'} от ${documentDateHuman || '--'} г.`;
}
function extractPagesCount(value) {
    const match = (value || '').match(/(\d+)/u);
    return match?.[1] ?? '';
}
function extractTotalPagesFromPagesInfo(value) {
    const raw = (value || '').trim();
    if (!raw) {
        return 1;
    }
    const ofMatch = raw.match(/из\s*(\d+)/iu);
    if (ofMatch) {
        const n = parseInt(ofMatch[1], 10);
        return Number.isFinite(n) && n > 0 ? n : 1;
    }
    return 1;
}
function formatRussianDateParts(day, month, year) {
    const months = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
    ];
    if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) {
        return '';
    }
    const monthName = months[month - 1];
    if (!monthName) {
        return '';
    }
    return `${day} ${monthName} ${year}`;
}
//# sourceMappingURL=upd-docx-generator.helpers.js.map