import { Typography } from 'antd';
import type { Page } from '../types';

const { Text } = Typography;

interface ContentProps {
  page: Page;
}

export const Content = ({ page: _page }: ContentProps) => {
  return (
    <div>
      <Text>Страница настроек</Text>
    </div>
  );
};
