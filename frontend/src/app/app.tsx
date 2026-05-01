import { useState } from 'react';
import { Layout } from 'antd';
import { Header, Tabs, Workspace } from './layout';
import { UploadExcelPage, PaymentAccountPage, SettingsPage } from '../pages';
import { BankOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';

const { Content } = Layout;

const NAV_TABS = [
  { id: 'upd-downloads', label: 'Выгрузка УПД', icon: <FileTextOutlined /> },
  { id: 'payment-account', label: 'Расчётный счёт', icon: <BankOutlined /> },
  { id: 'settings', label: 'Настройки', icon: <SettingOutlined /> },
];

function App() {
  const [activeTab, setActiveTab] = useState('upd-downloads');

  const renderContent = () => {
    switch (activeTab) {
      case 'upd-downloads':
        return <UploadExcelPage />;
      case 'payment-account':
        return <PaymentAccountPage />;
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
