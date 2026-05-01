import { useMemo } from 'react';
import { useUploadExcelEntity } from '../entities/use-upload-excel-entity';
import type { PageState, UsePageStateProps } from '../../types';

export function usePageState(props: UsePageStateProps): PageState {
  const { store } = props;
  const entity = useUploadExcelEntity(store);

  return useMemo(
    () => ({
      loading: store.loading,
      isFileLoaded: store.isFileLoaded,
      modal: store.modal,
      table: entity.table,
      tableData: entity.data,
      selectedRowIds: entity.selectedRowIds,
    }),
    [store.loading, store.isFileLoaded, store.modal, entity.table, entity.data, entity.selectedRowIds]
  );
}
