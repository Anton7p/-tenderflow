"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCounterparties = extractCounterparties;
const upload_excel_parser_utils_1 = require("./upload-excel-parser.utils");
function extractCounterparties(rows) {
    const textRows = rows.map((row) => row.map((cell) => (0, upload_excel_parser_utils_1.toCellString)(cell)));
    const sellerName = findValue(textRows, 'Продавец:');
    const sellerAddress = findValue(textRows, 'Адрес:');
    const sellerInnKpp = findValue(textRows, 'ИНН/КПП продавца:');
    const buyerName = findValue(textRows, 'Покупатель:');
    const buyerAddress = findValue(textRows, 'Адрес:', 1);
    const buyerInnKpp = findValue(textRows, 'ИНН/КПП покупателя:');
    const counterparties = {
        sellerName,
        sellerAddress,
        sellerInnKpp,
        buyerName,
        buyerAddress,
        buyerInnKpp,
    };
    return counterparties;
}
function findValue(rows, label, occurrence = 0) {
    let seen = 0;
    for (const row of rows) {
        const labelIndexes = row
            .map((cell, index) => (cell.includes(label) ? index : -1))
            .filter((index) => index >= 0);
        for (const labelIndex of labelIndexes) {
            if (seen < occurrence) {
                seen += 1;
                continue;
            }
            const value = row.slice(labelIndex + 1).find((cell) => cell.trim().length > 0);
            return value ?? '';
        }
    }
    return '';
}
//# sourceMappingURL=upload-excel-counterparties.parser.js.map