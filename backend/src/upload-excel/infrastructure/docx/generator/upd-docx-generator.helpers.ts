import { ParsedExcelDocument } from '../../../domain/upload-excel.domain';
import { buildDocxTemplateFields } from '../template-fields/docx-template-fields';

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return '';
  }

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatMoney(value: number): string {
  if (!Number.isFinite(value)) {
    return '';
  }

  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatRowNumericRaw(raw: number | undefined, fallback: number): string {
  if (Number.isFinite(raw ?? NaN)) {
    return formatNumber(raw as number);
  }

  return formatNumber(fallback);
}

export function formatRowMoneyRaw(raw: number | undefined, fallback: number): string {
  if (Number.isFinite(raw ?? NaN)) {
    return formatMoney(raw as number);
  }

  return formatMoney(fallback);
}

export function toRussianHumanDate(input: string): string {
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

export function buildUpdDocumentTitle(
  payload: ParsedExcelDocument,
  prebuiltTemplateFields?: Record<string, string>,
): string {
  const templateFields = prebuiltTemplateFields ?? {
    ...buildDocxTemplateFields(payload),
    ...(payload.docxFields ?? {}),
  };
  const documentNumber = templateFields['invoice_number']?.trim() || payload.headerFields.documentNumber || '';
  const documentDateHuman = toRussianHumanDate(templateFields['invoice_date'] || payload.headerFields.documentDate || '');

  return `Универсальный передаточный документ № ${documentNumber || '--'} от ${documentDateHuman || '--'} г.`;
}

export function extractPagesCount(value: string): string {
  const match = (value || '').match(/(\d+)/u);
  return match?.[1] ?? '';
}

/** Парсит «… из 2» / «Лист 1 из 2» из pages_info; без «из N» считаем 1 страницу. */
export function extractTotalPagesFromPagesInfo(value: string): number {
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

function formatRussianDateParts(day: number, month: number, year: number): string {
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
