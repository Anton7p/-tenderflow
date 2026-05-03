import { Flex, Typography } from 'antd';
import { ProjectOutlined, UserOutlined } from '@ant-design/icons';

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
        borderBottom: '1px solid var(--header-border)',
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        style={{
          width: '100%',
          maxWidth: '1440px',
          padding: '0 20px',
        }}
      >
        <Flex align="center" gap={12}>
          <ProjectOutlined style={{ fontSize: '18px', color: 'var(--header-text)' }} />
          <Text strong style={{ fontSize: '14px', color: 'var(--header-text)' }}>
            {title}
          </Text>
        </Flex>

        <Flex align="center" gap={16}>
          <Flex align="center" gap={8}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'var(--header-avatar-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--header-avatar-border)',
              }}
            >
              <UserOutlined style={{ color: 'var(--color-primary)' }} />
            </div>
            <Text style={{ fontSize: '13px', color: 'var(--header-text)' }}>{userName}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
