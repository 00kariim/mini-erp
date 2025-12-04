import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Button } from 'antd';
import { Link } from 'react-router-dom';
import {
  FileTextOutlined,
  ShoppingOutlined,
  UserOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { getClaims } from '../../api/claims';
import { getClient, getClients } from '../../api/clients';
import { useSelector } from 'react-redux';

const ClientDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    claims: 0,
    products: 0,
  });
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get client profile by user_id
        const clientsResponse = await getClients();
        const clientProfile = clientsResponse.data?.find(c => c.user_id === user?.id);
        
        if (clientProfile) {
          setClient(clientProfile);
          const clientRes = await getClient(clientProfile.id);
          setClient(clientRes.data);
          
          // Get claims count
          const claimsResponse = await getClaims();
          const clientClaims = claimsResponse.data?.filter(
            claim => claim.client_id === clientProfile.id
          ) || [];
          
          setStats({
            claims: clientClaims.length,
            products: clientRes.data?.products?.length || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div>
      <h1>Client Dashboard</h1>
      <p>Welcome, {user?.username || user?.email}!</p>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="My Claims"
              value={stats.claims}
              prefix={<FileTextOutlined />}
              loading={loading}
            />
            <Link to="/client/claims">
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                View Claims →
              </Button>
            </Link>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="My Products"
              value={stats.products}
              prefix={<ShoppingOutlined />}
              loading={loading}
            />
            <Link to="/client/products">
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                View Products →
              </Button>
            </Link>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Profile"
              value=""
              prefix={<UserOutlined />}
              loading={loading}
            />
            <Link to="/client/profile">
              <Button type="link" style={{ padding: 0, marginTop: 8 }}>
                View Profile →
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Quick Actions" style={{ height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/client/claims/create">
                <Button type="primary" block icon={<PlusOutlined />}>
                  Create New Claim
                </Button>
              </Link>
              <Link to="/client/profile">
                <Button block icon={<UserOutlined />}>
                  View My Profile
                </Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ClientDashboard;
