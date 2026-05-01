const moneyRu = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
});

/**
 * Деньги в таблице: триады (пробел), дробная часть через запятую, всегда ровно 2 знака после запятой (нет → ,00).
 */
export function formatMoneyDisplay(value: unknown): string {
  const num = parseMoneyNumber(value);
  if (!Number.isFinite(num)) {
    return normalizeMoneySpaces(moneyRu.format(0));
  }
  return normalizeMoneySpaces(moneyRu.format(num));
}

/** Единый вид группировки: обычный пробел между триадами (без узкого NBSP). */
function normalizeMoneySpaces(formatted: string): string {
  return formatted.replace(/\u202f/g, ' ').replace(/\u00a0/g, ' ');
}

function parseMoneyNumber(value: unknown): number {
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
