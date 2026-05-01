import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { UpdDocumentGeneratorPort } from '../../../application/ports/upd-document-generator.port';
import { ParsedExcelDocument } from '../../../domain/upload-excel.domain';
import { buildDocxTemplateFields } from '../template-fields/docx-template-fields';
import {
  buildUpdDocumentTitle,
  extractPagesCount,
  formatMoney,
  formatRowMoneyRaw,
  formatRowNumericRaw,
} from './upd-docx-generator.helpers';

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
    const title = buildUpdDocumentTitle(payload);
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

    templateFields.item_total_amount_without_vat = formatMoney(totals.totalWithoutVat);
    templateFields.item_total_vat_amount = formatMoney(totals.totalVat);
    templateFields.item_total_with_vat = formatMoney(totals.totalWithVat);

    const itemRows = (payload.tableData.length ? payload.tableData : [null]).map((row, index) => ({
      item_code: row?.productCode?.toString() ?? '',
      item_line_no: row ? String(row.index || index + 1) : '',
      item_name: row?.name ?? '',
      item_type_code: row?.typeCode ?? '',
      item_unit_code: row?.unitCode ?? '',
      item_unit_name: row?.unitName ?? '',
      item_quantity: row ? formatRowNumericRaw(row.quantityRaw, row.quantity) : '',
      item_price: row ? formatMoney(row.price) : '',
      item_amount_without_vat: row
        ? formatRowMoneyRaw(row.totalBeforeTaxRaw, row.totalBeforeTax)
        : '',
      item_excise: row?.excise ?? '',
      item_vat_rate: row?.taxRate ?? '',
      item_vat_amount: row ? formatRowMoneyRaw(row.taxAmountRaw, row.taxAmount) : '',
      item_total_with_vat: row ? formatRowMoneyRaw(row.totalWithTaxRaw, row.totalWithTax) : '',
      item_country_code: row?.countryCode ?? '',
      item_country_name: row?.countryName ?? '',
      item_declaration_number: row?.declarationNum ?? '',
    }));

    const updDocumentTitle = buildUpdDocumentTitle(payload, templateFields);
    const pagesInfo = (templateFields['pages_info'] ?? '').trim();
    const numPages = extractPagesCount(pagesInfo);

    const uppercaseAliases: Record<string, string> = {
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
      TOTAL_WITHOUT_VAT: formatMoney(totals.totalWithoutVat),
      TOTAL_VAT: formatMoney(totals.totalVat),
      TOTAL_WITH_VAT: formatMoney(totals.totalWithVat),
      UPD_DOCUMENT_TITLE: updDocumentTitle,
      PAGES_INFO: pagesInfo,
      NUMPAGES: numPages,
    };

    return {
      ...templateFields,
      ...uppercaseAliases,
      invoice_number: templateFields['invoice_number'] ?? '',
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
}
