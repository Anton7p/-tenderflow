import type {
  CounterpartiesModel,
  DocxTemplateFieldsModel,
  FooterFieldsModel,
  HeaderFieldsModel,
} from '@entities/upload-excel/api';
import type { UploadExcelRowModel } from '@entities/upload-excel/types/public';

type ModalValueHandler<T = unknown> = {
  bivarianceHack(values?: T): void;
}['bivarianceHack'];

export interface ModalState {
  name: string;
  params: unknown;
  onSubmit?: ModalValueHandler;
  onApply?: ModalValueHandler;
  onCancel?: () => void;
}

export interface Store {
  loading: boolean;
  isFileLoaded: boolean;
  modal: ModalState;
  tableData: UploadExcelRowModel[];
  originalTableData: UploadExcelRowModel[];
  counterparties: CounterpartiesModel | null;
  headerFields: HeaderFieldsModel | null;
  footerFields: FooterFieldsModel | null;
  docxFields: DocxTemplateFieldsModel | null;
  sourceFileName: string;
  rawRowsCount: number;
  setLoading: (loading: boolean) => void;
  setFileLoaded: (loaded: boolean) => void;
  setTableData: (data: UploadExcelRowModel[]) => void;
  setOriginalTableData: (data: UploadExcelRowModel[]) => void;
  setCounterparties: (data: CounterpartiesModel | null) => void;
  setHeaderFields: (data: HeaderFieldsModel | null) => void;
  setFooterFields: (data: FooterFieldsModel | null) => void;
  setDocxFields: (data: DocxTemplateFieldsModel | null) => void;
  setSourceFileName: (value: string) => void;
  setRawRowsCount: (value: number) => void;
  deleteSelectedRows: (selectedIds: string[]) => void;
  openModal: (params: {
    name: string;
    params?: unknown;
    onSubmit?: ModalValueHandler;
    onApply?: ModalValueHandler;
    onCancel?: () => void;
  }) => void;
  closeModal: () => void;
}
