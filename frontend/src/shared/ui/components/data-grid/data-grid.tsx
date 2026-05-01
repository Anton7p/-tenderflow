import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { Table } from 'antd';
import styles from './data-grid.module.css';

interface DataGridProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

export const DataGrid = <T,>({ columns, data, onRowClick }: DataGridProps<T>) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  const antColumns = table.getHeaderGroups().map((headerGroup) =>
    headerGroup.headers.map((header) => ({
      title: header.isPlaceholder
        ? ''
        : flexRender(header.column.columnDef.header, header.getContext()),
      dataIndex: header.id,
      key: header.id,
    }))
  )[0];

  const antDataSource = data.map((row, index) => ({
    key: index,
    ...row,
  }));

  return (
    <div className={styles.container}>
      <Table
        columns={antColumns}
        dataSource={antDataSource}
        bordered
        size="middle"
        onRow={(record) => ({
          onClick: () => onRowClick?.(record as T),
        })}
        pagination={false}
      />
    </div>
  );
};
