'use client';

import { Form, Input, Button, Typography, message, Card } from 'antd';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (values) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        message.success('Login successful');
        router.push('/dashboard');
      } else {
        const error = await res.json();
        message.error(error.message || 'Login failed');
      }
    } catch (err) {
      message.error('Something went wrong');
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '100px auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>Login</Title>
      <Form layout="vertical" onFinish={handleLogin}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Log In
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
