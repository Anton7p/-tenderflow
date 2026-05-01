import { HeaderFieldsDto } from '../upload-excel.types';
import { normalize, toCellString } from './upload-excel-parser.utils';

export function extractHeaderFields(rows: (string | number | null)[][]): HeaderFieldsDto {
  const textRows = rows.map((row) => row.map((cell) => toCellString(cell)));
  const invoiceLine =
    findHeaderLineByMarker(textRows, '(1)') ||
    findSegmentAfterLabel(textRows, 'Счет-фактура №', { stopAtMarker: true });
  const invoicePair = parseNumberDatePair(invoiceLine);
  const paymentDoc = cleanupFieldValue(
    findValueBeforeMarker(textRows, '(5)') ||
      findSegmentAfterLabel(textRows, 'К платежно-расчетному документу №', { stopAtMarker: true }),
  );

  const contractIdRaw =
    findValueBeforeMarker(textRows, '(8)') ||
    findSegmentAfterExactLabel(
      textRows,
      'Идентификатор государственного контракта, договора (соглашения) (при наличии):',
      { stopAtMarker: true },
    );

  return {
    documentNumber: invoicePair.number,
    documentDate: invoicePair.date,
    shipperNameAddress:
      findValueBeforeMarker(textRows, '(3)') ||
      findSegmentAfterLabel(textRows, 'Грузоотправитель и его адрес', { stopAtMarker: true }),
    consigneeFull:
      findValueBeforeMarker(textRows, '(4)') ||
      findSegmentAfterLabel(textRows, 'Грузополучатель и его адрес', { stopAtMarker: true }),
    paymentDoc,
    shipmentDoc:
      findValueBeforeMarker(textRows, '(5а)') ||
      findSegmentAfterLabel(textRows, 'Документ об отгрузке', { stopAtMarker: true }),
    advanceInvoiceRef:
      findValueBeforeMarker(textRows, '(5б)') ||
      findSegmentAfterLabel(textRows, 'К счету-фактуре (счетам-фактурам), выставленному', {
        stopAtMarker: true,
      }) ||
      findSegmentAfterLabel(textRows, 'К счету-фактуре', { stopAtMarker: true }),
    currency:
      findValueBeforeMarker(textRows, '(7)') ||
      findSegmentAfterLabel(textRows, 'Валюта: наименование, код', { stopAtMarker: true }),
    contractId: sanitizeContractId(contractIdRaw),
  };
}

function parseNumberDatePair(value: string): { number: string; date: string } {
  const cleaned = cleanupFieldValue(value);
  if (!cleaned) {
    return { number: '', date: '' };
  }

  const parts = cleaned.split(/\s+от\s+/iu);
  if (parts.length >= 2) {
    return {
      number: extractNumberPart(parts[0]),
      date: cleanupFieldValue(parts.slice(1).join(' от ')),
    };
  }

  return { number: extractNumberPart(cleaned), date: '' };
}

function extractNumberPart(value: string): string {
  const cleaned = cleanupFieldValue(value);
  const numberMarkIndex = cleaned.lastIndexOf('№');
  if (numberMarkIndex >= 0) {
    return cleanupFieldValue(cleaned.slice(numberMarkIndex + 1));
  }
  return cleaned;
}

function findSegmentAfterLabel(
  rows: string[][],
  label: string,
  options?: { stopAtMarker?: boolean },
): string {
  const normalizedLabel = normalize(label);

  for (const row of rows) {
    for (let i = 0; i < row.length; i += 1) {
      if (!normalize(row[i]).includes(normalizedLabel)) {
        continue;
      }

      const tail = row.slice(i + 1).map((cell) => cell.trim()).filter(Boolean);
      if (!tail.length) {
        return '';
      }

      const values = options?.stopAtMarker
        ? tail.filter((cell) => !isMarkerCell(cell))
        : tail;

      return cleanupFieldValue(values.join(' '));
    }
  }

  return '';
}

function findSegmentAfterExactLabel(
  rows: string[][],
  label: string,
  options?: { stopAtMarker?: boolean },
): string {
  const normalizedLabel = normalize(label);

  for (const row of rows) {
    for (let i = 0; i < row.length; i += 1) {
      if (normalize(row[i]) !== normalizedLabel) {
        continue;
      }

      const tail = row.slice(i + 1).map((cell) => cell.trim()).filter(Boolean);
      if (!tail.length) {
        return '';
      }

      const values = options?.stopAtMarker
        ? tail.filter((cell) => !isMarkerCell(cell))
        : tail;

      return cleanupFieldValue(values.join(' '));
    }
  }

  return '';
}

function findValueBeforeMarker(rows: string[][], marker: string): string {
  const normalizedMarker = normalize(marker);

  for (const row of rows) {
    const markerIndex = row.findIndex((cell) => normalize(cell) === normalizedMarker);
    if (markerIndex < 0) {
      continue;
    }

    const values = row
      .slice(0, markerIndex)
      .map((cell) => cell.trim())
      .filter((cell) => Boolean(cell) && !isMarkerCell(cell));

    if (!values.length) {
      return '';
    }
    return cleanupFieldValue(values[values.length - 1]);
  }

  return '';
}

function findHeaderLineByMarker(rows: string[][], marker: string): string {
  const normalizedMarker = normalize(marker);
  for (const row of rows) {
    const markerIndex = row.findIndex((cell) => normalize(cell) === normalizedMarker);
    if (markerIndex < 0) {
      continue;
    }
    const leftSegment = cleanupFieldValue(row.slice(0, markerIndex).join(' '));
    if (leftSegment) {
      return leftSegment;
    }
  }
  return '';
}

function isMarkerCell(value: string): boolean {
  const trimmed = value.trim();
  return /^\(\d+[а-я]?\)$/iu.test(trimmed) || /^\[\d+\]$/u.test(trimmed);
}

function cleanupFieldValue(value: string): string {
  return value
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\(\d+[а-я]?\)\s*$/iu, '')
    .trim();
}

function sanitizeContractId(value: string): string {
  const cleaned = cleanupFieldValue(value);
  const normalized = normalize(cleaned);
  if (!cleaned) {
    return '';
  }
  if (normalized.includes('идентификатор государственного контракта')) {
    return '';
  }
  return cleaned;
}
