import type { DocxTemplateFieldsModel } from '../api/upload-excel-api';
import type { UploadExcelRowModel } from '../types/public';

function formatMoneyRu(value: number): string {
  if (!Number.isFinite(value)) {
    return '';
  }
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Суммы по таблице для полей Word ([item_total_*]), как на бэкенде при генерации DOCX. */
export function computeMoneyTotalsFromTable(tableData: UploadExcelRowModel[]): Pick<
  DocxTemplateFieldsModel,
  'item_total_amount_without_vat' | 'item_total_vat_amount' | 'item_total_with_vat'
> {
  let totalWithoutVat = 0;
  let totalVat = 0;
  let totalWithVat = 0;
  for (const row of tableData) {
    totalWithoutVat += Number(row.totalBeforeTax) || 0;
    totalVat += Number(row.taxAmount) || 0;
    totalWithVat += Number(row.totalWithTax) || 0;
  }
  return {
    item_total_amount_without_vat: formatMoneyRu(totalWithoutVat),
    item_total_vat_amount: formatMoneyRu(totalVat),
    item_total_with_vat: formatMoneyRu(totalWithVat),
  };
}

export function patchDraftDocxFieldsTotals(
  docxFields: DocxTemplateFieldsModel | null,
  tableData: UploadExcelRowModel[],
): void {
  if (!docxFields) return;
  const totals = computeMoneyTotalsFromTable(tableData);
  docxFields.item_total_amount_without_vat = totals.item_total_amount_without_vat;
  docxFields.item_total_vat_amount = totals.item_total_vat_amount;
  docxFields.item_total_with_vat = totals.item_total_with_vat;
}
