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
  const initialFormValues = rows[0];
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
        <UploadExcelTable table={table} />
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
          Введите данные для новой итоговой позиции. После применения выбранные позиции будут
          удалены из списка, вместо них добавится новая строка, а итоговая сумма сгруппированной
          позиции будет равна сумме выбранных строк таблицы.
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
