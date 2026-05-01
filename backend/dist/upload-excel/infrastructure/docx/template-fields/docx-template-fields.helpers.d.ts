import { DocxTemplateFieldsDto } from '../../../upload-excel.types';
export declare function sanitizeMarkerValue(value: string): string;
export declare function sanitizeEntityName(value: string): string;
export declare function compactTemplateFields(fields: Partial<DocxTemplateFieldsDto>): Partial<DocxTemplateFieldsDto>;
