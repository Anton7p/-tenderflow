import { ParsedExcelDocument } from '../../domain/upload-excel.domain';
export declare const UPD_DOCUMENT_GENERATOR_PORT: unique symbol;
export interface UpdDocumentGeneratorPort {
    buildWordXml(payload: ParsedExcelDocument): string;
    buildWordDocx(payload: ParsedExcelDocument): Promise<Buffer>;
}
