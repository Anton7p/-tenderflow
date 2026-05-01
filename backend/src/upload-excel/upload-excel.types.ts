export interface UploadExcelRowDto {
  id: string;
  productCode: string;
  index: number;
  name: string;
  typeCode: string;
  unitCode: string;
  unitName: string;
  quantity: number;
  quantityRaw?: number;
  price: number;
  totalBeforeTax: number;
  totalBeforeTaxRaw?: number;
  excise: string;
  taxRate: string;
  taxAmount: number;
  taxAmountRaw?: number;
  totalWithTax: number;
  totalWithTaxRaw?: number;
  countryCode: string;
  countryName: string;
  declarationNum: string;
}

export interface CounterpartiesDto {
  sellerName: string;
  sellerAddress: string;
  sellerInnKpp: string;
  buyerName: string;
  buyerAddress: string;
  buyerInnKpp: string;
}

export interface HeaderFieldsDto {
  status: string;
  documentNumber: string;
  documentDate: string;
  correctionNumber: string;
  correctionDate: string;
  shipperNameAddress: string;
  consigneeFull: string;
  paymentDoc: string;
  shipmentDoc: string;
  advanceInvoiceRef: string;
  currency: string;
  contractId: string;
  baseDocument: string;
}

export interface FooterFieldsDto {
  pagesInfo: string;
  directorPositionName: string;
  chiefAccountantPositionName: string;
  transferBasis: string;
  transportData: string;
  transferDate: string;
  transferInfo: string;
  receiverDate: string;
  receiverInfo: string;
  sellerResponsible: string;
  buyerResponsible: string;
  sellerResponsiblePosition: string;
  buyerResponsiblePosition: string;
  sellerEntityName: string;
  buyerEntityName: string;
  transferorPosition: string;
  transferorName: string;
  receiverPosition: string;
  receiverName: string;
  ipAuthorizedPersonName: string;
  ipDetailsFull: string;
  itemTotalAmountWithoutVat: string;
  itemTotalVatAmount: string;
  itemTotalWithVat: string;
}

export interface DocxTemplateFieldsDto {
  pages_info: string;
  invoice_number: string;
  document_number: string;
  document_date: string;
  correction_number: string;
  correction_date: string;
  upd_status: string;
  seller_name: string;
  seller_address: string;
  seller_inn: string;
  seller_kpp: string;
  consignor: string;
  payment_doc_number: string;
  ship_doc_number: string;
  ship_date: string;
  buyer_name: string;
  buyer_address: string;
  buyer_inn: string;
  buyer_kpp: string;
  consignee: string;
  currency_name: string;
  currency_code: string;
  contract_id: string;
  operation_content: string;
  base_document: string;
  transfer_acceptance_basis: string;
  transport_cargo_info: string;
  transfer_position: string;
  transfer_name: string;
  shipment_date: string;
  additional_info: string;
  responsible_position: string;
  responsible_name: string;
  document_creator_entity_name: string;
  buyer_responsible_position: string;
  buyer_responsible_name: string;
  buyer_document_creator_entity_name: string;
  receiver_position: string;
  receiver_name: string;
  buyer_receiver_position: string;
  buyer_receiver_name: string;
  acceptance_date: string;
  acceptance_additional_info: string;
  item_code: string;
  item_line_no: string;
  item_name: string;
  item_type_code: string;
  item_unit_code: string;
  item_unit_name: string;
  item_quantity: string;
  item_price: string;
  item_amount_without_vat: string;
  item_excise: string;
  item_vat_rate: string;
  item_vat_amount: string;
  item_total_with_vat: string;
  item_country_code: string;
  item_country_name: string;
  item_declaration_number: string;
  item_total_amount_without_vat: string;
  item_total_vat_amount: string;
  item_total_with_vat_summary: string;
  advance_invoice_ref_full: string;
  shipping_doc_full: string;
  payment_doc_full: string;
  consignee_full: string;
  shipper_name_address: string;
  seller_inn_kpp: string;
  buyer_inn_kpp: string;
  currency_full: string;
  government_contract_id: string;
  transferor_position: string;
  transferor_name: string;
  shipment_additional_info: string;
  director_position_name: string;
  chief_accountant_position_name: string;
  ip_authorized_person_name: string;
  ip_details_full: string;
  invoice_date: string;
}

export interface UploadExcelResponseDto {
  tableData: UploadExcelRowDto[];
  editableDocxFields: Partial<DocxTemplateFieldsDto>;
  rawRowsCount: number;
  sourceFileName: string;
}

export interface GenerateDocxRequestDto {
  tableData: UploadExcelRowDto[];
  counterparties: CounterpartiesDto;
  headerFields?: HeaderFieldsDto;
  footerFields?: FooterFieldsDto;
  docxFields?: Partial<DocxTemplateFieldsDto>;
  rawRowsCount?: number;
  sourceFileName?: string;
}
