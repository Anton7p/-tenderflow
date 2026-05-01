"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.XlsxExcelParserAdapter = void 0;
const common_1 = require("@nestjs/common");
const XLSX = __importStar(require("xlsx"));
const upload_excel_counterparties_parser_1 = require("../../parsers/upload-excel-counterparties.parser");
const upload_excel_footer_parser_1 = require("../../parsers/upload-excel-footer.parser");
const upload_excel_header_parser_1 = require("../../parsers/upload-excel-header.parser");
const upload_excel_parser_utils_1 = require("../../parsers/upload-excel-parser.utils");
const upload_excel_table_parser_1 = require("../../parsers/upload-excel-table.parser");
let XlsxExcelParserAdapter = class XlsxExcelParserAdapter {
    async parse(buffer, sourceFileName) {
        if (!buffer.length) {
            throw new common_1.BadRequestException('Пустой файл');
        }
        const workbook = XLSX.read(buffer, {
            type: 'buffer',
            cellDates: false,
            raw: false,
        });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
            throw new common_1.BadRequestException('В файле отсутствуют листы');
        }
        const worksheet = workbook.Sheets[firstSheetName];
        const { rows } = await this.extractRowsParallel(worksheet);
        const [counterparties, headerFields, footerFields, tableData] = await Promise.all([
            Promise.resolve().then(() => (0, upload_excel_counterparties_parser_1.extractCounterparties)(rows)),
            Promise.resolve().then(() => (0, upload_excel_header_parser_1.extractHeaderFields)(rows)),
            Promise.resolve().then(() => (0, upload_excel_footer_parser_1.extractFooterFields)(rows)),
            Promise.resolve().then(() => (0, upload_excel_table_parser_1.extractTable)(rows)),
        ]);
        return {
            tableData,
            counterparties,
            headerFields,
            footerFields,
            rawRowsCount: rows.length,
            sourceFileName: (0, upload_excel_parser_utils_1.normalizeFileName)(sourceFileName),
        };
    }
    async extractRowsParallel(worksheet) {
        const rowsPromise = Promise.resolve().then(() => XLSX.utils.sheet_to_json(worksheet, {
            defval: '',
            header: 1,
            blankrows: false,
            raw: false,
        }));
        const [rows] = await Promise.all([rowsPromise]);
        return { rows };
    }
};
exports.XlsxExcelParserAdapter = XlsxExcelParserAdapter;
exports.XlsxExcelParserAdapter = XlsxExcelParserAdapter = __decorate([
    (0, common_1.Injectable)()
], XlsxExcelParserAdapter);
//# sourceMappingURL=xlsx-excel-parser.adapter.js.map