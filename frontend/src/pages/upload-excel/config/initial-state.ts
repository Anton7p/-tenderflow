import type { Store } from '../types/store';

export const initialState: Omit<
  Store,
  | 'setLoading'
  | 'setFileLoaded'
  | 'setTableData'
  | 'setOriginalTableData'
  | 'setCounterparties'
  | 'setHeaderFields'
  | 'setFooterFields'
  | 'setDocxFields'
  | 'setSourceFileName'
  | 'setRawRowsCount'
  | 'deleteSelectedRows'
  | 'openModal'
  | 'closeModal'
> = {
  loading: false,
  isFileLoaded: false,
  modal: {
    name: '',
    params: null,
    onSubmit: undefined,
    onApply: undefined,
    onCancel: undefined,
  },
  tableData: [],
  originalTableData: [],
  counterparties: null,
  headerFields: null,
  footerFields: null,
  docxFields: null,
  sourceFileName: '',
  rawRowsCount: 0,
};
