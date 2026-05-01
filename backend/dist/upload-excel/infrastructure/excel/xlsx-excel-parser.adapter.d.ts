import { ExcelParserPort } from '../../application/ports/excel-parser.port';
import { ParsedExcelDocument } from '../../domain/upload-excel.domain';
export declare class XlsxExcelParserAdapter implements ExcelParserPort {
    parse(buffer: Buffer, sourceFileName: string): Promise<ParsedExcelDocument>;
    private extractRowsParallel;
}
