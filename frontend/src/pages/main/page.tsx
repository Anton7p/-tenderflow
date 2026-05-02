import {
  AppstoreOutlined,
  BankOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import styles from './main.module.css';

const { Title, Paragraph, Text } = Typography;

interface MainPageProps {
  onOpenSection: (tabId: string) => void;
}

const sections = [
  {
    id: 'upd-downloads',
    title: 'Выгрузка УПД',
    description: 'Загрузка Excel, редактирование строк и экспорт в DOCX.',
    icon: <FileTextOutlined />,
  },
  {
    id: 'payment-account',
    title: 'Расчётный счёт',
    description: 'Раздел для работы с данными расчётного счёта.',
    icon: <BankOutlined />,
  },
  {
    id: 'settings',
    title: 'Настройки',
    description: 'Параметры приложения и системные настройки.',
    icon: <SettingOutlined />,
  },
] as const;

export function MainPage({ onOpenSection }: MainPageProps) {
  return (
    <div className={styles.mainPage}>
      <Space direction="vertical" size={18} style={{ width: '100%' }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Главная
          </Title>
          <Paragraph style={{ marginBottom: 0 }}>
            Выберите раздел, чтобы продолжить работу.
          </Paragraph>
        </div>

        <Card className={styles.heroCard}>
          <Space align="center" size={10}>
            <AppstoreOutlined />
            <Text strong>О приложении</Text>
          </Space>
          <Paragraph style={{ marginTop: 10, marginBottom: 0 }}>
            Сервис помогает подготовить документы по УПД: загружает Excel, позволяет проверить и
            сгруппировать позиции, а затем формирует DOCX-шаблон для выгрузки.
          </Paragraph>
        </Card>

        <Row gutter={[16, 16]}>
          {sections.map((section) => (
            <Col xs={24} md={12} lg={8} key={section.id}>
              <Card
                className={styles.sectionCard}
                title={
                  <Space>
                    {section.icon}
                    <span>{section.title}</span>
                  </Space>
                }
              >
                <Paragraph>{section.description}</Paragraph>
                <Button type="primary" onClick={() => onOpenSection(section.id)}>
                  Открыть
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </div>
  );
}
