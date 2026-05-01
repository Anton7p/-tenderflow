"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDocxTemplateFields = buildDocxTemplateFields;
const docx_template_fields_helpers_1 = require("./docx-template-fields.helpers");
function buildDocxTemplateFields(payload) {
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
    const advanceInvoiceRefFull = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.headerFields.advanceInvoiceRef || '');
    const contractId = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.headerFields.contractId || '');
    const totalWithoutVat = payload.footerFields.itemTotalAmountWithoutVat || '';
    const totalVat = payload.footerFields.itemTotalVatAmount || '';
    const totalWithVat = payload.footerFields.itemTotalWithVat || '';
    const transferorPosition = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.transferorPosition || '');
    const transferorName = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.transferorName || '');
    const buyerReceiverPosition = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.receiverPosition || '');
    const buyerReceiverName = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.receiverName || '');
    const directorPositionName = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.directorPositionName || '');
    const chiefAccountantPositionName = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.chiefAccountantPositionName || '');
    const shipmentAdditionalInfo = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.transferInfo || '');
    const acceptanceAdditionalInfo = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.receiverInfo || '');
    const responsiblePosition = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.sellerResponsiblePosition || '');
    const responsibleName = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.sellerResponsible || '');
    const buyerResponsiblePosition = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.buyerResponsiblePosition || '');
    const buyerResponsibleName = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.buyerResponsible || '');
    const buyerEntityName = (0, docx_template_fields_helpers_1.sanitizeEntityName)(payload.footerFields.buyerEntityName || '');
    const sellerEntityName = (0, docx_template_fields_helpers_1.sanitizeEntityName)(payload.footerFields.sellerEntityName || '');
    const transportCargoInfo = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.transportData || '');
    const transferAcceptanceBasis = (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.transferBasis || '');
    return (0, docx_template_fields_helpers_1.compactTemplateFields)({
        pages_info: payload.footerFields.pagesInfo || '',
        invoice_number: docNumber,
        invoice_date: payload.headerFields.documentDate || '',
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
        ip_authorized_person_name: (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.ipAuthorizedPersonName || ''),
        ip_details_full: (0, docx_template_fields_helpers_1.sanitizeMarkerValue)(payload.footerFields.ipDetailsFull || ''),
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
//# sourceMappingURL=docx-template-fields.js.map