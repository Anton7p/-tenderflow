import { Inject, Injectable } from '@nestjs/common';
import {
  UPD_DOCUMENT_GENERATOR_PORT,
  UpdDocumentGeneratorPort,
} from '../ports/upd-document-generator.port';
import { ParsedExcelDocument } from '../../domain/upload-excel.domain';

@Injectable()
export class BuildUpdWordDocxUseCase {
  constructor(
    @Inject(UPD_DOCUMENT_GENERATOR_PORT)
    private readonly updDocumentGenerator: UpdDocumentGeneratorPort,
  ) {}

  execute(payload: ParsedExcelDocument): Promise<Buffer> {
    return this.updDocumentGenerator.buildWordDocx(payload);
  }
}
