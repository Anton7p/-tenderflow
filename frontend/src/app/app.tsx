import { useState } from 'react';
import { Layout } from 'antd';
import { Header, Tabs, Workspace } from './layout';
import { UploadExcelPage, PaymentAccountPage, MainPage } from '../pages';
import { BankOutlined, FileTextOutlined } from '@ant-design/icons';
import layoutStyles from './app-layout.module.css';

const { Content } = Layout;

const NAV_TABS = [
  { id: 'upd-downloads', label: 'Выгрузка УПД', icon: <FileTextOutlined /> },
  { id: 'payment-account', label: 'Расчётный счёт', icon: <BankOutlined /> },
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
      default:
        return <MainPage onOpenSection={setActiveTab} />;
    }
  };

  return (
    <Layout
      className={layoutStyles.layoutRoot}
      style={{ backgroundColor: 'var(--color-bg-layout)' }}
    >
      {!isMainTab ? <Header title="Управление тендерной документацией" /> : null}
      <Content className={isMainTab ? layoutStyles.contentMain : layoutStyles.contentTabs}>
        {isMainTab ? (
          <div className={layoutStyles.shell}>
            <Workspace transparent>{renderContent()}</Workspace>
          </div>
        ) : (
          <div
            className={layoutStyles.shell}
            style={{
              maxWidth: 'var(--layout-max-width)',
              margin: '0 auto',
            }}
          >
            <Tabs tabs={NAV_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
            <Workspace>{renderContent()}</Workspace>
          </div>
        )}
      </Content>
    </Layout>
  );
}

export default App;
