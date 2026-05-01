import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { UpdDocumentGeneratorPort } from '../../application/ports/upd-document-generator.port';
import { ParsedExcelDocument } from '../../domain/upload-excel.domain';
import { buildDocxTemplateFields } from './docx-template-fields';

@Injectable()
export class UpdDocxGeneratorAdapter implements UpdDocumentGeneratorPort {
  buildWordXml(payload: ParsedExcelDocument): string {
    const zip = this.renderTemplateZip(payload);
    const documentXml = zip.file('word/document.xml')?.asText();
    if (!documentXml) {
      throw new BadRequestException('Не удалось получить word/document.xml из шаблона DOCX');
    }
    return documentXml;
  }

  async buildWordDocx(payload: ParsedExcelDocument): Promise<Buffer> {
    const zip = this.renderTemplateZip(payload);
    this.applyUpdTitleFallback(zip, payload);
    return zip.generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    }) as Buffer;
  }

  private renderTemplateZip(payload: ParsedExcelDocument): PizZip {
    const templatePath = this.findDocxTemplateFile();
    const templateBinary = readFileSync(templatePath, 'binary');

    let doc: Docxtemplater;
    try {
      const zip = new PizZip(templateBinary);
      doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: '{{', end: '}}' },
      });
    } catch {
      throw new BadRequestException('Не удалось открыть DOCX шаблон');
    }

    try {
      doc.render(this.buildTemplateData(payload));
    } catch (error) {
      const details = error instanceof Error ? error.message : 'unknown render error';
      throw new BadRequestException(`Ошибка рендера DOCX шаблона: ${details}`);
    }

    return doc.getZip();
  }

  private applyUpdTitleFallback(zip: PizZip, payload: ParsedExcelDocument): void {
    const title = this.buildUpdDocumentTitle(payload);
    if (!title) {
      return;
    }

    const targetXmlPaths = Object.keys((zip as unknown as { files: Record<string, unknown> }).files)
      .filter(
        (filePath) =>
          filePath === 'word/document.xml' ||
          /^word\/header\d+\.xml$/.test(filePath) ||
          /^word\/footer\d+\.xml$/.test(filePath),
      );

    for (const filePath of targetXmlPaths) {
      const file = zip.file(filePath);
      if (!file) {
        continue;
      }
      const current = file.asText();
      const updated = current
        .replace(
          /Универсальный передаточный документ,\s*№\s*\d+\s*от\s*\d{1,2}\.\d{1,2}\.\d{4}/gu,
          title,
        )
        .replace(
          /Универсальный передаточный документ\s*№\s*\d+\s*от\s*\d{1,2}\s*[А-Яа-я]+\s*\d{4}\s*г\./gu,
          title,
        );
      if (updated !== current) {
        zip.file(filePath, updated);
      }
    }
  }

  private buildTemplateData(payload: ParsedExcelDocument): Record<string, unknown> {
    const templateFields: Record<string, string> = {
      ...buildDocxTemplateFields(payload),
      ...(payload.docxFields ?? {}),
    };

    const totals = payload.tableData.reduce(
      (acc, row) => ({
        totalWithoutVat: acc.totalWithoutVat + row.totalBeforeTax,
        totalVat: acc.totalVat + row.taxAmount,
        totalWithVat: acc.totalWithVat + row.totalWithTax,
      }),
      { totalWithoutVat: 0, totalVat: 0, totalWithVat: 0 },
    );

    const itemRows = (payload.tableData.length ? payload.tableData : [null]).map((row, index) => ({
      item_code: row?.productCode?.toString() ?? '',
      item_line_no: row ? String(row.index || index + 1) : '',
      item_name: row?.name ?? '',
      item_type_code: row?.typeCode ?? '',
      item_unit_code: row?.unitCode ?? '',
      item_unit_name: row?.unitName ?? '',
      item_quantity: row ? this.formatRowNumericRaw(row.quantityRaw, row.quantity) : '',
      item_price: row ? this.formatNumber(row.price) : '',
      item_amount_without_vat: row
        ? this.formatRowNumericRaw(row.totalBeforeTaxRaw, row.totalBeforeTax)
        : '',
      item_excise: row?.excise ?? '',
      item_vat_rate: row?.taxRate ?? '',
      item_vat_amount: row ? this.formatRowNumericRaw(row.taxAmountRaw, row.taxAmount) : '',
      item_total_with_vat: row ? this.formatRowNumericRaw(row.totalWithTaxRaw, row.totalWithTax) : '',
      item_country_code: row?.countryCode ?? '',
      item_country_name: row?.countryName ?? '',
      item_declaration_number: row?.declarationNum ?? '',
    }));

    const first = itemRows[0] ?? {
      item_code: '',
      item_line_no: '',
      item_name: '',
      item_type_code: '',
      item_unit_code: '',
      item_unit_name: '',
      item_quantity: '',
      item_price: '',
      item_amount_without_vat: '',
      item_excise: '',
      item_vat_rate: '',
      item_vat_amount: '',
      item_total_with_vat: '',
      item_country_code: '',
      item_country_name: '',
      item_declaration_number: '',
    };
    const updDocumentTitle = this.buildUpdDocumentTitle(payload, templateFields);
    const pagesInfo = (templateFields['pages_info'] ?? '').trim();
    const numPages = this.extractPagesCount(pagesInfo);

    const uppercaseAliases: Record<string, string> = {
      INVOICE_NUMBER: templateFields['invoice_number'] ?? templateFields['document_number'] ?? '',
      DOCUMENT_NUMBER: templateFields['document_number'] ?? '',
      DOCUMENT_DATE: templateFields['document_date'] ?? '',
      CORRECTION_NUMBER: templateFields['correction_number'] ?? '',
      CORRECTION_DATE: templateFields['correction_date'] ?? '',
      UPD_STATUS: templateFields['upd_status'] ?? '',
      SELLER_NAME: templateFields['seller_name'] ?? '',
      SELLER_ADDRESS: templateFields['seller_address'] ?? '',
      SELLER_INN: templateFields['seller_inn'] ?? '',
      SELLER_KPP: templateFields['seller_kpp'] ?? '',
      CONSIGNOR: templateFields['consignor'] ?? '',
      PAYMENT_DOC_NUMBER: templateFields['payment_doc_number'] ?? '',
      SHIP_DOC_NUMBER: templateFields['ship_doc_number'] ?? '',
      SHIP_DATE: templateFields['ship_date'] ?? '',
      BUYER_NAME: templateFields['buyer_name'] ?? '',
      BUYER_ADDRESS: templateFields['buyer_address'] ?? '',
      BUYER_INN: templateFields['buyer_inn'] ?? '',
      BUYER_KPP: templateFields['buyer_kpp'] ?? '',
      CONSIGNEE: templateFields['consignee'] ?? '',
      CURRENCY_NAME: templateFields['currency_name'] ?? '',
      CURRENCY_CODE: templateFields['currency_code'] ?? '',
      CONTRACT_ID: templateFields['contract_id'] ?? '',
      GOVERNMENT_CONTRACT_ID: templateFields['government_contract_id'] ?? templateFields['contract_id'] ?? '',
      OPERATION_CONTENT: templateFields['operation_content'] ?? '',
      BASE_DOCUMENT: templateFields['base_document'] ?? '',
      INVOICE_DATE: templateFields['invoice_date'] ?? templateFields['document_date'] ?? '',
      SHIPPER_NAME_ADDRESS: templateFields['shipper_name_address'] ?? templateFields['seller_name'] ?? '',
      TRANSFEROR_POSITION: templateFields['transferor_position'] ?? templateFields['transfer_position'] ?? '',
      TRANSFEROR_NAME: templateFields['transferor_name'] ?? templateFields['transfer_name'] ?? '',
      SHIPMENT_ADDITIONAL_INFO:
        templateFields['shipment_additional_info'] ?? templateFields['additional_info'] ?? '',
      RESPONSIBLE_POSITION: templateFields['responsible_position'] ?? '',
      RESPONSIBLE_NAME: templateFields['responsible_name'] ?? '',
      BUYER_RESPONSIBLE_POSITION: templateFields['buyer_responsible_position'] ?? '',
      BUYER_RESPONSIBLE_NAME: templateFields['buyer_responsible_name'] ?? '',
      BUYER_DOCUMENT_CREATOR_ENTITY_NAME: templateFields['buyer_document_creator_entity_name'] ?? '',
      BUYER_RECEIVER_POSITION:
        templateFields['buyer_receiver_position'] ?? templateFields['receiver_position'] ?? '',
      BUYER_RECEIVER_NAME: templateFields['buyer_receiver_name'] ?? templateFields['receiver_name'] ?? '',
      DIRECTOR_POSITION_NAME: templateFields['director_position_name'] ?? '',
      CHIEF_ACCOUNTANT_POSITION_NAME: templateFields['chief_accountant_position_name'] ?? '',
      IP_AUTHORIZED_PERSON_NAME: templateFields['ip_authorized_person_name'] ?? '',
      IP_DETAILS_FULL: templateFields['ip_details_full'] ?? '',
      ADVANCE_INVOICE_REF_FULL: templateFields['advance_invoice_ref_full'] ?? '',
      ITEM_CODE: first.item_code,
      LINE_NO: first.item_line_no,
      ITEM_NAME: first.item_name,
      PRODUCT_TYPE_CODE: first.item_type_code,
      UNIT: first.item_unit_name,
      QUANTITY: first.item_quantity,
      PRICE: first.item_price,
      AMOUNT_WITHOUT_VAT: first.item_amount_without_vat,
      VAT_RATE: first.item_vat_rate,
      VAT_AMOUNT: first.item_vat_amount,
      COUNTRY_CODE: first.item_country_code,
      DECLARATION_NUMBER: first.item_declaration_number,
      ITEM_CODE_2: first.item_code,
      LINE_NO_2: first.item_line_no,
      ITEM_NAME_2: first.item_name,
      PRODUCT_TYPE_CODE_2: first.item_type_code,
      UNIT_2: first.item_unit_name,
      QUANTITY_2: first.item_quantity,
      PRICE_2: first.item_price,
      AMOUNT_WITHOUT_VAT_2: first.item_amount_without_vat,
      VAT_RATE_2: first.item_vat_rate,
      VAT_AMOUNT_2: first.item_vat_amount,
      COUNTRY_CODE_2: first.item_country_code,
      DECLARATION_NUMBER_2: first.item_declaration_number,
      TOTAL_WITHOUT_VAT: this.formatNumber(totals.totalWithoutVat),
      TOTAL_VAT: this.formatNumber(totals.totalVat),
      TOTAL_WITH_VAT: this.formatNumber(totals.totalWithVat),
      SELLER_RESPONSIBLE: templateFields['responsible_name'] ?? '',
      SELLER_CHIEF_ACCOUNTANT: '',
      BUYER_RESPONSIBLE: templateFields['receiver_name'] ?? '',
      UPD_DOCUMENT_TITLE: updDocumentTitle,
      PAGES_INFO: pagesInfo,
      NUMPAGES: numPages,
    };

    return {
      ...templateFields,
      ...uppercaseAliases,
      invoice_number: templateFields['invoice_number'] ?? templateFields['document_number'] ?? '',
      upd_document_title: updDocumentTitle,
      tableData: itemRows,
      items: itemRows,
    };
  }

  private findDocxTemplateFile(): string {
    const candidates = [
      resolve(process.cwd(), '../templates/upd_template.docx'),
      resolve(process.cwd(), 'templates/upd_template.docx'),
      resolve(process.cwd(), '../../templates/upd_template.docx'),
    ];
    const found = candidates.find((filePath) => existsSync(filePath));
    if (!found) {
      throw new BadRequestException('Не найден DOCX шаблон в папке templates');
    }
    return found;
  }

  private formatNumber(value: number): string {
    if (!Number.isFinite(value)) {
      return '';
    }
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  private formatRowNumericRaw(raw: number | undefined, fallback: number): string {
    if (Number.isFinite(raw ?? NaN)) {
      return this.formatNumber(raw as number);
    }
    return this.formatNumber(fallback);
  }

  private toRussianHumanDate(input: string): string {
    const raw = (input || '').trim();
    if (!raw) {
      return '';
    }

    const direct = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (direct) {
      const day = Number(direct[1]);
      const month = Number(direct[2]);
      const year = Number(direct[3]);
      return this.formatRussianDateParts(day, month, year);
    }

    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
      return raw.replace(/\s*г\.?$/u, '').trim();
    }

    return this.formatRussianDateParts(parsed.getDate(), parsed.getMonth() + 1, parsed.getFullYear());
  }

  private buildUpdDocumentTitle(
    payload: ParsedExcelDocument,
    prebuiltTemplateFields?: Record<string, string>,
  ): string {
    const templateFields = prebuiltTemplateFields ?? {
      ...buildDocxTemplateFields(payload),
      ...(payload.docxFields ?? {}),
    };
    const documentNumber =
      templateFields['invoice_number']?.trim() ||
      templateFields['document_number']?.trim() ||
      payload.headerFields.documentNumber ||
      '';
    const documentDateHuman = this.toRussianHumanDate(
      templateFields['invoice_date'] ||
        templateFields['document_date'] ||
        payload.headerFields.documentDate ||
        '',
    );
    return `Универсальный передаточный документ № ${documentNumber || '--'} от ${documentDateHuman || '--'} г.`;
  }

  private formatRussianDateParts(day: number, month: number, year: number): string {
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

  private extractPagesCount(value: string): string {
    const match = (value || '').match(/(\d+)/u);
    return match?.[1] ?? '';
  }
}
