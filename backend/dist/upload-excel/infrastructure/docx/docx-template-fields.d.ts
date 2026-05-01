import { ParsedExcelDocument } from '../../domain/upload-excel.domain';
import { DocxTemplateFieldsDto } from '../../upload-excel.types';
export declare function buildDocxTemplateFields(payload: ParsedExcelDocument): Partial<DocxTemplateFieldsDto>;
