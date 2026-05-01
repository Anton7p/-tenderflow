import { ParsedExcelDocument } from '../../domain/upload-excel.domain';

export const UPD_DOCUMENT_GENERATOR_PORT = Symbol('UPD_DOCUMENT_GENERATOR_PORT');

export interface UpdDocumentGeneratorPort {
  buildWordXml(payload: ParsedExcelDocument): string;
  buildWordDocx(payload: ParsedExcelDocument): Promise<Buffer>;
}
