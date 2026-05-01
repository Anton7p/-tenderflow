import { Modal as AntModal } from 'antd';
import styles from './modal.module.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
}

export function Modal({ open, onClose, children, width = '1200px', height = '700px' }: ModalProps) {
  return (
    <AntModal
      open={open}
      onCancel={onClose}
      footer={null}
      width={width}
      centered
      className={styles.modal}
      bodyStyle={{ padding: 0, minHeight: height, display: 'flex', flexDirection: 'column' }}
      style={{ top: 0 }}
      styles={{
        mask: { backgroundColor: 'rgba(0, 0, 0, 0.45)' },
      }}
      closeIcon={false}
    >
      {children}
    </AntModal>
  );
}
