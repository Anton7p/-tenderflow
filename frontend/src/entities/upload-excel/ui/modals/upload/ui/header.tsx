import { Button } from 'antd';
import type { Modal } from '../types';

interface HeaderProps {
  modal: Modal;
}

export function Header({ modal }: HeaderProps) {
  const { state } = modal;
  const { handleSubmit, handleCancel } = state;

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
      <Button onClick={handleCancel}>Отмена</Button>
      <Button type="primary" onClick={handleSubmit}>
        Загрузить
      </Button>
    </div>
  );
}
