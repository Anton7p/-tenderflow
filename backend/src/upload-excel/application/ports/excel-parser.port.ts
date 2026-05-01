import { ParsedExcelDocument } from '../../domain/upload-excel.domain';

export const EXCEL_PARSER_PORT = Symbol('EXCEL_PARSER_PORT');

export interface ExcelParserPort {
  parse(buffer: Buffer, sourceFileName: string): Promise<ParsedExcelDocument>;
}
