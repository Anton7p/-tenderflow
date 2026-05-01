import { Modal as SharedModal } from '@shared/ui';
import { UploadExcelRowForm } from '@entities/upload-excel/ui';
import { Button } from 'antd';
import type { UploadExcelRowModel } from '@entities/upload-excel/types/public';
import styles from '../upload/styles.module.css';

type PositionModalMode = 'create' | 'edit';

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
      <div style={{ padding: '0 10px 10px' }}>
        <UploadExcelRowForm
          formId={formId}
          defaultValues={params?.row}
          onSubmit={(values) => {
            onApply?.(values);
          }}
        />
      </div>
    </SharedModal>
  );
}
