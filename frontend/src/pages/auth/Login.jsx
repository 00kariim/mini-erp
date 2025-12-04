import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import LoginForm from '../../components/Forms/LoginForm';

const { Title, Paragraph } = Typography;

const Login = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1f2933 0%, #111827 50%, #0f172a 100%)',
        padding: '24px',
      }}
    >
      <Row gutter={48} style={{ maxWidth: 960, width: '100%' }} align="middle">
        <Col xs={24} md={12}>
          <div style={{ color: '#f9fafb' }}>
            <div style={{ marginBottom: 16 }}>
              <img
                src="/logo.png"
                alt="ERP Logo"
                style={{ height: 40, objectFit: 'contain' }}
              />
            </div>
            <Title level={2} style={{ color: '#f9fafb', marginBottom: 12 }}>
              Welcome to the ERP system
            </Title>
            <Title level={4} style={{ color: '#9ca3af', marginBottom: 24 }}>
              made by bamou
            </Title>
            <Paragraph style={{ color: '#d1d5db', fontSize: 16, maxWidth: 380 }}>
              Centralize your leads, clients, products and claims in one clean interface.
              Log in to manage your daily operations with an admin-grade toolkit.
            </Paragraph>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Card
            style={{
              boxShadow: '0 18px 45px rgba(15, 23, 42, 0.55)',
              borderRadius: 16,
            }}
          >
            <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
              Sign in
            </Title>
            <LoginForm />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
