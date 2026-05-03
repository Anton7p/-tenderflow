import { Modal as SharedModal } from '../../../../../shared/ui';
import { Content } from './ui';
import { useModal } from './lib';
import type { ModalProps } from './types';
import { Button } from 'antd';
import styles from './styles.module.css';

export function UploadExcelModal(props: ModalProps) {
  const modal = useModal(props);
  const { state } = modal;
  const { handleCancel, handleSubmit, handleAfterClose } = state;
  const loading = Boolean(props.state?.loading);

  const customTitle = (
    <div className={styles.modalHeader}>
      <span className={styles.modalTitle}>Загрузка УПД</span>
      <div className={styles.modalActions}>
        <Button
          type="primary"
          className={styles.primaryButton}
          loading={loading}
          disabled={loading || !state.selectedFile}
          onClick={handleSubmit}
        >
          Загрузить
        </Button>
        <Button className={styles.secondaryButton} disabled={loading} onClick={handleCancel}>
          Закрыть
        </Button>
      </div>
    </div>
  );

  return (
    <SharedModal
      open={state.isOpen}
      onClose={handleCancel}
      afterClose={handleAfterClose}
      maskClosable={!loading}
      keyboard={!loading}
    >
      {customTitle}
      <Content modal={modal} loading={loading} />
    </SharedModal>
  );
}
