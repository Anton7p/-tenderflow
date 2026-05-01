import { useEffect, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  type VisibilityState,
} from '@tanstack/react-table';

import { columns } from '../config';
import type { UploadExcelRowModel } from '../types/public';
import { collectLeafColumnIds } from './column-order-utils';

const EMPTY_DATA: UploadExcelRowModel[] = [];

const LEAF_COLUMN_IDS = collectLeafColumnIds<UploadExcelRowModel>(columns);

function rowStableId(row: UploadExcelRowModel): string {
  return String(row.id ?? row.index);
}

export function useUploadExcelTable({
  data = EMPTY_DATA,
}: {
  data?: UploadExcelRowModel[];
}) {
  const [selectedRow, setSelectedRow] = useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = useState<string[]>(() => [...LEAF_COLUMN_IDS]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    const validIds = new Set(data.map((row) => rowStableId(row)));
    setSelectedRow((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const key of Object.keys(next)) {
        if (!validIds.has(key)) {
          delete next[key];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getRowId: rowStableId,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    state: {
      rowSelection: selectedRow,
      columnOrder,
      columnVisibility,
      globalFilter,
    },
    onRowSelectionChange: setSelectedRow,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const q = String(filterValue ?? '').trim().toLowerCase();
      if (!q) return true;
      return String(row.original.name ?? '').toLowerCase().includes(q);
    },
  });

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
    getRowId: rowStableId,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return { table };
}
