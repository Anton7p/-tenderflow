import { useEffect } from 'react';
import { Button, Form, Input, Spin } from 'antd';
import { Modal as SharedModal } from '@shared/ui';
import type { CounterpartiesModel, DocxTemplateFieldsModel, FooterFieldsModel, HeaderFieldsModel } from '@entities/upload-excel/api';
import uploadStyles from '../upload/styles.module.css';
import layoutStyles from './modal-layout.module.css';
import type { DocxFieldDef } from './export-word-field-groups';
import {
  FOOTER_FULL_DOCX,
  FOOTER_LEFT_DOCX,
  FOOTER_RIGHT_DOCX,
  HEADER_BAND_DOCX,
  HEADER_GOVERNMENT_DOCX,
  HEADER_LEFT_DOCX,
  HEADER_RIGHT_DOCX,
  HEADER_SIGNATURE_DOCX,
} from './export-word-field-groups';

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
  state?: { loading?: boolean };
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

function DocxFieldItem({ def }: { def: DocxFieldDef }) {
  return (
    <Form.Item
      className={layoutStyles.compactItem}
      label={
        <span className={layoutStyles.labelRow}>
          {def.marker ? <span className={layoutStyles.marker}>{def.marker}</span> : null}
          <span className={layoutStyles.labelText}>{def.label}</span>
        </span>
      }
      name={['docxFields', def.key]}
    >
      <Input />
    </Form.Item>
  );
}

export function ExportWordModal(props: ExportWordModalProps) {
  const { isOpen, onCancel, onSubmit, params, state } = props;
  const loading = Boolean(state?.loading);
  const [form] = Form.useForm<ExportWordModalValues>();

  useEffect(() => {
    if (!isOpen) return;
    form.setFieldsValue({
      headerFields: params?.headerFields ?? EMPTY_HEADER_FIELDS,
      docxFields: params?.docxFields ?? {},
    });
  }, [form, isOpen, params]);

  const customTitle = (
    <div className={uploadStyles.modalHeader}>
      <span className={uploadStyles.modalTitle}>Проверка данных перед выгрузкой в Word</span>
      <div className={uploadStyles.modalActions}>
        <Button
          type="primary"
          className={uploadStyles.primaryButton}
          loading={loading}
          disabled={loading}
          onClick={() => form.submit()}
        >
          Выгрузить
        </Button>
        <Button className={uploadStyles.secondaryButton} disabled={loading} onClick={onCancel}>
          Закрыть
        </Button>
      </div>
    </div>
  );

  return (
    <SharedModal open={isOpen} onClose={onCancel} width="1200px" height="700px" maskClosable={!loading} keyboard={!loading}>
      {customTitle}
      <div style={{ padding: '0 14px 14px', overflow: 'hidden' }}>
        <Spin spinning={loading} tip="Формирование документа на сервере…">
          <Form
            form={form}
            layout="vertical"
            size="small"
            onFinish={(values) => {
              const editedHeader = values.headerFields ?? {};
              onSubmit?.({
                counterparties: params?.counterparties ?? EMPTY_COUNTERPARTIES,
                headerFields: {
                  ...(params?.headerFields ?? EMPTY_HEADER_FIELDS),
                  ...editedHeader,
                },
                footerFields: params?.footerFields ?? EMPTY_FOOTER_FIELDS,
                docxFields: {
                  ...(params?.docxFields ?? {}),
                  ...(values.docxFields ?? {}),
                },
              });
            }}
          >
            <div className={layoutStyles.formBodyScroll}>
              <div className={layoutStyles.sheet}>
                  <div className={`${layoutStyles.sectionDivider} ${layoutStyles.sectionDividerLead}`}>
                    Шапка документа (счёт-фактура, исправление, статус)
                  </div>
                  <div className={layoutStyles.invoiceBand}>
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <Form.Item
                          label={<span className={layoutStyles.labelText}>Счет-фактура №</span>}
                          name={['docxFields', 'invoice_number']}
                          className={layoutStyles.compactItem}
                        >
                          <Input placeholder="номер" />
                        </Form.Item>
                      <Form.Item
                        label={<span className={layoutStyles.labelText}>от</span>}
                        name={['docxFields', 'invoice_date']}
                        className={layoutStyles.compactItem}
                      >
                        <Input placeholder="дата" />
                      </Form.Item>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
                      <Form.Item
                        label={<span className={layoutStyles.labelText}>Исправление №</span>}
                        name={['headerFields', 'correctionNumber']}
                        className={layoutStyles.compactItem}
                      >
                        <Input placeholder="—" />
                      </Form.Item>
                      <Form.Item
                        label={<span className={layoutStyles.labelText}>от</span>}
                        name={['headerFields', 'correctionDate']}
                        className={layoutStyles.compactItem}
                      >
                        <Input placeholder="—" />
                      </Form.Item>
                    </div>
                    <Form.Item
                      label={<span className={layoutStyles.labelText}>Статус / служебная отметка</span>}
                      name={['headerFields', 'status']}
                      className={layoutStyles.compactItem}
                    >
                      <Input />
                    </Form.Item>
                  </div>
                  <div className={layoutStyles.metaHint}>
                    Поля с номерами{' '}
                    <strong>(1)</strong>, <strong>(6)</strong>, <strong>[10]</strong> и т.д. соответствуют графам бланка
                    универсального передаточного документа (счёт-фактура).
                  </div>
                  </div>
              </div>

                <div className={layoutStyles.twoCols}>
                  <div className={layoutStyles.col}>
                    <div className={layoutStyles.colHead}>Продавец · грузоотправитель · грузополучатель</div>
                    {HEADER_LEFT_DOCX.map((def) => (
                      <DocxFieldItem key={def.key} def={def} />
                    ))}
                  </div>
                  <div className={layoutStyles.col}>
                    <div className={layoutStyles.colHead}>Покупатель · валюта</div>
                    {HEADER_RIGHT_DOCX.map((def) => (
                      <DocxFieldItem key={def.key} def={def} />
                    ))}
                  </div>
              </div>

              <div className={layoutStyles.fullBand}>
                  {HEADER_BAND_DOCX.map((def) => (
                    <DocxFieldItem key={def.key} def={def} />
                  ))}
                  {HEADER_GOVERNMENT_DOCX.map((def) => (
                    <DocxFieldItem key={def.key} def={def} />
                  ))}
              </div>

              <div className={layoutStyles.signatureBand}>
                  <div className={layoutStyles.colHead}>Подписи и реквизиты ИП (верх бланка)</div>
                  {HEADER_SIGNATURE_DOCX.map((def) => (
                    <DocxFieldItem key={def.key} def={def} />
                  ))}
              </div>

              <div className={layoutStyles.sectionDivider}>Подвал документа (передача, подписи)</div>

              <div className={layoutStyles.footerIntro}>
                  <div className={layoutStyles.metaHint} style={{ marginBottom: 12 }}>
                    Блок как на нижней части УПД: слева — продавец (передал), справа — покупатель (получил).
                  </div>
                  {FOOTER_FULL_DOCX.map((def) => (
                    <DocxFieldItem key={def.key} def={def} />
                  ))}
              </div>

              <div className={layoutStyles.footerTwoCols}>
                  <div className={layoutStyles.footerCol}>
                    <div className={layoutStyles.footerColTitle}>Передал (продавец)</div>
                    {FOOTER_LEFT_DOCX.map((def) => (
                      <DocxFieldItem key={def.key} def={def} />
                    ))}
                  </div>
                  <div className={layoutStyles.footerCol}>
                    <div className={layoutStyles.footerColTitle}>Получил (покупатель)</div>
                    {FOOTER_RIGHT_DOCX.map((def) => (
                      <DocxFieldItem key={def.key} def={def} />
                    ))}
                  </div>
              </div>
            </div>
          </Form>
        </Spin>
      </div>
    </SharedModal>
  );
}
