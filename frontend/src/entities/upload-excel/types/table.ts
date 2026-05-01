import type { UploadExcelRowModel } from './base';
import type { Table } from '@tanstack/react-table';

export interface UploadExcelTableProps {
  table: Table<UploadExcelRowModel>;
  withSelection?: boolean;
  /** Панель: поиск по наименованию, видимость колонок (можно вынести в PageLayout filter) */
  showColumnTools?: boolean;
  /** Перетаскивание заголовков колонок (на главной странице обычно true даже без встроенного тулбара) */
  draggableColumns?: boolean;
}

export interface UploadExcelTableConfig {
  renderEngine: any;
}
