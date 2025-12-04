import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Button } from 'antd';
import { Link } from 'react-router-dom';
import {
  RiseOutlined,
  TeamOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { getLeads } from '../../api/leads';
import { getClients } from '../../api/clients';
import { getClaims } from '../../api/claims';
import { useSelector } from 'react-redux';

const OperatorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    leads: 0,
    clients: 0,
    claims: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [leadsRes, clientsRes, claimsRes] = await Promise.all([
          getLeads(),
          getClients(),
          getClaims(),
        ]);

        // Filter by current operator
        const myLeads = leadsRes.data?.filter(
          lead => lead.assigned_operator_id === user?.id
        ) || [];
        
        const myClaims = claimsRes.data?.filter(
          claim => claim.assigned_operator_id === user?.id
        ) || [];

        setStats({
          leads: myLeads.length,
          clients: clientsRes.data?.length || 0,
          claims: myClaims.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <div>
      <h1>Operator Dashboard</h1>
      <p>Welcome, {user?.username || user?.email}!</p>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="My Leads"
              value={stats.leads}
              prefix={<RiseOutlined />}
              loading={loading}
            />
            <Link to="/operator/leads">
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                View Leads →
              </Button>
            </Link>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Clients"
              value={stats.clients}
              prefix={<TeamOutlined />}
              loading={loading}
            />
            <Link to="/operator/clients">
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                View Clients →
              </Button>
            </Link>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="My Claims"
              value={stats.claims}
              prefix={<FileTextOutlined />}
              loading={loading}
            />
            <Link to="/operator/claims">
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                View Claims →
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Quick Actions" style={{ height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/operator/leads">
                <Button type="primary" block icon={<RiseOutlined />}>
                  Manage Leads
                </Button>
              </Link>
              <Link to="/operator/clients">
                <Button block icon={<TeamOutlined />}>
                  View Clients
                </Button>
              </Link>
              <Link to="/operator/claims">
                <Button block icon={<FileTextOutlined />}>
                  Manage Claims
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OperatorDashboard;
