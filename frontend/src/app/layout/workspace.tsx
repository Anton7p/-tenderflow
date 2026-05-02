import { Card } from 'antd';

interface WorkspaceProps {
  children: React.ReactNode;
  transparent?: boolean;
}

export const Workspace = ({ children, transparent = false }: WorkspaceProps) => {
  return (
    <Card
      variant="borderless"
      styles={{ body: { padding: transparent ? 0 : '16px' } }}
      style={{
        height: '100%',
        backgroundColor: transparent ? 'transparent' : 'var(--color-bg-container)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: transparent ? 'none' : undefined,
      }}
    >
      {children}
    </Card>
  );
};
