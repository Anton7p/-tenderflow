import { useState } from 'react';
import { Layout } from 'antd';
import { Header, Tabs, Workspace } from './layout';
import { UploadExcelPage, DocumentJournalPage, SettingsPage } from '../pages';
import {
  FileTextOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Content } = Layout;

const NAV_TABS = [
  { id: 'upload', label: 'Загрузка тендеров', icon: <FileTextOutlined /> },
  { id: 'templates', label: 'Шаблоны', icon: <AppstoreOutlined /> },
  { id: 'journal', label: 'Журнал документов', icon: <UnorderedListOutlined /> },
  { id: 'settings', label: 'Настройки', icon: <SettingOutlined /> },
];

function App() {
  const [activeTab, setActiveTab] = useState('upload');

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadExcelPage />;
      case 'journal':
        return <DocumentJournalPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <UploadExcelPage />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-layout)' }}>
      <Header title="Управление тендерной документацией" />
      <Content style={{ margin: 0, padding: 0, height: 'calc(100vh - 48px)', overflow: 'hidden' }}>
        <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', height: '100%' }}>
          <Tabs tabs={NAV_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          <Workspace>
            {renderContent()}
          </Workspace>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
