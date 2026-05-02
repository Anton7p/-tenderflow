import type { UploadExcelRowModel } from '../types/public';

export interface CounterpartiesModel {
  sellerName: string;
  sellerAddress: string;
  sellerInnKpp: string;
  buyerName: string;
  buyerAddress: string;
  buyerInnKpp: string;
}

export interface HeaderFieldsModel {
  status: string;
  documentNumber: string;
  documentDate: string;
  correctionNumber: string;
  correctionDate: string;
  paymentDoc: string;
  shipmentDoc: string;
  currency: string;
  contractId: string;
  baseDocument: string;
}

export interface FooterFieldsModel {
  pagesInfo: string;
  transferBasis: string;
  transportData: string;
  transferDate: string;
  transferInfo: string;
  receiverDate: string;
  receiverInfo: string;
  sellerResponsible: string;
  buyerResponsible: string;
  sellerEntityName: string;
  buyerEntityName: string;
}

export interface DocxTemplateFieldsModel {
  [key: string]: string;
}

export interface UploadExcelResponse {
  tableData: UploadExcelRowModel[];
  editableDocxFields: DocxTemplateFieldsModel;
  rawRowsCount: number;
  sourceFileName: string;
}

export interface GenerateDocxRequest {
  tableData: UploadExcelRowModel[];
  counterparties: CounterpartiesModel;
  headerFields?: HeaderFieldsModel;
  footerFields?: FooterFieldsModel;
  docxFields?: DocxTemplateFieldsModel;
  rawRowsCount?: number;
  sourceFileName?: string;
}

export interface GenerateDocxResponse {
  blob: Blob;
  fileName: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api';

export async function uploadExcelFile(file: File): Promise<UploadExcelResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload-excel/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки файла: ${response.status}`);
  }

  const payload = (await response.json()) as UploadExcelResponse;

  console.log('[upload-excel/api] upload response', {
    hasTableData: Array.isArray(payload?.tableData),
    tableDataLength: payload?.tableData?.length ?? 0,
    sourceFileName: payload?.sourceFileName,
    rawRowsCount: payload?.rawRowsCount,
  });

  if (!payload || !Array.isArray(payload.tableData)) {
    throw new Error('Некорректный ответ сервера: отсутствует tableData');
  }

  return payload;
}

export async function generateWordDocx(
  payload: GenerateDocxRequest,
): Promise<GenerateDocxResponse> {
  const response = await fetch(`${API_BASE_URL}/upload-excel/generate-docx`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Ошибка генерации Word документа: ${response.status}`);
  }

  const blob = await response.blob();
  const fileName = parseFileNameFromContentDisposition(response.headers.get('Content-Disposition'));
  return {
    blob,
    fileName: fileName || 'upd-template.docx',
  };
}

function parseFileNameFromContentDisposition(header: string | null): string {
  if (!header) {
    return '';
  }

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]).trim();
    } catch {
      // noop
    }
  }

  const plainMatch = header.match(/filename="?([^";]+)"?/i);
  return plainMatch?.[1]?.trim() ?? '';
}
