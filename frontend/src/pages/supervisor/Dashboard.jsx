import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Button } from 'antd';
import { Link } from 'react-router-dom';
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { getUsers } from '../../api/users';
import { getClients } from '../../api/clients';
import { getClaims } from '../../api/claims';
import { useSelector } from 'react-redux';

const SupervisorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    operators: 0,
    clients: 0,
    claims: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, clientsRes, claimsRes] = await Promise.all([
          getUsers(),
          getClients(),
          getClaims(),
        ]);

        // Count operators assigned to this supervisor
        // Note: This would need supervisor_operator relationship check
        const operators = usersRes.data?.filter(u => 
          u.roles?.some(r => r.name === 'Operator')
        ) || [];
        
        // Get claims assigned to this supervisor
        const myClaims = claimsRes.data?.filter(
          claim => claim.assigned_supervisor_id === user?.id
        ) || [];

        setStats({
          operators: operators.length,
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
      <h1>Supervisor Dashboard</h1>
      <p>Welcome, {user?.username || user?.email}!</p>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Operators"
              value={stats.operators}
              prefix={<UserOutlined />}
              loading={loading}
            />
            <Link to="/supervisor/operators">
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                View Operators →
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
            <Link to="/supervisor/clients">
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
            <Link to="/supervisor/claims">
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
              <Link to="/supervisor/operators">
                <Button type="primary" block icon={<UserOutlined />}>
                  Manage Operators
                </Button>
              </Link>
              <Link to="/supervisor/claims">
                <Button block icon={<FileTextOutlined />}>
                  Manage Claims
                </Button>
              </Link>
              <Link to="/supervisor/clients">
                <Button block icon={<TeamOutlined />}>
                  View Clients
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SupervisorDashboard;
