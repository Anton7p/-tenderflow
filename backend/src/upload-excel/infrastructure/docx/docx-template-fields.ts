import { ParsedExcelDocument } from '../../domain/upload-excel.domain';
import { DocxTemplateFieldsDto } from '../../upload-excel.types';

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return '';
  }
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function sanitizeMarkerValue(value: string): string {
  const normalized = (value || '').trim();
  if (!normalized) {
    return '';
  }
  return /^\(\d+\)$/u.test(normalized) || /^\[\d+\]$/u.test(normalized) ? '' : normalized;
}

function sanitizeEntityName(value: string): string {
  const normalized = (value || '').trim();
  if (!normalized) {
    return '';
  }
  const lower = normalized.toLowerCase();
  if (lower.includes('наименование экономического субъекта')) {
    return '';
  }
  if (/^\[\d+\]$/u.test(normalized)) {
    return '';
  }
  return normalized;
}

function compactTemplateFields(
  fields: Partial<DocxTemplateFieldsDto>,
): Partial<DocxTemplateFieldsDto> {
  const keepEmptyKeys = new Set<keyof DocxTemplateFieldsDto>([
    'shipment_additional_info',
    'acceptance_additional_info',
  ]);
  return Object.fromEntries(
    Object.entries(fields).filter(([key, value]) =>
      value !== '' || keepEmptyKeys.has(key as keyof DocxTemplateFieldsDto),
    ),
  ) as Partial<DocxTemplateFieldsDto>;
}

export function buildDocxTemplateFields(payload: ParsedExcelDocument): Partial<DocxTemplateFieldsDto> {
  const [sellerInn = '', sellerKpp = ''] = (payload.counterparties.sellerInnKpp || '')
    .split('/')
    .map((part) => part.trim());
  const [buyerInn = '', buyerKpp = ''] = (payload.counterparties.buyerInnKpp || '')
    .split('/')
    .map((part) => part.trim());
  const sellerName = payload.counterparties.sellerName || '';
  const sellerAddress = payload.counterparties.sellerAddress || '';
  const buyerName = payload.counterparties.buyerName || '';
  const buyerAddress = payload.counterparties.buyerAddress || '';
  const sellerInnKpp = payload.counterparties.sellerInnKpp || [sellerInn, sellerKpp].filter(Boolean).join('/');
  const buyerInnKpp = payload.counterparties.buyerInnKpp || [buyerInn, buyerKpp].filter(Boolean).join('/');
  const currencyFromHeader = payload.headerFields.currency?.trim() || '';
  const currencyFull = currencyFromHeader || '';
  const shipmentDocFull = payload.headerFields.shipmentDoc || '';
  const paymentDocFull = payload.headerFields.paymentDoc || '';
  const docNumber = payload.headerFields.documentNumber || '';
  const advanceInvoiceRefFull = sanitizeMarkerValue(payload.headerFields.advanceInvoiceRef || '');
  const contractId = sanitizeMarkerValue(payload.headerFields.contractId || '');
  const totalWithoutVat = payload.footerFields.itemTotalAmountWithoutVat || '';
  const totalVat = payload.footerFields.itemTotalVatAmount || '';
  const totalWithVat = payload.footerFields.itemTotalWithVat || '';
  const transferorPosition = sanitizeMarkerValue(payload.footerFields.transferorPosition || '');
  const transferorName = sanitizeMarkerValue(payload.footerFields.transferorName || '');
  const buyerReceiverPosition = sanitizeMarkerValue(payload.footerFields.receiverPosition || '');
  const buyerReceiverName = sanitizeMarkerValue(payload.footerFields.receiverName || '');

  const directorPositionName = sanitizeMarkerValue(payload.footerFields.directorPositionName || '');
  const chiefAccountantPositionName = sanitizeMarkerValue(payload.footerFields.chiefAccountantPositionName || '');
  const shipmentAdditionalInfo = sanitizeMarkerValue(payload.footerFields.transferInfo || '');
  const acceptanceAdditionalInfo = sanitizeMarkerValue(payload.footerFields.receiverInfo || '');
  const responsiblePosition = sanitizeMarkerValue(payload.footerFields.sellerResponsiblePosition || '');
  const responsibleName = sanitizeMarkerValue(payload.footerFields.sellerResponsible || '');
  const buyerResponsiblePosition = sanitizeMarkerValue(payload.footerFields.buyerResponsiblePosition || '');
  const buyerResponsibleName = sanitizeMarkerValue(payload.footerFields.buyerResponsible || '');
  const buyerEntityName = sanitizeEntityName(payload.footerFields.buyerEntityName || '');
  const sellerEntityName = sanitizeEntityName(payload.footerFields.sellerEntityName || '');
  const transportCargoInfo = sanitizeMarkerValue(payload.footerFields.transportData || '');
  const transferAcceptanceBasis = sanitizeMarkerValue(payload.footerFields.transferBasis || '');

  return compactTemplateFields({
    pages_info: payload.footerFields.pagesInfo || '',
    invoice_number: docNumber,
    invoice_date: payload.headerFields.documentDate || '',
    document_number: docNumber,
    document_date: payload.headerFields.documentDate || '',
    seller_name: sellerName,
    seller_address: sellerAddress,
    buyer_name: buyerName,
    buyer_address: buyerAddress,
    seller_inn_kpp: sellerInnKpp,
    buyer_inn_kpp: buyerInnKpp,
    shipper_name_address: payload.headerFields.shipperNameAddress || '',
    consignee_full: payload.headerFields.consigneeFull || '',
    currency_full: currencyFull,
    government_contract_id: contractId,
    payment_doc_full: paymentDocFull,
    shipping_doc_full: shipmentDocFull,
    advance_invoice_ref_full: advanceInvoiceRefFull,
    director_position_name: directorPositionName,
    chief_accountant_position_name: chiefAccountantPositionName,
    ip_authorized_person_name: sanitizeMarkerValue(payload.footerFields.ipAuthorizedPersonName || ''),
    ip_details_full: sanitizeMarkerValue(payload.footerFields.ipDetailsFull || ''),
    transfer_acceptance_basis: transferAcceptanceBasis,
    transport_cargo_info: transportCargoInfo,
    transferor_position: transferorPosition,
    transferor_name: transferorName,
    shipment_date: payload.footerFields.transferDate || '',
    responsible_position: responsiblePosition,
    responsible_name: responsibleName,
    document_creator_entity_name: sellerEntityName,
    buyer_responsible_position: buyerResponsiblePosition,
    buyer_responsible_name: buyerResponsibleName,
    buyer_document_creator_entity_name: buyerEntityName || '',
    item_total_amount_without_vat: totalWithoutVat,
    item_total_vat_amount: totalVat,
    item_total_with_vat: totalWithVat,
    buyer_receiver_position: buyerReceiverPosition,
    buyer_receiver_name: buyerReceiverName,
    acceptance_date: payload.footerFields.receiverDate || '',
    acceptance_additional_info: acceptanceAdditionalInfo,
    shipment_additional_info: shipmentAdditionalInfo,
  });
}
