export interface UploadExcelRowModel {
  id: string;
  productCode: string;
  index: number;
  name: string;
  typeCode: string;
  unitCode: string;
  unitName: string;
  quantity: number;
  price: number;
  totalBeforeTax: number;
  excise: string;
  taxRate: string;
  taxAmount: number;
  totalWithTax: number;
  countryCode: string;
  countryName: string;
  declarationNum: string;
}
