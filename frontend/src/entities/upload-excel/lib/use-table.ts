
import {  useState } from 'react';
import { useReactTable, getCoreRowModel, getGroupedRowModel } from '@tanstack/react-table';

import { columns } from '../config';
import type { UploadExcelRowModel } from '../types/public';

const EMPTY_DATA: UploadExcelRowModel[] = [];

export function useUploadExcelTable({
  data = EMPTY_DATA,
}: {
  data?: UploadExcelRowModel[];
}) {
  const [selectedRow, setSelectedRow] = useState({});


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    state: {
      rowSelection:selectedRow,
    },
    onRowSelectionChange: setSelectedRow
    },
  )
const selectedRowIds = table.getSelectedRowModel().flatRows.map((row) => row.id);
  return {
    table,
    selectedRowIds,
  };
}

export function useUploadExcelReadonlyTable({
  data = EMPTY_DATA,
}: {
  data?: UploadExcelRowModel[];

}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()

  });

  return { table };
}
