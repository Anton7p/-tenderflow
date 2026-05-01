const quantityRu = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
  useGrouping: true,
});

/** Количество: триады + запятая, всегда 3 знака после запятой (если нет дробной части -> ,000). */
export function formatQuantityDisplay(value: unknown): string {
  const num = parseQuantityNumber(value);
  if (!Number.isFinite(num)) {
    return normalizeQuantitySpaces(quantityRu.format(0));
  }
  return normalizeQuantitySpaces(quantityRu.format(num));
}

function normalizeQuantitySpaces(formatted: string): string {
  return formatted.replace(/\u202f/g, ' ').replace(/\u00a0/g, ' ');
}

function parseQuantityNumber(value: unknown): number {
  if (value === '' || value === null || value === undefined) {
    return NaN;
  }
  if (typeof value === 'number') {
    return value;
  }
  const normalized = String(value)
    .replace(/\u00A0/g, '')
    .replace(/\s/g, '')
    .replace(',', '.');
  return Number(normalized);
}
