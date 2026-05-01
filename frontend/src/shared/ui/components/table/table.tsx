import { flexRender } from '@tanstack/react-table';
import type { Table } from '@tanstack/react-table';
import styles from './table.module.css';

interface UniversalTableProps<TData> {
  table: Table<TData>;
}

export function UniversalTable<TData>({ table }: UniversalTableProps<TData>) {
  if (!table) return null;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <th data-select="true"></th>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ width: header.getSize() !== 150 ? header.getSize() : 'auto' }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              data-selected={row.getIsSelected()}
              onClick={() => row.toggleSelected()}
            >
              <td data-select="true">
                <input
                  type="checkbox"
                  checked={row.getIsSelected()}
                  onChange={(e) => row.toggleSelected(e.target.checked)}
                />
              </td>
              {row.getVisibleCells().map((cell) => {
                const columnDef = cell.column.columnDef;
                const meta = columnDef.meta as any;

                return (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    data-numeric={meta?.isNumeric}
                  >
                    {flexRender(columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th data-select="true"></th>
            {table.getVisibleLeafColumns().map((column) => {
              const footer = column.columnDef.footer;
              const meta = column.columnDef.meta as any;
              return (
                <th
                  key={column.id}
                  style={{ width: column.getSize() !== 150 ? column.getSize() : 'auto' }}
                  data-numeric={meta?.isNumeric}
                >
                  {typeof footer === 'function'
                    ? footer({ column, table, header: undefined as any })
                    : footer ?? null}
                </th>
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
