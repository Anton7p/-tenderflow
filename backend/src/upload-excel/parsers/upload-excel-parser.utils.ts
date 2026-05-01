export function toCellString(value: string | number | null): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
}

export function toNumber(value: string): number {
  if (!value) {
    return 0;
  }
  const normalized = value.replace(/\s/g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

export function getByIndex(row: string[], index: number): string {
  if (index < 0) {
    return '';
  }
  return row[index] ?? '';
}

export function mergeRow(target: string[], source: string[]): void {
  for (let i = 0; i < source.length; i += 1) {
    if (!target[i] && source[i]) {
      target[i] = source[i];
    }
  }
}

export function isColumnNotationRow(row: string[]): boolean {
  const normalized = row.map((cell) => normalize(cell)).filter(Boolean);
  const hasColumnA = normalized.includes('а') || normalized.includes('a');
  const hasOne = normalized.includes('1');
  const hasOneA = normalized.includes('1а') || normalized.includes('1a');
  const hasOneB = normalized.includes('1б') || normalized.includes('1b');
  return hasColumnA && hasOne && hasOneA && hasOneB;
}

export function isServiceCell(value: string): boolean {
  const normalizedValue = normalize(value);
  return (
    normalizedValue.includes('универсальный передаточный документ') ||
    normalizedValue.includes('код товара') ||
    normalizedValue.includes('документ составлен')
  );
}

export function isFooterSectionRow(row: string[]): boolean {
  const rowText = normalize(row.join(' '));
  return (
    rowText.includes('основание передачи') ||
    rowText.includes('товар (груз) получил') ||
    rowText.includes('документ составлен на') ||
    rowText.includes('руководитель организации') ||
    rowText.includes('главный бухгалтер')
  );
}

export function normalizeFileName(fileName: string): string {
  if (!fileName) {
    return '';
  }
  if (/[а-яё]/i.test(fileName)) {
    return fileName;
  }

  const decoded = Buffer.from(fileName, 'latin1').toString('utf8');
  return /[а-яё]/i.test(decoded) ? decoded : fileName;
}
