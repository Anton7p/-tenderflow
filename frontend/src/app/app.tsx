import { useState } from 'react';
import { Layout } from 'antd';
import { Header, Tabs, Workspace } from './layout';
import { UploadExcelPage, PaymentAccountPage, SettingsPage, MainPage } from '../pages';
import { BankOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';

const { Content } = Layout;

const NAV_TABS = [
  { id: 'upd-downloads', label: 'Выгрузка УПД', icon: <FileTextOutlined /> },
  { id: 'payment-account', label: 'Расчётный счёт', icon: <BankOutlined /> },
  { id: 'settings', label: 'Настройки', icon: <SettingOutlined /> },
];

function App() {
  const [activeTab, setActiveTab] = useState('main');
  const isMainTab = activeTab === 'main';

  const renderContent = () => {
    switch (activeTab) {
      case 'main':
        return <MainPage onOpenSection={setActiveTab} />;
      case 'upd-downloads':
        return <UploadExcelPage />;
      case 'payment-account':
        return <PaymentAccountPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <MainPage onOpenSection={setActiveTab} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-layout)' }}>
      {!isMainTab ? <Header title="Управление тендерной документацией" /> : null}
      <Content
        style={{
          margin: 0,
          padding: 0,
          height: isMainTab ? '100vh' : 'calc(100vh - 48px)',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', height: '100%' }}>
          {!isMainTab ? (
            <Tabs tabs={NAV_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          ) : null}
          <Workspace transparent={isMainTab}>{renderContent()}</Workspace>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
