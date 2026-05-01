export type DocxFieldDef = { key: string; label: string; marker: string };

/** Левая колонка шапки УПД — продавец и связанные реквизиты */
export const HEADER_LEFT_DOCX: DocxFieldDef[] = [
  { key: 'seller_name', label: 'Продавец', marker: '(1)' },
  { key: 'seller_address', label: 'Адрес', marker: '(1a)' },
  { key: 'seller_inn_kpp', label: 'ИНН/КПП продавца', marker: '(2)' },
  { key: 'shipper_name_address', label: 'Грузоотправитель и его адрес', marker: '(3)' },
  { key: 'consignee_full', label: 'Грузополучатель и его адрес', marker: '(4)' },
];

/** Правая колонка шапки — покупатель и валюта */
export const HEADER_RIGHT_DOCX: DocxFieldDef[] = [
  { key: 'buyer_name', label: 'Покупатель', marker: '(6)' },
  { key: 'buyer_address', label: 'Адрес', marker: '(6a)' },
  { key: 'buyer_inn_kpp', label: 'ИНН/КПП покупателя', marker: '(6б)' },
  { key: 'currency_full', label: 'Наименование валюты, код', marker: '(7)' },
];

/** Полная ширина под колонками: п. 5, 5а, 5б */
export const HEADER_BAND_DOCX: DocxFieldDef[] = [
  { key: 'payment_doc_full', label: 'К платежно-расчётному документу №', marker: '(5)' },
  { key: 'shipping_doc_full', label: 'Документ об отгрузке', marker: '(5a)' },
  { key: 'advance_invoice_ref_full', label: 'К счету-фактуре на передачу (прослеживаемость и др.)', marker: '(5б)' },
];

/** Идентификатор госконтракта — отдельная полоса как в бланке */
export const HEADER_GOVERNMENT_DOCX: DocxFieldDef[] = [
  {
    key: 'government_contract_id',
    label: 'Идентификатор государственного контракта, договора (соглашения) (при наличии)',
    marker: '(ид)',
  },
];

/** Руководитель, бухгалтер, ИП — блок как в верхней части бланка */
export const HEADER_SIGNATURE_DOCX: DocxFieldDef[] = [
  {
    key: 'director_position_name',
    label: 'Руководитель организации / иное уполномоченное лицо (должность, подпись, ФИО)',
    marker: '',
  },
  {
    key: 'chief_accountant_position_name',
    label: 'Главный бухгалтер / иное уполномоченное лицо (должность, подпись, ФИО)',
    marker: '',
  },
  { key: 'ip_authorized_person_name', label: 'Индивидуальный предприниматель или иное лицо (ФИО)', marker: '' },
  { key: 'ip_details_full', label: 'ОГРНИП, дата присвоения ОГРНИП', marker: '' },
];

/** Подвал Word: общие строки [8], [9] */
export const FOOTER_FULL_DOCX: DocxFieldDef[] = [
  {
    key: 'transfer_acceptance_basis',
    label: 'Основание передачи (сдачи) / получения (приёмки)',
    marker: '[8]',
  },
  { key: 'transport_cargo_info', label: 'Данные о транспортировке и грузе', marker: '[9]' },
];

/** Левая колонка подвала — передал (продавец) */
export const FOOTER_LEFT_DOCX: DocxFieldDef[] = [
  { key: 'transferor_position', label: 'Товар (груз) передал — должность', marker: '[10]' },
  { key: 'transferor_name', label: 'Товар (груз) передал — Ф.И.О.', marker: '[10]' },
  { key: 'shipment_date', label: 'Дата отгрузки, передачи (сдачи)', marker: '[11]' },
  { key: 'shipment_additional_info', label: 'Иные сведения об отгрузке, передаче', marker: '[12]' },
  { key: 'responsible_position', label: 'Ответственный за правильность оформления — должность', marker: '[13]' },
  { key: 'responsible_name', label: 'Ответственный за правильность оформления — Ф.И.О.', marker: '[13]' },
  {
    key: 'document_creator_entity_name',
    label: 'Наименование экономического субъекта — составителя документа',
    marker: '[14]',
  },
];

/** Правая колонка подвала — получил (покупатель) */
export const FOOTER_RIGHT_DOCX: DocxFieldDef[] = [
  { key: 'buyer_receiver_position', label: 'Товар (груз) получил — должность', marker: '[15]' },
  { key: 'buyer_receiver_name', label: 'Товар (груз) получил — Ф.И.О.', marker: '[15]' },
  { key: 'acceptance_date', label: 'Дата получения (приёмки)', marker: '[16]' },
  { key: 'acceptance_additional_info', label: 'Иные сведения о получении, приёмке', marker: '[17]' },
  { key: 'buyer_responsible_position', label: 'Ответственный покупателя — должность', marker: '[18]' },
  { key: 'buyer_responsible_name', label: 'Ответственный покупателя — Ф.И.О.', marker: '[18]' },
  {
    key: 'buyer_document_creator_entity_name',
    label: 'Наименование экономического субъекта — составителя документа',
    marker: '[19]',
  },
];
