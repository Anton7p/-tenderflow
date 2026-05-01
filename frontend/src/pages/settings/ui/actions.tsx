import { Button } from 'antd';
import type { Page } from '../types';

interface ActionsProps {
  page: Page;
}

export const Actions = ({ page }: ActionsProps) => {
  const { actionsVisibility } = page.actions;

  return (
    <>
      {actionsVisibility.isSaveVisible && (
        <Button type="primary" loading={page.state.loading}>
          Сохранить
        </Button>
      )}
    </>
  );
};
