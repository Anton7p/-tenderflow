import { createColumnHelper } from '@tanstack/react-table';
import { formatMoneyDisplay } from '../lib/format-money-display';
import { formatQuantityDisplay } from '../lib/format-quantity-display';
import type { UploadExcelRowModel } from '../types/public';

const columnHelper = createColumnHelper<UploadExcelRowModel>();

export const columns = [

  columnHelper.group({
    id: 'group_productCode',
    header: ' ',
    columns: [
      columnHelper.accessor('productCode', {
        header: 'Код товара/ работ, услуг',
        size: 60,
      }),
    ],
  }),

  // 1 - № п/п
  columnHelper.group({
    id: 'group_index',
    header: ' ',
    columns: [
      columnHelper.accessor('index', {
        header: '№ п/п',
        size: 40,
      }),
    ],
  }),

  // 1а - Наименование
  columnHelper.group({
    id: 'group_name',
    header: ' ',
    columns: [
      columnHelper.accessor('name', {
        header: 'Наименование товара (описание выполненных работ, оказанных услуг), имущественного права',
        size: 280,
        meta: { isName: true },
      }),
    ],
  }),

  // 2 - Код вида товара
  columnHelper.group({
    id: 'group_typeCode',
    header: ' ',
    columns: [
      columnHelper.accessor('typeCode', {
        header: 'Код вида товара',
        size: 60,
      }),
    ],
  }),

  columnHelper.group({
    id: 'group_units',
    header: 'Единица измерения',
    columns: [
      columnHelper.accessor('unitCode', {
        header: 'код',
        size: 50,
      }),
      columnHelper.accessor('unitName', {
        header: 'условное обозначение (национальное)',
        size: 76,
      }),
    ],
  }),

  // 3 - Количество
  columnHelper.group({
    id: 'group_quantity',
    header: ' ',
    columns: [
      columnHelper.accessor('quantity', {
        header: 'Количество (объем)',
        footer: ({ table }) =>
          formatQuantityDisplay(
            table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.quantity, 0)
          ),
        meta: { isNumeric: true },
        cell: (info) => formatQuantityDisplay(info.getValue()),
        size: 76,
      }),
    ],
  }),

  // 4 - Цена
  columnHelper.group({
    id: 'group_price',
    header: ' ',
    columns: [
      columnHelper.accessor('price', {
        header: 'Цена (тариф) за единицу измерения',
        footer: '',
        meta: { isNumeric: true, isMoney: true },
        cell: (info) => formatMoneyDisplay(info.getValue()),
        size: 86,
      }),
    ],
  }),

  // 5 - Стоимость без налога
  columnHelper.group({
    id: 'group_totalBeforeTax',
    header: ' ',
    columns: [
      columnHelper.accessor('totalBeforeTax', {
        header: 'Стоимость товаров (работ, услуг), имущественных прав без налога - всего',
        footer: ({ table }) =>
          formatMoneyDisplay(
            table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.totalBeforeTax, 0)
          ),
        meta: { isNumeric: true, isMoney: true },
        cell: (info) => formatMoneyDisplay(info.getValue()),
        size: 96,
      }),
    ],
  }),

  // 6 - Акциз
  columnHelper.group({
    id: 'group_excise',
    header: ' ',
    columns: [
      columnHelper.accessor('excise', {
        header: 'В том числе сумма акциза',
        footer: '',
        meta: { isNumeric: true },
        size: 76,
      }),
    ],
  }),

  // 7 - Ставка НДС
  columnHelper.group({
    id: 'group_taxRate',
    header: ' ',
    columns: [
      columnHelper.accessor('taxRate', {
        header: 'Налоговая ставка',
        footer: 'Итого:',
        meta: { isNumeric: true },
        size: 70,
      }),
    ],
  }),

  // 8 - Сумма НДС
  columnHelper.group({
    id: 'group_taxAmount',
    header: ' ',
    columns: [
      columnHelper.accessor('taxAmount', {
        header: 'Сумма налога, предъявляемая покупателю',
        footer: ({ table }) =>
          formatMoneyDisplay(
            table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.taxAmount, 0)
          ),
        meta: { isNumeric: true, isMoney: true },
        cell: (info) => formatMoneyDisplay(info.getValue()),
        size: 86,
      }),
    ],
  }),

  // 9 - Стоимость с налогом
  columnHelper.group({
    id: 'group_totalWithTax',
    header: ' ',
    columns: [
      columnHelper.accessor('totalWithTax', {
        header: 'Стоимость товаров (работ, услуг), имущественных прав с налогом - всего',
        footer: ({ table }) =>
          formatMoneyDisplay(
            table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.totalWithTax, 0)
          ),
        meta: { isNumeric: true, isMoney: true },
        cell: (info) => formatMoneyDisplay(info.getValue()),
        size: 96,
      }),
    ],
  }),

  // 10, 10а, 11 - Страна и декларация
  columnHelper.group({
    id: 'group_origin',
    header: 'Страна происхождения товара',
    columns: [
      columnHelper.accessor('countryCode', {
        header: 'цифровой код',
        size: 50,
      }),
      columnHelper.accessor('countryName', {
        header: 'краткое наименование',
        size: 70,
      }),
    ],
  }),

  columnHelper.group({
    id: 'group_declarationNum',
    header: ' ',
    columns: [
      columnHelper.accessor('declarationNum', {
        header:
          'Регистрационный номер декларации на товары или регистрационный номер партии товара, подлежащего прослеживаемости',
        meta: { isNumeric: true },
        size: 96,
      }),
    ],
  }),

];
