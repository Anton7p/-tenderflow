import { Inject, Injectable } from '@nestjs/common';
import {
  EXCEL_PARSER_PORT,
  ExcelParserPort,
} from '../ports/excel-parser.port';
import { ParsedExcelDocument } from '../../domain/upload-excel.domain';

@Injectable()
export class ParseExcelUseCase {
  constructor(
    @Inject(EXCEL_PARSER_PORT)
    private readonly excelParser: ExcelParserPort,
  ) {}

  execute(buffer: Buffer, sourceFileName: string): Promise<ParsedExcelDocument> {
    return this.excelParser.parse(buffer, sourceFileName);
  }
}
