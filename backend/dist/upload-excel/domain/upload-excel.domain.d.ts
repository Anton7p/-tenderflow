export interface UploadExcelRow {
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
export interface Counterparties {
    sellerName: string;
    sellerAddress: string;
    sellerInnKpp: string;
    buyerName: string;
    buyerAddress: string;
    buyerInnKpp: string;
}
export interface HeaderFields {
    documentNumber: string;
    documentDate: string;
    shipperNameAddress: string;
    consigneeFull: string;
    paymentDoc: string;
    shipmentDoc: string;
    advanceInvoiceRef: string;
    currency: string;
    contractId: string;
}
export interface FooterFields {
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
export interface DocxTemplateFields {
    [key: string]: string;
}
export interface ParsedExcelDocument {
    tableData: UploadExcelRow[];
    counterparties: Counterparties;
    headerFields: HeaderFields;
    footerFields: FooterFields;
    docxFields?: DocxTemplateFields;
    rawRowsCount: number;
    sourceFileName: string;
}
