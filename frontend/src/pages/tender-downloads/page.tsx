import { Typography } from 'antd';

const { Paragraph, Title } = Typography;

export function TenderDownloadsPage() {
  return (
    <div style={{ padding: '24px 8px' }}>
      <Title level={4} style={{ marginTop: 0 }}>
        Tender Downloads
      </Title>
      <Paragraph type="secondary" style={{ marginBottom: 0 }}>
        This section is reserved for tender download workflows. Implementation can be added here when the
        backend is ready.
      </Paragraph>
    </div>
  );
}
