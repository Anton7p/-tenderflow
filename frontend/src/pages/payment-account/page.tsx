import { Typography } from 'antd';

const { Paragraph, Title } = Typography;

export function PaymentAccountPage() {
  return (
    <div style={{ padding: '24px 8px' }}>
      <Title level={4} style={{ marginTop: 0 }}>
        Расчётный счёт
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 0 }}>
        Раздел для работы с платёжным счётом. Здесь можно добавить формы и сценарии, когда будет готов
        бэкенд.
      </Paragraph>
    </div>
  );
}
