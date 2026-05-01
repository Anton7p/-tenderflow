import { UpdDocumentGeneratorPort } from '../ports/upd-document-generator.port';
import { ParsedExcelDocument } from '../../domain/upload-excel.domain';
export declare class BuildUpdWordDocxUseCase {
    private readonly updDocumentGenerator;
    constructor(updDocumentGenerator: UpdDocumentGeneratorPort);
    execute(payload: ParsedExcelDocument): Promise<Buffer>;
}
