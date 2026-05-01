import { Layout, Menu } from 'antd';
import { 
  FileTextOutlined, 
  AppstoreOutlined, 
  UnorderedListOutlined, 
  SettingOutlined 
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    {
      key: 'upload',
      icon: <FileTextOutlined />,
      label: 'Загрузка тендеров',
    },
    {
      key: 'templates',
      icon: <AppstoreOutlined />,
      label: 'Шаблоны',
    },
    {
      key: 'journal',
      icon: <UnorderedListOutlined />,
      label: 'Журнал документов',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Настройки',
    },
  ];

  return (
    <Sider 
      width={220} 
      style={{ 
        backgroundColor: 'var(--sidebar-bg)', 
        borderRight: '1px solid var(--color-border)',
        padding: '12px 8px'
      }}
    >
      <Menu
        mode="vertical"
        selectedKeys={[activeTab]}
        items={menuItems}
        onSelect={({ key }) => onTabChange(key)}
        style={{ backgroundColor: 'transparent', border: 'none' }}
      />
    </Sider>
  );
};
