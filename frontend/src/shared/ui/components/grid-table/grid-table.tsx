import type { DragEvent } from 'react';
import { flexRender } from '@tanstack/react-table';
import type { Header, Table } from '@tanstack/react-table';
import styles from './grid-table.module.css';

export interface GridTableProps<TData> {
  table: Table<TData>;
  withSelection?: boolean;
  /** Перетаскивание заголовков листовых колонок для смены порядка */
  draggableColumns?: boolean;
}

function resolveHeaderTitle<TData>(header: Header<TData, unknown>): string {
  const meta = header.column.columnDef.meta as { headerTooltip?: string } | undefined;
  if (meta?.headerTooltip) {
    return meta.headerTooltip;
  }
  const h = header.column.columnDef.header;
  if (typeof h === 'string') {
    return h.trim();
  }
  return header.column.id;
}

function canDragLeafHeader<TData>(header: Header<TData, unknown>, draggable: boolean): boolean {
  if (!draggable || header.isPlaceholder) {
    return false;
  }
  if ((header.colSpan ?? 1) !== 1) {
    return false;
  }
  const def = header.column.columnDef as { columns?: unknown[] };
  return !(def.columns && def.columns.length > 0);
}

function handleDragStart<TData>(
  e: DragEvent,
  header: Header<TData, unknown>,
  draggable: boolean,
) {
  if (!canDragLeafHeader(header, draggable)) {
    return;
  }
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', header.column.id);
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleDrop<TData>(
  e: DragEvent,
  header: Header<TData, unknown>,
  table: Table<TData>,
  draggable: boolean,
) {
  e.preventDefault();
  if (!canDragLeafHeader(header, draggable)) {
    return;
  }
  const draggedId = e.dataTransfer.getData('text/plain');
  const targetId = header.column.id;
  if (!draggedId || draggedId === targetId) {
    return;
  }
  table.setColumnOrder((prev) => {
    const order = [...prev];
    const from = order.indexOf(draggedId);
    const to = order.indexOf(targetId);
    if (from === -1 || to === -1) {
      return prev;
    }
    order.splice(from, 1);
    order.splice(to, 0, draggedId);
    return order;
  });
}

export function GridTable<TData>({
  table,
  withSelection = true,
  draggableColumns = false,
}: GridTableProps<TData>) {
  if (!table) return null;

  return (
    <div className={styles.shell}>
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {withSelection ? <th data-select="true" /> : null}
              {headerGroup.headers.map((header) => {
                const draggable = canDragLeafHeader(header, draggableColumns);
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    data-name={(header.column.columnDef.meta as { isName?: boolean } | undefined)?.isName}
                    data-draggable-leaf={draggable ? 'true' : undefined}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    title={resolveHeaderTitle(header)}
                    draggable={draggable}
                    onDragStart={(e) => handleDragStart(e, header, draggableColumns)}
                    onDragOver={draggableColumns ? handleDragOver : undefined}
                    onDrop={(e) => handleDrop(e, header, table, draggableColumns)}
                    className={draggable ? styles.thDraggable : undefined}
                  >
                    {header.isPlaceholder ? null : (
                      <span className={styles.headerInner}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              data-selected={row.getIsSelected()}
              onClick={withSelection ? () => row.toggleSelected() : undefined}
            >
              {withSelection ? (
                <td data-select="true" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={(e) => row.toggleSelected(e.target.checked)}
                  />
                </td>
              ) : null}
              {row.getVisibleCells().map((cell) => {
                const columnDef = cell.column.columnDef;
                const meta = columnDef.meta as { isNumeric?: boolean; isName?: boolean } | undefined;

                return (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    data-numeric={meta?.isNumeric}
                    data-name={meta?.isName}
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
            {withSelection ? <th data-select="true" /> : null}
            {table.getVisibleLeafColumns().map((column) => {
              const footer = column.columnDef.footer;
              const meta = column.columnDef.meta as { isNumeric?: boolean } | undefined;
              return (
                <th
                  key={column.id}
                  style={{ width: column.getSize() !== 150 ? column.getSize() : undefined }}
                  data-numeric={meta?.isNumeric}
                >
                  {typeof footer === 'function'
                    ? footer({ column, table, header: undefined as never })
                    : (footer ?? null)}
                </th>
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
