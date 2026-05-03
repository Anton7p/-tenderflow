import { GridTable } from '@shared/ui';

import type { UploadExcelTableProps } from '../../types';
import { UploadExcelTableToolbar } from './upload-excel-table-toolbar';

export function UploadExcelTable(props: UploadExcelTableProps) {
  const {
    table,
    withSelection = true,
    showColumnTools = true,
    draggableColumns = true,
    horizontalScroll = false,
  } = props;

  return (
    <>
      {showColumnTools ? <UploadExcelTableToolbar table={table} /> : null}
      <GridTable
        table={table}
        withSelection={withSelection}
        draggableColumns={draggableColumns}
        horizontalScroll={horizontalScroll}
      />
    </>
  );
}
