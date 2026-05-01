import { useMemo } from 'react';
import { useUploadExcelTable } from '@entities/upload-excel/lib';
import type { Store } from '../../types';

export function useUploadExcelEntity(store: Store) {
  const { tableData } = store;

  const { table, selectedRowIds } = useUploadExcelTable({
    data: tableData,
  });

  return useMemo(
    () => ({
      isLoading: false,
      table,
      data: tableData,
      selectedRowIds,
    }),
    [table, tableData, selectedRowIds]
  );
}
