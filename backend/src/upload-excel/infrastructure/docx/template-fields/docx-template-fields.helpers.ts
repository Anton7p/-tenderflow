import { DocxTemplateFieldsDto } from '../../../upload-excel.types';

export function sanitizeMarkerValue(value: string): string {
  const normalized = (value || '').trim();
  if (!normalized) {
    return '';
  }

  return /^\(\d+\)$/u.test(normalized) || /^\[\d+\]$/u.test(normalized) ? '' : normalized;
}

export function sanitizeEntityName(value: string): string {
  const normalized = (value || '').trim();
  if (!normalized) {
    return '';
  }

  const lower = normalized.toLowerCase();
  if (lower.includes('наименование экономического субъекта')) {
    return '';
  }
  if (/^\[\d+\]$/u.test(normalized)) {
    return '';
  }

  return normalized;
}

export function compactTemplateFields(
  fields: Partial<DocxTemplateFieldsDto>,
): Partial<DocxTemplateFieldsDto> {
  const keepEmptyKeys = new Set<keyof DocxTemplateFieldsDto>([
    'shipment_additional_info',
    'acceptance_additional_info',
  ]);

  return Object.fromEntries(
    Object.entries(fields).filter(([key, value]) =>
      value !== '' || keepEmptyKeys.has(key as keyof DocxTemplateFieldsDto),
    ),
  ) as Partial<DocxTemplateFieldsDto>;
}
