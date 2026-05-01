import { Empty } from 'antd';

interface EmptyContentProps {
  text?: string;
  description?: string;
}

export function EmptyContent({ text = 'Нет данных', description }: EmptyContentProps) {
  return <Empty description={description || text} />;
}
