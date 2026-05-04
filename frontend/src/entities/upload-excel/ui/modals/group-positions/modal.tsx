import { useMemo, useState } from 'react';
import { Modal as SharedModal } from '@shared/ui';
import { UploadExcelRowForm, UploadExcelTable } from '@entities/upload-excel/ui';
import { roundMoney, useUploadExcelReadonlyTable } from '@entities/upload-excel/lib';
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
  const [formEpoch, setFormEpoch] = useState(0);

  const customTitle = (
    <div className={styles.modalHeader}>
      <span className={styles.modalTitle}>Сгруппированные позиции ({rows.length})</span>
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
    <SharedModal
      open={isOpen}
      onClose={onCancel}
      afterClose={() => setFormEpoch((prev) => prev + 1)}
      width="1200px"
      height="700px"
    >
      {customTitle}
      <div className={styles.modalBodyCompact}>
        <div className={styles.modalTableWrap}>
          <UploadExcelTable
            table={table}
            withSelection={false}
            showColumnTools={false}
            draggableColumns={false}
            horizontalScroll
          />
        </div>
        <div className={styles.modalHint}>
          Введите данные для итоговой позиции. Одинаковые значения в выбранных строках подставляются
          автоматически, отличающиеся поля остаются пустыми. Денежные поля рассчитываются как сумма
          по выбранным строкам. После нажатия «Применить к группе» выбранные строки будут заменены
          одной итоговой позицией.
        </div>
        {isOpen ? (
          <UploadExcelRowForm
            key={`${formId}-${formEpoch}`}
            formId={formId}
            defaultValues={initialFormValues}
            onSubmit={(values) => {
              onApply?.(values);
            }}
          />
        ) : null}
      </div>
    </SharedModal>
  );
}

type UploadExcelRowFormValues = Omit<UploadExcelRowModel, 'id'>;

/** Денежные поля: сумма по строкам, округление до 2 знаков после запятой */
const MONEY_SUM_FIELDS: Array<keyof UploadExcelRowFormValues> = [
  'price',
  'totalBeforeTax',
  'taxAmount',
  'totalWithTax',
];

function setFormField<K extends keyof UploadExcelRowFormValues>(
  target: Partial<UploadExcelRowFormValues>,
  key: K,
  value: UploadExcelRowFormValues[K] | undefined,
): void {
  target[key] = value;
}

function buildInitialFormValues(rows: UploadExcelRowModel[]): Partial<UploadExcelRowFormValues> {
  if (!rows.length) {
    return {};
  }

  const firstRow = rows[0];
  const result: Partial<UploadExcelRowFormValues> = {};

  const keys = Object.keys(firstRow).filter((key) => key !== 'id') as Array<
    keyof UploadExcelRowFormValues
  >;
  for (const key of keys) {
    if (MONEY_SUM_FIELDS.includes(key)) {
      const sum = rows.reduce(
        (acc, row) => acc + (Number(row[key as keyof UploadExcelRowModel]) || 0),
        0,
      );
      setFormField(result, key, roundMoney(sum) as UploadExcelRowFormValues[typeof key]);
      continue;
    }

    const baseValue = firstRow[key as keyof UploadExcelRowModel];
    const isSameForAll = rows.every((row) => row[key as keyof UploadExcelRowModel] === baseValue);
    if (isSameForAll) {
      setFormField(result, key, baseValue as UploadExcelRowFormValues[typeof key]);
      continue;
    }

    if (typeof baseValue === 'number') {
      setFormField(result, key, undefined);
    } else {
      setFormField(result, key, '' as UploadExcelRowFormValues[typeof key]);
    }
  }

  return result;
}
