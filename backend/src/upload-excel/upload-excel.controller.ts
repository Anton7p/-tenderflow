import {
  Body,
  BadRequestException,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { BuildUpdWordDocxUseCase } from './application/use-cases/build-upd-word-docx.use-case';
import { ParseExcelUseCase } from './application/use-cases/parse-excel.use-case';
import { DocxTemplateFieldsDto, GenerateDocxRequestDto, UploadExcelResponseDto } from './upload-excel.types';
import { buildDocxTemplateFields } from './infrastructure/docx/template-fields/docx-template-fields';

const EDITABLE_DOCX_KEYS = [
  'pages_info',
  'invoice_number',
  'invoice_date',
  'seller_name',
  'buyer_name',
  'seller_address',
  'buyer_address',
  'seller_inn_kpp',
  'buyer_inn_kpp',
  'shipper_name_address',
  'consignee_full',
  'currency_full',
  'government_contract_id',
  'payment_doc_full',
  'shipping_doc_full',
  'advance_invoice_ref_full',
  'director_position_name',
  'chief_accountant_position_name',
  'ip_authorized_person_name',
  'ip_details_full',
  'transfer_acceptance_basis',
  'transport_cargo_info',
  'transferor_position',
  'transferor_name',
  'buyer_receiver_position',
  'buyer_receiver_name',
  'shipment_date',
  'acceptance_date',
  'shipment_additional_info',
  'acceptance_additional_info',
  'responsible_position',
  'responsible_name',
  'buyer_responsible_position',
  'buyer_responsible_name',
  'document_creator_entity_name',
  'buyer_document_creator_entity_name',
  'item_total_amount_without_vat',
  'item_total_vat_amount',
  'item_total_with_vat',
] as const satisfies ReadonlyArray<keyof DocxTemplateFieldsDto>;

function buildEditableDocxFields(fields: Partial<DocxTemplateFieldsDto>): Partial<DocxTemplateFieldsDto> {
  const result: Partial<DocxTemplateFieldsDto> = {};
  for (const key of EDITABLE_DOCX_KEYS) {
    result[key] = fields[key];
  }
  return result;
}

function buildGeneratedDocxFileName(payload: GenerateDocxRequestDto): string {
  const number =
    payload.docxFields?.invoice_number?.trim() ||
    payload.headerFields?.documentNumber?.trim() ||
    '--';
  const rawDate =
    payload.docxFields?.invoice_date?.trim() ||
    payload.headerFields?.documentDate?.trim() ||
    '';
  const humanDate = toRussianHumanDate(rawDate) || '--';
  const baseName = `УПД (статус 1) № ${number} от ${humanDate}`;
  return sanitizeFileName(`${baseName}.docx`);
}

function sanitizeFileName(value: string): string {
  return value.replace(/[<>:"/\\|?*\u0000-\u001F]/g, ' ').replace(/\s+/g, ' ').trim();
}

function toRussianHumanDate(input: string): string {
  const raw = (input || '').trim();
  if (!raw) {
    return '';
  }

  const direct = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (direct) {
    const day = Number(direct[1]);
    const month = Number(direct[2]);
    const year = Number(direct[3]);
    return formatRussianDateParts(day, month, year);
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return raw.replace(/\s*г\.?$/u, '').trim();
  }
  return formatRussianDateParts(parsed.getDate(), parsed.getMonth() + 1, parsed.getFullYear());
}

function formatRussianDateParts(day: number, month: number, year: number): string {
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) {
    return '';
  }
  const monthName = months[month - 1];
  if (!monthName) {
    return '';
  }
  return `${day} ${monthName} ${year}`;
}

@Controller('upload-excel')
export class UploadExcelController {
  constructor(
    private readonly parseExcelUseCase: ParseExcelUseCase,
    private readonly buildUpdWordDocxUseCase: BuildUpdWordDocxUseCase,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async upload(@UploadedFile() file?: Express.Multer.File): Promise<UploadExcelResponseDto> {
    if (!file) {
      throw new BadRequestException('Файл не передан');
    }

    const payload = await this.parseExcelUseCase.execute(file.buffer, file.originalname);

    const fullDocxFields = buildDocxTemplateFields(payload);

    return {
      tableData: payload.tableData,
      editableDocxFields: buildEditableDocxFields(fullDocxFields),
      rawRowsCount: payload.rawRowsCount,
      sourceFileName: payload.sourceFileName,
    };
  }

  @Post('generate-docx')
  async generateDocx(
    @Body() payload: GenerateDocxRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    if (!payload?.tableData?.length) {
      throw new BadRequestException('Нет данных для формирования документа');
    }

    const basePayload = {
      tableData: payload.tableData,
      counterparties: payload.counterparties ?? {
        sellerName: '',
        sellerAddress: '',
        sellerInnKpp: '',
        buyerName: '',
        buyerAddress: '',
        buyerInnKpp: '',
      },
      headerFields: payload.headerFields ?? {
        documentNumber: '',
        documentDate: '',
        shipperNameAddress: '',
        consigneeFull: '',
        paymentDoc: '',
        shipmentDoc: '',
        advanceInvoiceRef: '',
        currency: '',
        contractId: '',
      },
      footerFields: payload.footerFields ?? {
        pagesInfo: '',
        directorPositionName: '',
        chiefAccountantPositionName: '',
        transferBasis: '',
        transportData: '',
        transferDate: '',
        transferInfo: '',
        receiverDate: '',
        receiverInfo: '',
        sellerResponsible: '',
        buyerResponsible: '',
        sellerResponsiblePosition: '',
        buyerResponsiblePosition: '',
        sellerEntityName: '',
        buyerEntityName: '',
        transferorPosition: '',
        transferorName: '',
        receiverPosition: '',
        receiverName: '',
        ipAuthorizedPersonName: '',
        ipDetailsFull: '',
        itemTotalAmountWithoutVat: '',
        itemTotalVatAmount: '',
        itemTotalWithVat: '',
      },
      rawRowsCount: payload.rawRowsCount ?? payload.tableData.length,
      sourceFileName: payload.sourceFileName ?? '',
    };
    const docxBuffer = await this.buildUpdWordDocxUseCase.execute({
      ...basePayload,
      docxFields: {
        ...buildDocxTemplateFields(basePayload),
        ...(payload.docxFields ?? {}),
      },
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    const outputFileName = buildGeneratedDocxFileName(payload);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(outputFileName)}`,
    );
    res.send(docxBuffer);
  }
}
