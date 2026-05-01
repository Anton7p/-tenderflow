import { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { Modal as SharedModal } from '@shared/ui';
import type { CounterpartiesModel, DocxTemplateFieldsModel, FooterFieldsModel, HeaderFieldsModel } from '@entities/upload-excel/api';
import styles from '../upload/styles.module.css';

interface ExportWordModalValues {
  counterparties: CounterpartiesModel;
  headerFields: HeaderFieldsModel;
  footerFields: FooterFieldsModel;
  docxFields: DocxTemplateFieldsModel;
}

interface ExportWordModalProps {
  isOpen: boolean;
  params: ExportWordModalValues | null;
  onCancel: () => void;
  onSubmit?: (values: ExportWordModalValues) => void;
}

const EMPTY_COUNTERPARTIES: CounterpartiesModel = {
  sellerName: '',
  sellerAddress: '',
  sellerInnKpp: '',
  buyerName: '',
  buyerAddress: '',
  buyerInnKpp: '',
};

const EMPTY_HEADER_FIELDS: HeaderFieldsModel = {
  status: '',
  documentNumber: '',
  documentDate: '',
  correctionNumber: '',
  correctionDate: '',
  paymentDoc: '',
  shipmentDoc: '',
  currency: '',
  contractId: '',
  baseDocument: '',
};

const EMPTY_FOOTER_FIELDS: FooterFieldsModel = {
  pagesInfo: '',
  transferBasis: '',
  transportData: '',
  transferDate: '',
  transferInfo: '',
  receiverDate: '',
  receiverInfo: '',
  sellerResponsible: '',
  buyerResponsible: '',
  sellerEntityName: '',
  buyerEntityName: '',
};

const DOCX_EDITABLE_FIELDS: Array<{ key: string; label: string }> = [
  { key: 'invoice_number', label: 'Счет-фактура №' },
  { key: 'invoice_date', label: 'Дата счета-фактуры' },
  { key: 'seller_name', label: 'Продавец' },
  { key: 'buyer_name', label: 'Покупатель' },
  { key: 'seller_address', label: 'Адрес продавца' },
  { key: 'buyer_address', label: 'Адрес покупателя' },
  { key: 'seller_inn_kpp', label: 'ИНН/КПП продавца' },
  { key: 'buyer_inn_kpp', label: 'ИНН/КПП покупателя' },
  { key: 'shipper_name_address', label: 'Грузоотправитель и его адрес' },
  { key: 'consignee_full', label: 'Грузополучатель и его адрес' },
  { key: 'currency_full', label: 'Валюта: наименование, код' },
  { key: 'government_contract_id', label: 'Идентификатор государственного контракта (при наличии)' },
  { key: 'payment_doc_full', label: 'К платежно-расчетному документу № (5)' },
  { key: 'shipping_doc_full', label: 'Документ об отгрузке (5а)' },
  { key: 'advance_invoice_ref_full', label: 'К счету-фактуре ... (5б)' },
  { key: 'director_position_name', label: 'Руководитель организации / иное уполномоченное лицо' },
  { key: 'chief_accountant_position_name', label: 'Главный бухгалтер / иное уполномоченное лицо' },
  { key: 'ip_authorized_person_name', label: 'ИП или иное уполномоченное лицо (ФИО)' },
  { key: 'ip_details_full', label: 'ОГРНИП и дата присвоения номера' },
  { key: 'transfer_acceptance_basis', label: 'Основание передачи (сдачи) / получения (приемки) [8]' },
  { key: 'transport_cargo_info', label: 'Данные о транспортировке и грузе [9]' },
  { key: 'transferor_position', label: 'Товар (груз) передал - должность [10]' },
  { key: 'transferor_name', label: 'Товар (груз) передал - ФИО [10]' },
  { key: 'buyer_receiver_position', label: 'Товар (груз) получил - должность [15]' },
  { key: 'buyer_receiver_name', label: 'Товар (груз) получил - ФИО [15]' },
  { key: 'shipment_date', label: 'Дата отгрузки, передачи (сдачи) [11]' },
  { key: 'acceptance_date', label: 'Дата получения (приемки) [16]' },
  { key: 'shipment_additional_info', label: 'Иные сведения об отгрузке, передаче [12]' },
  { key: 'acceptance_additional_info', label: 'Иные сведения о получении, приемке [17]' },
  { key: 'responsible_position', label: 'Ответственный за правильность (должность) [13]' },
  { key: 'responsible_name', label: 'Ответственный за правильность (ФИО) [13]' },
  { key: 'buyer_responsible_position', label: 'Ответственный покупателя (должность) [18]' },
  { key: 'buyer_responsible_name', label: 'Ответственный покупателя (ФИО) [18]' },
  {
    key: 'document_creator_entity_name',
    label: 'Наименование экономического субъекта – составителя документа (в т.ч. комиссионера / агента) [14]',
  },
  {
    key: 'buyer_document_creator_entity_name',
    label: 'Наименование экономического субъекта – составителя документа [19]',
  },
];

export function ExportWordModal(props: ExportWordModalProps) {
  const { isOpen, onCancel, onSubmit, params } = props;
  const [form] = Form.useForm<ExportWordModalValues>();

  useEffect(() => {
    if (!isOpen) return;
    form.setFieldsValue({
      counterparties: params?.counterparties ?? EMPTY_COUNTERPARTIES,
      headerFields: params?.headerFields ?? EMPTY_HEADER_FIELDS,
      footerFields: params?.footerFields ?? EMPTY_FOOTER_FIELDS,
      docxFields: params?.docxFields ?? {},
    });
  }, [form, isOpen, params]);

  const customTitle = (
    <div className={styles.modalHeader}>
      <span className={styles.modalTitle}>Проверка данных перед выгрузкой в Word</span>
      <div className={styles.modalActions}>
        <Button
          type="primary"
          className={styles.primaryButton}
          onClick={() => form.submit()}
        >
          Выгрузить
        </Button>
        <Button className={styles.secondaryButton} onClick={onCancel}>
          Закрыть
        </Button>
      </div>
    </div>
  );

  return (
    <SharedModal open={isOpen} onClose={onCancel} width="1200px" height="700px">
      {customTitle}
      <div style={{ padding: '0 14px 14px', overflow: 'auto' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            onSubmit?.({
              ...values,
              docxFields: {
                ...(params?.docxFields ?? {}),
                ...(values.docxFields ?? {}),
              },
            });
          }}
        >
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Поля шаблона Word (full)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
            {DOCX_EDITABLE_FIELDS.map((field) => (
              <Form.Item key={field.key} label={field.label} name={['docxFields', field.key]}>
                <Input />
              </Form.Item>
            ))}
          </div>

        </Form>
      </div>
    </SharedModal>
  );
}
