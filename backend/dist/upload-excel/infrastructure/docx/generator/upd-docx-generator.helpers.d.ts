import { ParsedExcelDocument } from '../../../domain/upload-excel.domain';
export declare function formatNumber(value: number): string;
export declare function formatMoney(value: number): string;
export declare function formatRowNumericRaw(raw: number | undefined, fallback: number): string;
export declare function formatRowMoneyRaw(raw: number | undefined, fallback: number): string;
export declare function toRussianHumanDate(input: string): string;
export declare function buildUpdDocumentTitle(payload: ParsedExcelDocument, prebuiltTemplateFields?: Record<string, string>): string;
export declare function extractPagesCount(value: string): string;
