import type { CSSProperties } from 'react';
import { Modal as AntModal } from 'antd';
import styles from './modal.module.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  maskClosable?: boolean;
  keyboard?: boolean;
  /** Вызывается после завершения анимации закрытия (в т.ч. при controlled open=false). */
  afterClose?: () => void;
  /** Зафиксировать размер `.ant-modal-content` (окно не растёт и не скроллится целиком). */
  contentStyle?: CSSProperties;
}

export function Modal({
  open,
  onClose,
  children,
  width = '1200px',
  height = '700px',
  maskClosable = true,
  keyboard = true,
  afterClose,
  contentStyle,
}: ModalProps) {
  const fixedShell = Boolean(contentStyle?.height ?? contentStyle?.maxHeight);

  return (
    <AntModal
      open={open}
      onCancel={onClose}
      afterClose={afterClose}
      footer={null}
      width={width}
      centered
      maskClosable={maskClosable}
      keyboard={keyboard}
      className={styles.modal}
      style={{ top: 0 }}
      styles={{
        mask: { backgroundColor: 'var(--modal-mask)' },
        body: {
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          ...(fixedShell ? { flex: '1 1 auto', minHeight: 0 } : { minHeight: height }),
          ...contentStyle,
        },
      }}
      closeIcon={false}
    >
      {children}
    </AntModal>
  );
}
