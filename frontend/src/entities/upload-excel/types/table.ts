import type { UploadExcelRowModel } from './base';
import type { Table } from '@tanstack/react-table';

export interface UploadExcelTableProps {
  table: Table<UploadExcelRowModel>;
}

export interface UploadExcelTableConfig {
  renderEngine: any;
}
