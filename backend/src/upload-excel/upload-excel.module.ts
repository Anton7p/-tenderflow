import { Module } from '@nestjs/common';
import { UploadExcelController } from './upload-excel.controller';
import { BuildUpdWordDocxUseCase } from './application/use-cases/build-upd-word-docx.use-case';
import {
  EXCEL_PARSER_PORT,
} from './application/ports/excel-parser.port';
import {
  UPD_DOCUMENT_GENERATOR_PORT,
} from './application/ports/upd-document-generator.port';
import { ParseExcelUseCase } from './application/use-cases/parse-excel.use-case';
import { UpdDocxGeneratorAdapter } from './infrastructure/docx/upd-docx-generator.adapter';
import { XlsxExcelParserAdapter } from './infrastructure/excel/xlsx-excel-parser.adapter';

@Module({
  controllers: [UploadExcelController],
  providers: [
    ParseExcelUseCase,
    BuildUpdWordDocxUseCase,
    XlsxExcelParserAdapter,
    UpdDocxGeneratorAdapter,
    {
      provide: EXCEL_PARSER_PORT,
      useExisting: XlsxExcelParserAdapter,
    },
    {
      provide: UPD_DOCUMENT_GENERATOR_PORT,
      useExisting: UpdDocxGeneratorAdapter,
    },
  ],
})
export class UploadExcelModule {}
