import { UpdDocumentGeneratorPort } from '../../../application/ports/upd-document-generator.port';
import { ParsedExcelDocument } from '../../../domain/upload-excel.domain';
export declare class UpdDocxGeneratorAdapter implements UpdDocumentGeneratorPort {
    buildWordXml(payload: ParsedExcelDocument): string;
    buildWordDocx(payload: ParsedExcelDocument): Promise<Buffer>;
    private renderTemplateZip;
    private applyUpdTitleFallback;
    private buildTemplateData;
    private findDocxTemplateFile;
}
