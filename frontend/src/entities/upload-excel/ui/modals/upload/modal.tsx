import { Modal as SharedModal } from '../../../../../shared/ui';
import { Content } from './ui';
import { useModal } from './lib';
import type { ModalProps } from './types';
import { Button } from 'antd';
import styles from './styles.module.css';

export function UploadExcelModal(props: ModalProps) {
  const modal = useModal(props);
  const { state } = modal;
  const { handleCancel, handleSubmit } = state;

  const customTitle = (
    <div className={styles.modalHeader}>
      <span className={styles.modalTitle}>Загрузка UPD</span>
      <div className={styles.modalActions}>
        <Button 
          type="primary" 
          className={styles.primaryButton}
          onClick={handleSubmit}
        >
          Загрузить
        </Button>
        <Button className={styles.secondaryButton} onClick={handleCancel}>
          Закрыть
        </Button>
      </div>
    </div>
  );

  return (
    <SharedModal
      open={state.isOpen}
      onClose={handleCancel}
    >
      {customTitle}
      <Content modal={modal} />
    </SharedModal>
  );
}
