import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Button } from 'antd';
import { Link } from 'react-router-dom';
import {
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
  RiseOutlined,
  TeamOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import {
  getLeadsAnalytics,
  getClientsAnalytics,
  getRevenueAnalytics,
  getClaimsAnalytics,
} from '../../api/analytics';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    leads: 0,
    clients: 0,
    revenue: 0,
    claims: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [leads, clients, revenue, claims] = await Promise.all([
          getLeadsAnalytics(),
          getClientsAnalytics(),
          getRevenueAnalytics(),
          getClaimsAnalytics(),
        ]);
        setStats({
          leads: leads.data?.total_leads || 0,
          clients: clients.data?.total_clients || 0,
          revenue: revenue.data?.total_revenue || 0,
          claims: claims.data?.total_claims || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Leads"
              value={stats.leads}
              prefix={<RiseOutlined />}
              loading={loading}
            />
            <Link to="/admin/leads">
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                View Leads →
              </Button>
            </Link>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Clients"
              value={stats.clients}
              prefix={<TeamOutlined />}
              loading={loading}
            />
            <Link to="/admin/clients">
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                View Clients →
              </Button>
            </Link>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.revenue}
              prefix={<DollarOutlined />}
              precision={2}
              loading={loading}
            />
            <Link to="/admin/products">
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                View Products →
              </Button>
            </Link>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Claims"
              value={stats.claims}
              prefix={<FileTextOutlined />}
              loading={loading}
            />
            <Link to="/admin/claims">
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                View Claims →
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Quick Actions" style={{ height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/admin/users/create">
                <Button type="primary" block icon={<UserOutlined />}>
                  Create User
                </Button>
              </Link>
              <Link to="/admin/leads/create">
                <Button block icon={<RiseOutlined />}>
                  Create Lead
                </Button>
              </Link>
              <Link to="/admin/products/create">
                <Button block icon={<ShoppingOutlined />}>
                  Create Product
                </Button>
              </Link>
              <Link to="/admin/analytics">
                <Button block>
                  View Analytics
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Recent Activity" style={{ height: '100%' }}>
            <p>Recent activity will be displayed here.</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;

