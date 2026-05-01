import { useMemo } from 'react';
import { Modal as SharedModal } from '@shared/ui';
import { UploadExcelRowForm, UploadExcelTable } from '@entities/upload-excel/ui';
import { useUploadExcelReadonlyTable } from '@entities/upload-excel/lib';
import { Button } from 'antd';
import type { UploadExcelRowModel } from '@entities/upload-excel/types/public';
import styles from '../upload/styles.module.css';

interface GroupPositionsModalProps {
  isOpen: boolean;
  params: { rows: unknown[] } | null;
  onCancel: () => void;
  onApply?: (values: unknown) => void;
}

export function GroupPositionsModal(props: GroupPositionsModalProps) {
  const { isOpen, onCancel, onApply, params } = props;
  const rows = (Array.isArray(params?.rows) ? params.rows : []) as UploadExcelRowModel[];
  const { table } = useUploadExcelReadonlyTable({ data: rows });
  const initialFormValues = useMemo(() => buildInitialFormValues(rows), [rows]);
  const formId = 'group-positions-form';

  const customTitle = (
    <div className={styles.modalHeader}>
      <span className={styles.modalTitle}>
        Сгруппированные позиции ({rows.length})
      </span>
      <div className={styles.modalActions}>
        <Button type="primary" className={styles.primaryButton} htmlType="submit" form={formId}>
          Применить к группе
        </Button>
        <Button className={styles.secondaryButton} onClick={onCancel}>
          Закрыть
        </Button>
      </div>
    </div>
  );

  return (
    <SharedModal open={isOpen} onClose={onCancel} width="1200px" height="700px">
      {customTitle}
      <div style={{ padding: '0 10px 10px', minHeight: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <UploadExcelTable
          table={table}
          withSelection={false}
          showColumnTools={false}
          draggableColumns={false}
        />
        <div
          style={{
            padding: '6px 10px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#fef9c3',
            color: '#374151',
            fontSize: 12,
            borderRadius: 4,
          }}
        >
          Введите данные для итоговой позиции. Одинаковые значения в выбранных строках
          подставляются автоматически, отличающиеся поля остаются пустыми. Денежные поля
          рассчитываются как сумма по выбранным строкам. После нажатия «Применить к группе»
          выбранные строки будут заменены одной итоговой позицией.
        </div>
        <UploadExcelRowForm
          formId={formId}
          defaultValues={initialFormValues}
          onSubmit={(values) => {
            onApply?.(values);
          }}
        />
      </div>
    </SharedModal>
  );
}

type UploadExcelRowFormValues = Omit<UploadExcelRowModel, 'id'>;

const MONEY_FIELDS: Array<keyof UploadExcelRowFormValues> = [
  'price',
  'totalBeforeTax',
  'taxAmount',
  'totalWithTax',
];

function buildInitialFormValues(rows: UploadExcelRowModel[]): Partial<UploadExcelRowFormValues> {
  if (!rows.length) {
    return {};
  }

  const firstRow = rows[0];
  const result: Partial<UploadExcelRowFormValues> = {};

  const keys = Object.keys(firstRow).filter((key) => key !== 'id') as Array<keyof UploadExcelRowFormValues>;
  for (const key of keys) {
    if (MONEY_FIELDS.includes(key)) {
      result[key] = rows.reduce(
        (sum, row) => sum + (Number(row[key as keyof UploadExcelRowModel]) || 0),
        0,
      ) as UploadExcelRowFormValues[typeof key];
      continue;
    }

    const baseValue = firstRow[key as keyof UploadExcelRowModel];
    const isSameForAll = rows.every((row) => row[key as keyof UploadExcelRowModel] === baseValue);
    if (isSameForAll) {
      result[key] = baseValue as UploadExcelRowFormValues[typeof key];
      continue;
    }

    result[key] = (typeof baseValue === 'number' ? undefined : '') as UploadExcelRowFormValues[typeof key];
  }

  return result;
}
