import type { ColumnDef } from '@tanstack/react-table';

/** Список id листовых колонок в порядке объявления (для columnOrder в TanStack Table). */
export function collectLeafColumnIds<T>(defs: ColumnDef<T, unknown>[]): string[] {
  const ids: string[] = [];
  for (const def of defs) {
    const group = def as ColumnDef<T, unknown> & { columns?: ColumnDef<T, unknown>[] };
    if (group.columns?.length) {
      ids.push(...collectLeafColumnIds(group.columns));
      continue;
    }
    const id =
      def.id ??
      ('accessorKey' in def && def.accessorKey != null ? String(def.accessorKey as string | number) : '');
    if (id) {
      ids.push(id);
    }
  }
  return ids;
}
