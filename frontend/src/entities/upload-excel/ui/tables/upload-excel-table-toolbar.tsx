import { useState } from 'react';
import { HolderOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Dropdown, Input, Space } from 'antd';
import type { Table } from '@tanstack/react-table';
import type { UploadExcelRowModel } from '../../types/public';
import styles from './upload-excel-table-toolbar.module.css';

interface UploadExcelTableToolbarProps {
  table: Table<UploadExcelRowModel>;
}

function columnHeaderLabel(column: ReturnType<Table<UploadExcelRowModel>['getAllLeafColumns']>[number]): string {
  const h = column.columnDef.header;
  if (typeof h === 'string' && h.trim()) {
    return h.trim();
  }
  return column.id;
}

export function UploadExcelTableToolbar(props: UploadExcelTableToolbarProps) {
  const { table } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const leafColumns = table.getAllLeafColumns().filter((col) => col.getCanHide());

  const filterValue = String(table.getState().globalFilter ?? '');

  return (
    <div className={styles.toolbar}>
      <Space wrap className={styles.toolbarInner} size={10}>
        <Input
          allowClear
          placeholder="Поиск по наименованию"
          value={filterValue}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className={styles.search}
        />
        <Dropdown
          open={dropdownOpen}
          onOpenChange={setDropdownOpen}
          trigger={['click']}
          placement="bottomLeft"
          dropdownRender={() => (
            <div className={styles.columnPanel} onClick={(e) => e.stopPropagation()}>
              <div className={styles.columnPanelHint}>
                Отметьте колонки для отображения. Перетаскивайте заголовки в таблице для порядка колонок.
              </div>
              <Space orientation="vertical" size={6} style={{ width: '100%' }}>
                {leafColumns.map((column) => (
                  <Checkbox
                    key={column.id}
                    checked={column.getIsVisible()}
                    disabled={!column.getCanHide()}
                    onChange={column.getToggleVisibilityHandler()}
                  >
                    <span className={styles.columnLabel} title={columnHeaderLabel(column)}>
                      {columnHeaderLabel(column)}
                    </span>
                  </Checkbox>
                ))}
              </Space>
            </div>
          )}
        >
          <Button type="default" icon={<SettingOutlined />} className={styles.columnsBtn}>
            Колонки
          </Button>
        </Dropdown>
        <span className={styles.dragHint}>
          <HolderOutlined /> Перетащите заголовок колонки
        </span>
      </Space>
    </div>
  );
}
