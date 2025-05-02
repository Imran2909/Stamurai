'use client';

import { Card, Col, Row, Typography } from 'antd';
import Sidebar from '../components/sidebar/page';

const { Title, Text } = Typography;

const DashboardCard = ({ title, value, subtitle }) => (
  <Card >
    <Title level={4}>{title}</Title>
    <Text strong style={{ fontSize: '24px' }}>{value}</Text>
    <br />
    <Text type="secondary">{subtitle}</Text>
  </Card>
);

export default function DashboardPage() {
  // Placeholder stats
  const stats = {
    assigned: 8,
    created: 5,
    overdue: 2,
  };

  return (
    <div style={{ padding: '40px' }}>
      <Sidebar/>
      <Title level={2}>Dashboard</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <DashboardCard title="Assigned to You" value={stats.assigned} subtitle="Currently active tasks" />
        </Col>
        <Col xs={24} md={8}>
          <DashboardCard title="Created by You" value={stats.created} subtitle="Your created tasks" />
        </Col>
        <Col xs={24} md={8}>
          <DashboardCard title="Overdue Tasks" value={stats.overdue} subtitle="Needs your attention" />
        </Col>
      </Row>
    </div>
  );
}
