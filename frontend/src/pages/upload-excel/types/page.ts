import type { PageActionsVisibility } from './ui';
import type { Store, ModalState } from './store';
import type { UploadExcelRowModel } from '@entities/upload-excel/types/public';
import type { Table } from '@tanstack/react-table';
import type { PageBaseAction } from '@shared/ui/components/page-actions/types';

export interface PageState {
  loading: boolean;
  isFileLoaded: boolean;
  modal: ModalState;
  table: Table<UploadExcelRowModel>;
  tableData: UploadExcelRowModel[];
  selectedRowIds: string[];
}

export interface PageActions {
  actionsVisibility: PageActionsVisibility;
  onAction: (action: PageBaseAction) => void;
}

export interface Page {
  state: PageState;
  actions: PageActions;
}

export interface UsePageStateProps {
  store: Store;
}

export interface UsePageActionsProps {
  store: Store;
  state: PageState;
}
