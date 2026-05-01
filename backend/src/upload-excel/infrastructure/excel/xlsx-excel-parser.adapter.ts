import { BadRequestException, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { ExcelParserPort } from '../../application/ports/excel-parser.port';
import { ParsedExcelDocument } from '../../domain/upload-excel.domain';
import { extractCounterparties } from '../../parsers/upload-excel-counterparties.parser';
import { extractFooterFields } from '../../parsers/upload-excel-footer.parser';
import { extractHeaderFields } from '../../parsers/upload-excel-header.parser';
import { normalizeFileName } from '../../parsers/upload-excel-parser.utils';
import { extractTable } from '../../parsers/upload-excel-table.parser';

@Injectable()
export class XlsxExcelParserAdapter implements ExcelParserPort {
  async parse(buffer: Buffer, sourceFileName: string): Promise<ParsedExcelDocument> {
    if (!buffer.length) {
      throw new BadRequestException('Пустой файл');
    }

    const workbook = XLSX.read(buffer, {
      type: 'buffer',
      cellDates: false,
      raw: false,
    });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new BadRequestException('В файле отсутствуют листы');
    }

    const worksheet = workbook.Sheets[firstSheetName];

    const { rows } = await this.extractRowsParallel(worksheet);

    const [counterparties, headerFields, footerFields, tableData] = await Promise.all([
      Promise.resolve().then(() => extractCounterparties(rows)),
      Promise.resolve().then(() => extractHeaderFields(rows)),
      Promise.resolve().then(() => extractFooterFields(rows)),
      Promise.resolve().then(() => extractTable(rows)),
    ]);
    return {
      tableData,
      counterparties,
      headerFields,
      footerFields,
      rawRowsCount: rows.length,
      sourceFileName: normalizeFileName(sourceFileName),
    };
  }

  private async extractRowsParallel(worksheet: XLSX.WorkSheet): Promise<{
    rows: (string | number | null)[][];
  }> {
    const rowsPromise = Promise.resolve().then(() =>
      XLSX.utils.sheet_to_json<(string | number | null)[]>(worksheet, {
        defval: '',
        header: 1,
        blankrows: false,
        raw: false,
      }),
    );

    const [rows] = await Promise.all([rowsPromise]);
    return { rows };
  }

}
