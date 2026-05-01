"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadExcelController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const build_upd_word_docx_use_case_1 = require("./application/use-cases/build-upd-word-docx.use-case");
const parse_excel_use_case_1 = require("./application/use-cases/parse-excel.use-case");
const docx_template_fields_1 = require("./infrastructure/docx/docx-template-fields");
const EDITABLE_DOCX_KEYS = [
    'pages_info',
    'invoice_number',
    'invoice_date',
    'seller_name',
    'buyer_name',
    'seller_address',
    'buyer_address',
    'seller_inn_kpp',
    'buyer_inn_kpp',
    'shipper_name_address',
    'consignee_full',
    'currency_full',
    'government_contract_id',
    'payment_doc_full',
    'shipping_doc_full',
    'advance_invoice_ref_full',
    'director_position_name',
    'chief_accountant_position_name',
    'ip_authorized_person_name',
    'ip_details_full',
    'transfer_acceptance_basis',
    'transport_cargo_info',
    'transferor_position',
    'transferor_name',
    'buyer_receiver_position',
    'buyer_receiver_name',
    'shipment_date',
    'acceptance_date',
    'shipment_additional_info',
    'acceptance_additional_info',
    'responsible_position',
    'responsible_name',
    'buyer_responsible_position',
    'buyer_responsible_name',
    'document_creator_entity_name',
    'buyer_document_creator_entity_name',
    'item_total_amount_without_vat',
    'item_total_vat_amount',
    'item_total_with_vat',
];
function buildEditableDocxFields(fields) {
    const result = {};
    for (const key of EDITABLE_DOCX_KEYS) {
        result[key] = fields[key];
    }
    return result;
}
function buildGeneratedDocxFileName(payload) {
    const number = payload.docxFields?.invoice_number?.trim() ||
        payload.docxFields?.document_number?.trim() ||
        payload.headerFields?.documentNumber?.trim() ||
        '--';
    const rawDate = payload.docxFields?.invoice_date?.trim() ||
        payload.docxFields?.document_date?.trim() ||
        payload.headerFields?.documentDate?.trim() ||
        '';
    const humanDate = toRussianHumanDate(rawDate) || '--';
    const baseName = `УПД (статус 1) № ${number} от ${humanDate}`;
    return sanitizeFileName(`${baseName}.docx`);
}
function sanitizeFileName(value) {
    return value.replace(/[<>:"/\\|?*\u0000-\u001F]/g, ' ').replace(/\s+/g, ' ').trim();
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
let UploadExcelController = class UploadExcelController {
    constructor(parseExcelUseCase, buildUpdWordDocxUseCase) {
        this.parseExcelUseCase = parseExcelUseCase;
        this.buildUpdWordDocxUseCase = buildUpdWordDocxUseCase;
    }
    async upload(file) {
        if (!file) {
            throw new common_1.BadRequestException('Файл не передан');
        }
        const payload = await this.parseExcelUseCase.execute(file.buffer, file.originalname);
        const fullDocxFields = (0, docx_template_fields_1.buildDocxTemplateFields)(payload);
        return {
            tableData: payload.tableData,
            editableDocxFields: buildEditableDocxFields(fullDocxFields),
            rawRowsCount: payload.rawRowsCount,
            sourceFileName: payload.sourceFileName,
        };
    }
    async generateDocx(payload, res) {
        if (!payload?.tableData?.length) {
            throw new common_1.BadRequestException('Нет данных для формирования документа');
        }
        const basePayload = {
            tableData: payload.tableData,
            counterparties: payload.counterparties ?? {
                sellerName: '',
                sellerAddress: '',
                sellerInnKpp: '',
                buyerName: '',
                buyerAddress: '',
                buyerInnKpp: '',
            },
            headerFields: payload.headerFields ?? {
                status: '',
                documentNumber: '',
                documentDate: '',
                correctionNumber: '',
                correctionDate: '',
                shipperNameAddress: '',
                consigneeFull: '',
                paymentDoc: '',
                shipmentDoc: '',
                advanceInvoiceRef: '',
                currency: '',
                contractId: '',
                baseDocument: '',
            },
            footerFields: payload.footerFields ?? {
                pagesInfo: '',
                directorPositionName: '',
                chiefAccountantPositionName: '',
                transferBasis: '',
                transportData: '',
                transferDate: '',
                transferInfo: '',
                receiverDate: '',
                receiverInfo: '',
                sellerResponsible: '',
                buyerResponsible: '',
                sellerResponsiblePosition: '',
                buyerResponsiblePosition: '',
                sellerEntityName: '',
                buyerEntityName: '',
                transferorPosition: '',
                transferorName: '',
                receiverPosition: '',
                receiverName: '',
                ipAuthorizedPersonName: '',
                ipDetailsFull: '',
                itemTotalAmountWithoutVat: '',
                itemTotalVatAmount: '',
                itemTotalWithVat: '',
            },
            rawRowsCount: payload.rawRowsCount ?? payload.tableData.length,
            sourceFileName: payload.sourceFileName ?? '',
        };
        const docxBuffer = await this.buildUpdWordDocxUseCase.execute({
            ...basePayload,
            docxFields: {
                ...(0, docx_template_fields_1.buildDocxTemplateFields)(basePayload),
                ...(payload.docxFields ?? {}),
            },
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        const outputFileName = buildGeneratedDocxFileName(payload);
        console.log('[upload-excel] output filename', outputFileName);
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(outputFileName)}`);
        res.send(docxBuffer);
    }
};
exports.UploadExcelController = UploadExcelController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 20 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadExcelController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)('generate-docx'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadExcelController.prototype, "generateDocx", null);
exports.UploadExcelController = UploadExcelController = __decorate([
    (0, common_1.Controller)('upload-excel'),
    __metadata("design:paramtypes", [parse_excel_use_case_1.ParseExcelUseCase,
        build_upd_word_docx_use_case_1.BuildUpdWordDocxUseCase])
], UploadExcelController);
//# sourceMappingURL=upload-excel.controller.js.map