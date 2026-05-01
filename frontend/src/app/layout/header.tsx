import { Flex, Typography } from 'antd';
import { FileTextOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface HeaderProps {
  title: string;
  userName?: string;
}

export const Header = ({ title, userName = 'Администратор' }: HeaderProps) => {
  return (
    <Flex 
      align="center" 
      justify="center"
      style={{ 
        height: '48px', 
        backgroundColor: 'var(--header-bg)', 
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <Flex 
        align="center" 
        justify="space-between"
        style={{ 
          width: '100%',
          maxWidth: '1440px',
          padding: '0 20px'
        }}
      >
        <Flex align="center" gap={12}>
          <FileTextOutlined style={{ fontSize: '18px', color: 'var(--color-text-primary)' }} />
          <Text strong style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{title}</Text>
        </Flex>
        
        <Flex align="center" gap={16}>
          <Flex align="center" gap={8}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'var(--color-bg-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--color-border)',
              }}
            >
              <UserOutlined />
            </div>
            <Text style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{userName}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
