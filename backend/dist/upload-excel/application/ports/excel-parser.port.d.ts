import { ParsedExcelDocument } from '../../domain/upload-excel.domain';
export declare const EXCEL_PARSER_PORT: unique symbol;
export interface ExcelParserPort {
    parse(buffer: Buffer, sourceFileName: string): Promise<ParsedExcelDocument>;
}
