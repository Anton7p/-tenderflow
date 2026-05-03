"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdDocxGeneratorAdapter = void 0;
const common_1 = require("@nestjs/common");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const docxtemplater_1 = __importDefault(require("docxtemplater"));
const pizzip_1 = __importDefault(require("pizzip"));
const docx_template_fields_1 = require("../template-fields/docx-template-fields");
const upd_docx_generator_helpers_1 = require("./upd-docx-generator.helpers");
let UpdDocxGeneratorAdapter = class UpdDocxGeneratorAdapter {
    buildWordXml(payload) {
        const zip = this.renderTemplateZip(payload);
        const documentXml = zip.file('word/document.xml')?.asText();
        if (!documentXml) {
            throw new common_1.BadRequestException('Не удалось получить word/document.xml из шаблона DOCX');
        }
        return documentXml;
    }
    async buildWordDocx(payload) {
        const zip = this.renderTemplateZip(payload);
        this.applyUpdTitleFallback(zip, payload);
        return zip.generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        });
    }
    renderTemplateZip(payload) {
        const templatePath = this.findDocxTemplateFile();
        const templateBinary = (0, node_fs_1.readFileSync)(templatePath, 'binary');
        let doc;
        try {
            const zip = new pizzip_1.default(templateBinary);
            doc = new docxtemplater_1.default(zip, {
                paragraphLoop: true,
                linebreaks: true,
                delimiters: { start: '{{', end: '}}' },
            });
        }
        catch {
            throw new common_1.BadRequestException('Не удалось открыть DOCX шаблон');
        }
        try {
            doc.render(this.buildTemplateData(payload));
        }
        catch (error) {
            const details = error instanceof Error ? error.message : 'unknown render error';
            throw new common_1.BadRequestException(`Ошибка рендера DOCX шаблона: ${details}`);
        }
        return doc.getZip();
    }
    applyUpdTitleFallback(zip, payload) {
        const title = (0, upd_docx_generator_helpers_1.buildUpdDocumentTitle)(payload);
        if (!title) {
            return;
        }
        const targetXmlPaths = Object.keys(zip.files)
            .filter((filePath) => filePath === 'word/document.xml' ||
            /^word\/header\d+\.xml$/.test(filePath) ||
            /^word\/footer\d+\.xml$/.test(filePath));
        for (const filePath of targetXmlPaths) {
            const file = zip.file(filePath);
            if (!file) {
                continue;
            }
            const current = file.asText();
            const updated = current
                .replace(/Универсальный передаточный документ,\s*№\s*\d+\s*от\s*\d{1,2}\.\d{1,2}\.\d{4}/gu, title)
                .replace(/Универсальный передаточный документ\s*№\s*\d+\s*от\s*\d{1,2}\s*[А-Яа-я]+\s*\d{4}\s*г\./gu, title);
            if (updated !== current) {
                zip.file(filePath, updated);
            }
        }
    }
    buildTemplateData(payload) {
        const templateFields = {
            ...(0, docx_template_fields_1.buildDocxTemplateFields)(payload),
            ...(payload.docxFields ?? {}),
        };
        const totals = payload.tableData.reduce((acc, row) => ({
            totalWithoutVat: acc.totalWithoutVat + row.totalBeforeTax,
            totalVat: acc.totalVat + row.taxAmount,
            totalWithVat: acc.totalWithVat + row.totalWithTax,
        }), { totalWithoutVat: 0, totalVat: 0, totalWithVat: 0 });
        templateFields.item_total_amount_without_vat = (0, upd_docx_generator_helpers_1.formatMoney)(totals.totalWithoutVat);
        templateFields.item_total_vat_amount = (0, upd_docx_generator_helpers_1.formatMoney)(totals.totalVat);
        templateFields.item_total_with_vat = (0, upd_docx_generator_helpers_1.formatMoney)(totals.totalWithVat);
        const itemRows = (payload.tableData.length ? payload.tableData : [null]).map((row, index) => ({
            item_code: row?.productCode?.toString() ?? '',
            item_line_no: row ? String(row.index || index + 1) : '',
            item_name: row?.name ?? '',
            item_type_code: row?.typeCode ?? '',
            item_unit_code: row?.unitCode ?? '',
            item_unit_name: row?.unitName ?? '',
            item_quantity: row ? (0, upd_docx_generator_helpers_1.formatRowNumericRaw)(row.quantityRaw, row.quantity) : '',
            item_price: row ? (0, upd_docx_generator_helpers_1.formatMoney)(row.price) : '',
            item_amount_without_vat: row
                ? (0, upd_docx_generator_helpers_1.formatRowMoneyRaw)(row.totalBeforeTaxRaw, row.totalBeforeTax)
                : '',
            item_excise: row?.excise ?? '',
            item_vat_rate: row?.taxRate ?? '',
            item_vat_amount: row ? (0, upd_docx_generator_helpers_1.formatRowMoneyRaw)(row.taxAmountRaw, row.taxAmount) : '',
            item_total_with_vat: row ? (0, upd_docx_generator_helpers_1.formatRowMoneyRaw)(row.totalWithTaxRaw, row.totalWithTax) : '',
            item_country_code: row?.countryCode ?? '',
            item_country_name: row?.countryName ?? '',
            item_declaration_number: row?.declarationNum ?? '',
        }));
        const updDocumentTitle = (0, upd_docx_generator_helpers_1.buildUpdDocumentTitle)(payload, templateFields);
        const pagesInfo = (templateFields['pages_info'] ?? '').trim();
        const numPages = (0, upd_docx_generator_helpers_1.extractPagesCount)(pagesInfo);
        const totalPages = (0, upd_docx_generator_helpers_1.extractTotalPagesFromPagesInfo)(pagesInfo);
        const uppercaseAliases = {
            INVOICE_NUMBER: templateFields['invoice_number'] ?? '',
            SELLER_NAME: templateFields['seller_name'] ?? '',
            SELLER_ADDRESS: templateFields['seller_address'] ?? '',
            BUYER_NAME: templateFields['buyer_name'] ?? '',
            BUYER_ADDRESS: templateFields['buyer_address'] ?? '',
            GOVERNMENT_CONTRACT_ID: templateFields['government_contract_id'] ?? '',
            INVOICE_DATE: templateFields['invoice_date'] ?? '',
            SHIPPER_NAME_ADDRESS: templateFields['shipper_name_address'] ?? '',
            TRANSFEROR_POSITION: templateFields['transferor_position'] ?? '',
            TRANSFEROR_NAME: templateFields['transferor_name'] ?? '',
            SHIPMENT_ADDITIONAL_INFO: templateFields['shipment_additional_info'] ?? '',
            RESPONSIBLE_POSITION: templateFields['responsible_position'] ?? '',
            RESPONSIBLE_NAME: templateFields['responsible_name'] ?? '',
            BUYER_RESPONSIBLE_POSITION: templateFields['buyer_responsible_position'] ?? '',
            BUYER_RESPONSIBLE_NAME: templateFields['buyer_responsible_name'] ?? '',
            BUYER_DOCUMENT_CREATOR_ENTITY_NAME: templateFields['buyer_document_creator_entity_name'] ?? '',
            BUYER_RECEIVER_POSITION: templateFields['buyer_receiver_position'] ?? '',
            BUYER_RECEIVER_NAME: templateFields['buyer_receiver_name'] ?? '',
            DIRECTOR_POSITION_NAME: templateFields['director_position_name'] ?? '',
            CHIEF_ACCOUNTANT_POSITION_NAME: templateFields['chief_accountant_position_name'] ?? '',
            IP_AUTHORIZED_PERSON_NAME: templateFields['ip_authorized_person_name'] ?? '',
            IP_DETAILS_FULL: templateFields['ip_details_full'] ?? '',
            ADVANCE_INVOICE_REF_FULL: templateFields['advance_invoice_ref_full'] ?? '',
            TOTAL_WITHOUT_VAT: (0, upd_docx_generator_helpers_1.formatMoney)(totals.totalWithoutVat),
            TOTAL_VAT: (0, upd_docx_generator_helpers_1.formatMoney)(totals.totalVat),
            TOTAL_WITH_VAT: (0, upd_docx_generator_helpers_1.formatMoney)(totals.totalWithVat),
            UPD_DOCUMENT_TITLE: updDocumentTitle,
            PAGES_INFO: pagesInfo,
            NUMPAGES: numPages,
        };
        return {
            ...templateFields,
            ...uppercaseAliases,
            invoice_number: templateFields['invoice_number'] ?? '',
            upd_document_title: updDocumentTitle,
            has_continuation_block: totalPages > 1,
            total_pages: totalPages,
            tableData: itemRows,
            items: itemRows,
        };
    }
    findDocxTemplateFile() {
        const candidates = [
            (0, node_path_1.resolve)(process.cwd(), '../templates/upd_template.docx'),
            (0, node_path_1.resolve)(process.cwd(), 'templates/upd_template.docx'),
            (0, node_path_1.resolve)(process.cwd(), '../../templates/upd_template.docx'),
        ];
        const found = candidates.find((filePath) => (0, node_fs_1.existsSync)(filePath));
        if (!found) {
            throw new common_1.BadRequestException('Не найден DOCX шаблон в папке templates');
        }
        return found;
    }
};
exports.UpdDocxGeneratorAdapter = UpdDocxGeneratorAdapter;
exports.UpdDocxGeneratorAdapter = UpdDocxGeneratorAdapter = __decorate([
    (0, common_1.Injectable)()
], UpdDocxGeneratorAdapter);
//# sourceMappingURL=upd-docx-generator.adapter.js.map