import { Card } from 'antd';

interface WorkspaceProps {
  children: React.ReactNode;
}

export const Workspace = ({ children }: WorkspaceProps) => {
  return (
    <Card 
      variant="borderless"
      styles={{ body: { padding: '16px' } }}
      style={{ height: '100%', backgroundColor: 'var(--color-bg-container)', display: 'flex', flexDirection: 'column' }}
    >
      {children}
    </Card>
  );
};
