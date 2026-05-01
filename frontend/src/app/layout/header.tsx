import { Flex, Input, Dropdown, Button, Typography } from 'antd';
import { SearchOutlined, DownOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface HeaderProps {
  title: string;
  userName?: string;
}

export const Header = ({ title, userName = 'Администратор' }: HeaderProps) => {
  const menuItems = [
    { key: '1', label: 'Получить ссылку' },
    { key: '2', label: 'Перейти по ссылке...' },
    { key: '3', label: 'Календарь' },
    { key: '4', label: 'Калькулятор' },
    { key: '5', label: 'Файл' },
    { key: '6', label: 'Окна' },
    { key: '7', label: 'Настройки' },
    { key: '8', label: 'Справка' },
    { key: '9', label: 'О программе...' },
  ];

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
        
        <Flex align="center" gap={20}>
          <Flex align="center" gap={12} style={{ flex: 1 }}>
            <Input
              placeholder="Поиск"
              prefix={<SearchOutlined />}
              style={{ width: '100%', backgroundColor: 'white' }}
            />
          </Flex>
          
          <Flex align="center" gap={16}>
            <Flex align="center" gap={8}>
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                backgroundColor: 'var(--color-bg-container)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid var(--color-border)'
              }}>
                <UserOutlined />
              </div>
              <Text style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{userName}</Text>
            </Flex>
            
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <Button size="middle">
                Меню <DownOutlined />
              </Button>
            </Dropdown>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
