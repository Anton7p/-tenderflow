import { UploadExcelRowDto } from '../upload-excel.types';
import {
  getByIndex,
  isColumnNotationRow,
  isFooterSectionRow,
  isServiceCell,
  mergeRow,
  normalize,
  toCellString,
  toNumber,
} from './upload-excel-parser.utils';

export function extractTable(rows: (string | number | null)[][]): UploadExcelRowDto[] {
  const normalizedRows = rows.map((row) => row.map((cell) => toCellString(cell)));

  const tableHeaderRow = normalizedRows.findIndex((row) =>
    row.some((cell) => normalize(cell).includes('код товара')),
  );
  if (tableHeaderRow === -1) {
    return [];
  }

  const columnIndexes = resolveColumnIndexes(normalizedRows, tableHeaderRow);

  const result: UploadExcelRowDto[] = [];
  let autoIndex = 1;
  let pendingRow: string[] | null = null;

  for (let i = tableHeaderRow + 1; i < normalizedRows.length; i += 1) {
    const row = normalizedRows[i];
    if (isFooterSectionRow(row)) {
      break;
    }

    const isBoundary = isLikelyNewItemRow(row, columnIndexes);

    if (isBoundary && pendingRow && isDataRow(pendingRow, columnIndexes)) {
      const parsedRow = toTableRow(pendingRow, columnIndexes, autoIndex);
      result.push(parsedRow);
      autoIndex += 1;
      pendingRow = null;
    }

    if (isBoundary) {
      pendingRow = row.slice();
      continue;
    }

    if (pendingRow) {
      mergeRow(pendingRow, row);
    }
  }

  if (pendingRow && isDataRow(pendingRow, columnIndexes)) {
    const parsedRow = toTableRow(pendingRow, columnIndexes, autoIndex);
    result.push(parsedRow);
  }

  const filtered = result.filter((item) => !isServiceRecord(item));
  const fallback = extractTableFallbackByKnownLayout(normalizedRows, tableHeaderRow);
  const selected = fallback.length ? fallback : filtered;
  return selected;
}

type ColumnIndexes = ReturnType<typeof resolveColumnIndexes>;

function isDataRow(row: string[], columnIndexes: ColumnIndexes): boolean {
  if (isColumnNotationRow(row)) {
    return false;
  }

  const rowIndex = toNumber(getByIndex(row, columnIndexes.index));
  const name = normalize(getByIndex(row, columnIndexes.name));
  const quantity = getByIndex(row, columnIndexes.quantity);

  if (name.includes('наименование товара') || name.includes('код вида товара')) {
    return false;
  }

  const productCode = getByIndex(row, columnIndexes.productCode);
  if (!productCode || isServiceCell(productCode)) {
    return false;
  }

  const hasMainColumns = Boolean(productCode || name || quantity);
  const looksLikeItemRow = rowIndex > 0 || /^[\d-]+$/.test(productCode);
  return hasMainColumns && looksLikeItemRow;
}

function resolveColumnIndexes(rows: string[][], tableHeaderRow: number) {
  const headerRows = rows.slice(tableHeaderRow, tableHeaderRow + 4);
  const productCode = findColumnIndex(headerRows, ['код товара']);
  const indexByLabel = findColumnIndex(headerRows, [
    '№ п/п',
    '№п/п',
    'n п/п',
    'nп/п',
    'номер по порядку',
  ]);
  const indexByNotation = findIndexByNotationRow(headerRows);
  const index = indexByLabel >= 0 ? indexByLabel : indexByNotation;
  const base = index >= 0 ? index : productCode + 1;

  return {
    productCode,
    index,
    name: findColumnIndex(headerRows, ['наименование товара'], base + 1),
    typeCode: findColumnIndex(headerRows, ['код вида товара'], base + 2),
    unitCode: findColumnIndex(headerRows, ['единица измерения', 'код'], base + 3),
    unitName: findColumnIndex(headerRows, ['условное обозначение'], base + 4),
    quantity: findColumnIndex(headerRows, ['количество'], base + 5),
    price: findColumnIndex(headerRows, ['цена'], base + 6),
    totalBeforeTax: findColumnIndex(headerRows, ['без налога'], base + 7),
    excise: findColumnIndex(headerRows, ['акциза'], base + 8),
    taxRate: findColumnIndex(headerRows, ['налоговая ставка'], base + 9),
    taxAmount: findColumnIndex(headerRows, ['сумма налога'], base + 10),
    totalWithTax: findColumnIndex(headerRows, ['с налогом'], base + 11),
    countryCode: findColumnIndex(headerRows, ['цифровой код'], base + 12),
    countryName: findColumnIndex(headerRows, ['краткое наименование'], base + 13),
    declarationNum: findColumnIndex(headerRows, ['регистрационный номер декларации'], base + 14),
  };
}

function findIndexByNotationRow(headerRows: string[][]): number {
  for (const row of headerRows) {
    const normalized = row.map((cell) => normalize(cell));
    const hasOneA = normalized.some((cell) => cell === '1а');
    const hasOneB = normalized.some((cell) => cell === '1б');
    if (!hasOneA || !hasOneB) {
      continue;
    }
    const index = normalized.findIndex((cell) => cell === '1');
    if (index >= 0) {
      return index;
    }
  }
  return -1;
}

function findColumnIndex(headerRows: string[][], matchers: string[], fallback = -1): number {
  for (const row of headerRows) {
    for (let i = 0; i < row.length; i += 1) {
      const normalizedCell = normalize(row[i]);
      if (matchers.every((matcher) => normalizedCell.includes(normalize(matcher)))) {
        return i;
      }
    }
  }
  return fallback;
}

function isLikelyNewItemRow(row: string[], columnIndexes: ColumnIndexes): boolean {
  const productCode = getByIndex(row, columnIndexes.productCode);
  const rowIndex = toNumber(getByIndex(row, columnIndexes.index));
  return Boolean(productCode) && (rowIndex > 0 || /^[\d-]+$/.test(productCode));
}

function toTableRow(row: string[], columnIndexes: ColumnIndexes, autoIndex: number): UploadExcelRowDto {
  const productCode = getByIndex(row, columnIndexes.productCode);
  const rowIndex = toNumber(getByIndex(row, columnIndexes.index));
  const name = getByIndex(row, columnIndexes.name);
  const typeCode = getByIndex(row, columnIndexes.typeCode);
  const unitCode = getByIndex(row, columnIndexes.unitCode);
  const unitName = getByIndex(row, columnIndexes.unitName);
  const quantityRaw = normalizeQuantityRaw(getByIndex(row, columnIndexes.quantity));
  const quantity = roundTo(quantityRaw, 4);
  const price = roundTo(toNumber(getByIndex(row, columnIndexes.price)), 2);
  const totalBeforeTaxRaw = normalizeMoneyRaw(getByIndex(row, columnIndexes.totalBeforeTax));
  const totalBeforeTax = roundTo(totalBeforeTaxRaw, 2);
  const excise = getByIndex(row, columnIndexes.excise);
  const taxRate = getByIndex(row, columnIndexes.taxRate);
  const taxAmountRaw = normalizeMoneyRaw(getByIndex(row, columnIndexes.taxAmount));
  const taxAmount = roundTo(taxAmountRaw, 2);
  const totalWithTaxRaw = normalizeMoneyRaw(getByIndex(row, columnIndexes.totalWithTax));
  const totalWithTax = roundTo(totalWithTaxRaw, 2);
  const countryCode = getByIndex(row, columnIndexes.countryCode);
  const countryName = getByIndex(row, columnIndexes.countryName);
  const declarationNum = getByIndex(row, columnIndexes.declarationNum);

  return {
    id: `row-${autoIndex}`,
    productCode: productCode || '-',
    index: rowIndex || autoIndex,
    name: name || '-',
    typeCode: typeCode || '-',
    unitCode: unitCode || '-',
    unitName: unitName || '-',
    quantity,
    quantityRaw,
    price,
    totalBeforeTax,
    totalBeforeTaxRaw,
    excise: excise || 'без акциза',
    taxRate: taxRate || '-',
    taxAmount,
    taxAmountRaw,
    totalWithTax,
    totalWithTaxRaw,
    countryCode: countryCode || '-',
    countryName: countryName || '-',
    declarationNum: declarationNum || '-',
  };
}

function isServiceRecord(item: UploadExcelRowDto): boolean {
  return isServiceCell(item.productCode) || /^[a-zа-я]$/i.test(item.productCode);
}

function extractTableFallbackByKnownLayout(rows: string[][], tableHeaderRow: number): UploadExcelRowDto[] {
  const offset = detectKnownLayoutOffset(rows, tableHeaderRow);
  const PRODUCT_CODE = 0 + offset;
  const INDEX = 4 + offset;
  const result: UploadExcelRowDto[] = [];
  let pendingRow: string[] | null = null;
  let autoIndex = 1;

  for (let i = tableHeaderRow + 1; i < rows.length; i += 1) {
    const row = rows[i];
    if (isFooterSectionRow(row)) {
      break;
    }

    const productCode = row[PRODUCT_CODE] ?? '';
    const rowIndex = toNumber(row[INDEX] ?? '');
    const isBoundary =
      /^[\d-]{4,}$/.test(productCode) && rowIndex > 0 && !isServiceCell(productCode);

    if (isBoundary) {
      if (pendingRow) {
        const parsed = toTableRowByKnownLayout(pendingRow, autoIndex, offset);
        if (parsed) {
          result.push(parsed);
          autoIndex += 1;
        }
      }
      pendingRow = row.slice();
      continue;
    }

    if (pendingRow) {
      mergeRow(pendingRow, row);
    }
  }

  if (pendingRow) {
    const parsed = toTableRowByKnownLayout(pendingRow, autoIndex, offset);
    if (parsed) {
      result.push(parsed);
    }
  }

  return result.filter((item) => !isServiceRecord(item));
}

function toTableRowByKnownLayout(row: string[], autoIndex: number, offset: number): UploadExcelRowDto | null {
  const productCode = row[0 + offset] ?? '';
  const index = toNumber(row[4 + offset] ?? '');
  const name = row[8 + offset] ?? '';
  const typeCode = row[9 + offset] ?? '';
  const unitCode = row[21 + offset] ?? '';
  const unitName = row[23 + offset] ?? '';
  const quantityRaw = normalizeQuantityRaw(row[25 + offset] ?? '');
  const quantity = roundTo(quantityRaw, 4);
  const priceRaw = firstNonEmptyCell(row, [28 + offset, 29 + offset, 30 + offset]);
  const price = roundTo(toNumber(priceRaw), 2);
  const totalBeforeTaxRaw = normalizeMoneyRaw(
    firstNonEmptyCell(row, [37 + offset, 38 + offset, 39 + offset, 40 + offset]),
  );
  const totalBeforeTax = roundTo(totalBeforeTaxRaw, 2);
  const excise = firstNonEmptyCell(row, [46 + offset, 47 + offset, 48 + offset]);
  const taxRate = firstNonEmptyCell(row, [50 + offset, 51 + offset, 52 + offset]);
  const taxAmountRaw = normalizeMoneyRaw(
    firstNonEmptyCell(row, [52 + offset, 53 + offset, 54 + offset, 55 + offset]),
  );
  const taxAmount = roundTo(taxAmountRaw, 2);
  const totalWithTaxRaw = normalizeMoneyRaw(
    firstNonEmptyCell(row, [55 + offset, 56 + offset, 57 + offset, 58 + offset]),
  );
  const totalWithTax = roundTo(totalWithTaxRaw, 2);
  const countryCode = firstNonEmptyCell(row, [58 + offset, 59 + offset, 60 + offset, 61 + offset]);
  const countryName = firstNonEmptyCell(row, [60 + offset, 61 + offset, 62 + offset, 63 + offset]);
  const declarationNum = firstNonEmptyCell(row, [63 + offset, 64 + offset, 65 + offset, 66 + offset]);

  if (!/^[\d-]{4,}$/.test(productCode) || isServiceCell(productCode) || !name) {
    return null;
  }

  return {
    id: `row-${autoIndex}`,
    productCode,
    index: index || autoIndex,
    name,
    typeCode: typeCode || '-',
    unitCode: unitCode || '-',
    unitName: unitName || '-',
    quantity,
    quantityRaw,
    price,
    totalBeforeTax,
    totalBeforeTaxRaw,
    excise: excise || 'без акциза',
    taxRate: taxRate || '-',
    taxAmount,
    taxAmountRaw,
    totalWithTax,
    totalWithTaxRaw,
    countryCode: countryCode || '-',
    countryName: countryName || '-',
    declarationNum: declarationNum || '-',
  };
}

function detectKnownLayoutOffset(rows: string[][], tableHeaderRow: number): number {
  const start = tableHeaderRow + 1;
  const end = Math.min(rows.length, tableHeaderRow + 30);
  for (let i = start; i < end; i += 1) {
    const row = rows[i];
    const col0 = row[0] ?? '';
    const col1 = row[1] ?? '';
    const idx4 = toNumber(row[4] ?? '');
    const idx5 = toNumber(row[5] ?? '');

    if (/^[\d-]{4,}$/.test(col0) && idx4 > 0) {
      return 0;
    }
    if (/^[\d-]{4,}$/.test(col1) && idx5 > 0) {
      return 1;
    }
  }
  return 0;
}

function firstNonEmptyCell(row: string[], indexes: number[]): string {
  for (const index of indexes) {
    const value = row[index] ?? '';
    if (String(value).trim()) {
      return value;
    }
  }
  return '';
}

function normalizeMoneyRaw(value: string): number {
  const parsed = parseFlexibleNumber(value);
  return parsed === null ? 0 : roundTo(parsed, 2);
}

function normalizeQuantityRaw(value: string): number {
  const parsed = parseFlexibleNumber(value);
  return parsed === null ? 0 : roundTo(parsed, 4);
}

function parseFlexibleNumber(value: string): number | null {
  const raw = (value ?? '').replace(/[\s\u00A0]/g, '').trim();
  if (!raw) {
    return null;
  }
  const lastComma = raw.lastIndexOf(',');
  const lastDot = raw.lastIndexOf('.');
  let normalized = raw;

  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      normalized = raw.replace(/\./g, '').replace(',', '.');
    } else {
      normalized = raw.replace(/,/g, '');
    }
  } else if (lastComma >= 0) {
    normalized = raw.replace(',', '.');
  }

  const parsed = Number(normalized);
  if (Number.isFinite(parsed)) {
    return parsed;
  }
  return null;
}

function roundTo(value: number, digits: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}


