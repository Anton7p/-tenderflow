"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadExcelModule = void 0;
const common_1 = require("@nestjs/common");
const upload_excel_controller_1 = require("./upload-excel.controller");
const build_upd_word_docx_use_case_1 = require("./application/use-cases/build-upd-word-docx.use-case");
const excel_parser_port_1 = require("./application/ports/excel-parser.port");
const upd_document_generator_port_1 = require("./application/ports/upd-document-generator.port");
const parse_excel_use_case_1 = require("./application/use-cases/parse-excel.use-case");
const upd_docx_generator_adapter_1 = require("./infrastructure/docx/generator/upd-docx-generator.adapter");
const xlsx_excel_parser_adapter_1 = require("./infrastructure/excel/xlsx-excel-parser.adapter");
let UploadExcelModule = class UploadExcelModule {
};
exports.UploadExcelModule = UploadExcelModule;
exports.UploadExcelModule = UploadExcelModule = __decorate([
    (0, common_1.Module)({
        controllers: [upload_excel_controller_1.UploadExcelController],
        providers: [
            parse_excel_use_case_1.ParseExcelUseCase,
            build_upd_word_docx_use_case_1.BuildUpdWordDocxUseCase,
            xlsx_excel_parser_adapter_1.XlsxExcelParserAdapter,
            upd_docx_generator_adapter_1.UpdDocxGeneratorAdapter,
            {
                provide: excel_parser_port_1.EXCEL_PARSER_PORT,
                useExisting: xlsx_excel_parser_adapter_1.XlsxExcelParserAdapter,
            },
            {
                provide: upd_document_generator_port_1.UPD_DOCUMENT_GENERATOR_PORT,
                useExisting: upd_docx_generator_adapter_1.UpdDocxGeneratorAdapter,
            },
        ],
    })
], UploadExcelModule);
//# sourceMappingURL=upload-excel.module.js.map