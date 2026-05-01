import { ExcelParserPort } from '../ports/excel-parser.port';
import { ParsedExcelDocument } from '../../domain/upload-excel.domain';
export declare class ParseExcelUseCase {
    private readonly excelParser;
    constructor(excelParser: ExcelParserPort);
    execute(buffer: Buffer, sourceFileName: string): Promise<ParsedExcelDocument>;
}
