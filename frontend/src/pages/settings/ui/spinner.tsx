import { Spin } from 'antd';
import type { Page } from '../types';

interface SpinnerProps {
  page: Page;
}

export const Spinner = ({ page }: SpinnerProps) => {
  if (!page.state.loading) return null;

  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <Spin size="large" />
    </div>
  );
};
