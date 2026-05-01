import { useMemo } from 'react';
import { ActionsEnum, ModalsEnum } from '../../config';
import { ModalActionsEnum, notify } from '@shared/lib';
import { useActionsHandler } from '@shared/ui/components/page-actions';
import { usePageActionsVisibility } from './use-page-actions-visibility';
import {
  generateWordDocx,
  uploadExcelFile,
} from '@entities/upload-excel/api';
import type { DocxTemplateFieldsModel, FooterFieldsModel } from '@entities/upload-excel/api/upload-excel-api';
import type { PageActions, UsePageActionsProps } from '../../types';
import type { UploadExcelRowModel } from '@entities/upload-excel/types/public';
import type { PageBaseAction } from '@shared/ui/components/page-actions/types';

const EMPTY_COUNTERPARTIES = {
  sellerName: '',
  sellerAddress: '',
  sellerInnKpp: '',
  buyerName: '',
  buyerAddress: '',
  buyerInnKpp: '',
};

const EMPTY_HEADER_FIELDS = {
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

export function usePageActions(props: UsePageActionsProps): PageActions {
  const { store, state } = props;

  const actionsVisibility = usePageActionsVisibility({ state });

  const handlers = useMemo(
    () => ({
      [ModalActionsEnum.SUBMIT]: (action: PageBaseAction) => {
        if (store.modal.onSubmit) {
          store.modal.onSubmit(action.payload);
          return;
        }
        store.closeModal();
      },
      [ModalActionsEnum.CANCEL]: () => {
        if (store.modal.onCancel) {
          store.modal.onCancel();
          return;
        }
        store.closeModal();
      },
      [ModalActionsEnum.APPLY]: (action: PageBaseAction) => {
        if (store.modal.onApply) {
          store.modal.onApply(action.payload);
          return;
        }
      },
      [ActionsEnum.UPLOAD_EXCEL]: () => {
        store.openModal({
          name: ModalsEnum.UPLOAD_EXCEL,
          params: null,
          onSubmit: async (file: File) => {
            if (!file) {
              notify.error({ message: 'Сначала выберите Excel файл' });
              return;
            }
            try {
              store.setLoading(true);
              const response = await uploadExcelFile(file);
              console.log('[upload-excel/ui] apply upload payload', {
                tableDataLength: response.tableData.length,
              });
              store.setTableData(response.tableData || []);
              store.setOriginalTableData(response.tableData || []);
              store.setCounterparties(EMPTY_COUNTERPARTIES);
              store.setHeaderFields(EMPTY_HEADER_FIELDS);
              store.setFooterFields(EMPTY_FOOTER_FIELDS);
              store.setDocxFields(response.editableDocxFields);
              store.setSourceFileName(response.sourceFileName || '');
              store.setRawRowsCount(response.rawRowsCount || 0);
              store.setFileLoaded(true);
              store.closeModal();
              notify.success({ message: 'Файл успешно загружен' });
            } catch (error) {
              console.error('[upload-excel/ui] upload failed', error);
              notify.error({ message: 'Не удалось загрузить и обработать файл (нет tableData)' });
            } finally {
              store.setLoading(false);
            }
          },
          onCancel: () => {
            store.closeModal();
          },
        });
      },
      [ActionsEnum.CREATE_POSITION]: () => {
        store.openModal({
          name: ModalsEnum.POSITION,
          params: { mode: 'create' },
          onApply: (values?: UploadExcelRowModel) => {
            if (!values) return;
            const maxIndex = store.tableData.reduce(
              (max: number, row: UploadExcelRowModel) =>
                Math.max(max, Number(row.index) || 0),
              0
            );
            const newRow = {
              ...values,
              id: `row-${Date.now()}`,
              index: Number(values.index) || maxIndex + 1,
            };
            store.setTableData([...store.tableData, newRow]);
            store.setFileLoaded(true);
            store.closeModal();
            notify.success({ message: 'Позиция создана' });
          },
          onCancel: () => store.closeModal(),
        });
      },
      [ActionsEnum.EDIT_POSITION]: () => {
        const selectedIds = state.selectedRowIds || [];
        if (selectedIds.length !== 1) {
          return;
        }

        const selectedId = selectedIds[0];
        const selectedRow = store.tableData.find(
          (row: UploadExcelRowModel) => String(row.id ?? row.index) === selectedId
        );
        if (!selectedRow) {
          return;
        }

        store.openModal({
          name: ModalsEnum.POSITION,
          params: { mode: 'edit', row: selectedRow },
          onApply: (values?: Partial<UploadExcelRowModel>) => {
            if (!values) return;
            store.setTableData(
              store.tableData.map((row: UploadExcelRowModel) =>
                String(row.id ?? row.index) === selectedId
                  ? { ...row, ...values, id: row.id }
                  : row
              )
            );
            store.closeModal();
            notify.success({ message: 'Позиция обновлена' });
          },
          onCancel: () => store.closeModal(),
        });
      },
      [ActionsEnum.EXPORT_WORD]: async () => {
        if (!store.tableData.length) {
          notify.error({ message: 'Нет данных для формирования документа' });
          return;
        }
        store.openModal({
          name: ModalsEnum.EXPORT_WORD,
          params: {
            counterparties: store.counterparties ?? EMPTY_COUNTERPARTIES,
            headerFields: store.headerFields ?? EMPTY_HEADER_FIELDS,
            footerFields: store.footerFields ?? EMPTY_FOOTER_FIELDS,
            docxFields: store.docxFields ?? {},
          },
          onSubmit: async (values?: {
            counterparties?: typeof EMPTY_COUNTERPARTIES;
            headerFields?: typeof EMPTY_HEADER_FIELDS;
            footerFields?: FooterFieldsModel;
            docxFields?: DocxTemplateFieldsModel;
          }) => {
            try {
              const { blob, fileName } = await generateWordDocx({
                tableData: store.tableData,
                counterparties: values?.counterparties ?? store.counterparties ?? EMPTY_COUNTERPARTIES,
                headerFields: values?.headerFields ?? store.headerFields ?? EMPTY_HEADER_FIELDS,
                footerFields: values?.footerFields ?? store.footerFields ?? EMPTY_FOOTER_FIELDS,
                docxFields: values?.docxFields ?? store.docxFields ?? {},
                rawRowsCount: store.rawRowsCount || store.tableData.length,
                sourceFileName: store.sourceFileName || '',
              });
              store.setCounterparties(values?.counterparties ?? store.counterparties ?? EMPTY_COUNTERPARTIES);
              store.setHeaderFields(values?.headerFields ?? store.headerFields ?? EMPTY_HEADER_FIELDS);
              store.setFooterFields(values?.footerFields ?? store.footerFields ?? EMPTY_FOOTER_FIELDS);
              store.setDocxFields(values?.docxFields ?? store.docxFields ?? {});
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName;
              link.click();
              URL.revokeObjectURL(url);
              store.closeModal();
              notify.success({ message: 'Word документ выгружен' });
            } catch {
              notify.error({ message: 'Не удалось сформировать Word документ' });
            }
          },
          onCancel: () => store.closeModal(),
        });
      },
      [ActionsEnum.GROUP_POSITIONS]: () => {
        const selectedIds = state.selectedRowIds || [];
        if (selectedIds.length < 2) {
          return;
        }
        const selectedRows = store.tableData.filter((row: UploadExcelRowModel) =>
          selectedIds.includes(String(row.id ?? row.index))
        );
        store.openModal({
          name: ModalsEnum.GROUP_POSITIONS,
          params: { rows: selectedRows },
          onApply: () => {
            notify.success({ message: 'Параметры группировки применены' });
          },
          onCancel: () => store.closeModal(),
        });
      },
      [ActionsEnum.DELETE]: () => {
        const selectedIds = state.selectedRowIds || [];
        if (selectedIds.length === 0) return;
        store.deleteSelectedRows(selectedIds);
        notify.success({ message: `Удалено строк: ${selectedIds.length}` });
      },
      [ActionsEnum.CLEAR]: () => {
        store.setFileLoaded(false);
        store.setTableData([]);
        store.setOriginalTableData([]);
        store.setCounterparties(null);
        store.setHeaderFields(null);
        store.setFooterFields(null);
        store.setDocxFields(null);
        store.setSourceFileName('');
        store.setRawRowsCount(0);
        console.log('Clear action');
      },
    }),
    [store, state]
  );

  const onAction = useActionsHandler(handlers);

  return useMemo(() => ({ actionsVisibility, onAction }), [actionsVisibility, onAction]);
}
