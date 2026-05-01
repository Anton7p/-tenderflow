import { Modal as SharedModal } from '@shared/ui';
import { UploadExcelRowForm } from '@entities/upload-excel/ui';
import { Button } from 'antd';
import type { UploadExcelRowModel } from '@entities/upload-excel/types/public';
import styles from '../upload/styles.module.css';

type PositionModalMode = 'create' | 'edit';

function rowToFormDefaults(row: UploadExcelRowModel) {
  const { id: _id, ...rest } = row;
  return rest;
}

interface PositionModalProps {
  isOpen: boolean;
  params: { mode: PositionModalMode; row?: UploadExcelRowModel } | null;
  onCancel: () => void;
  onApply?: (values: unknown) => void;
}

export function PositionModal(props: PositionModalProps) {
  const { isOpen, onCancel, onApply, params } = props;
  const formId = 'position-form';
  const mode = params?.mode ?? 'create';
  const isEdit = mode === 'edit';

  const customTitle = (
    <div className={styles.modalHeader}>
      <span className={styles.modalTitle}>{isEdit ? 'Редактирование позиции' : 'Создание позиции'}</span>
      <div className={styles.modalActions}>
        <Button type="primary" className={styles.primaryButton} htmlType="submit" form={formId}>
          {isEdit ? 'Сохранить' : 'Добавить'}
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
      {isOpen ? (
        <div style={{ padding: '0 10px 10px' }}>
          <UploadExcelRowForm
            key={`${mode}-${params?.row ? `${params.row.id}-${params.row.index}` : 'new'}`}
            formId={formId}
            defaultValues={params?.row ? rowToFormDefaults(params.row) : undefined}
            onSubmit={(values) => {
              onApply?.(values);
            }}
          />
        </div>
      ) : null}
    </SharedModal>
  );
}
