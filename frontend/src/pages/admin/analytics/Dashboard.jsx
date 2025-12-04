import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag } from 'antd';
import {
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import {
  getLeadsAnalytics,
  getClientsAnalytics,
  getRevenueAnalytics,
  getClaimsAnalytics,
  getSupervisorsAnalytics,
} from '../../../api/analytics';

const AdminAnalyticsDashboard = () => {
  const [leadsData, setLeadsData] = useState(null);
  const [clientsData, setClientsData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [claimsData, setClaimsData] = useState(null);
  const [supervisorsData, setSupervisorsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [leads, clients, revenue, claims, supervisors] = await Promise.all([
          getLeadsAnalytics(),
          getClientsAnalytics(),
          getRevenueAnalytics(),
          getClaimsAnalytics(),
          getSupervisorsAnalytics(),
        ]);
        setLeadsData(leads.data);
        setClientsData(clients.data);
        setRevenueData(revenue.data);
        setClaimsData(claims.data);
        setSupervisorsData(supervisors.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const leadsStatusColumns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  const leadsStatusData = leadsData?.by_status
    ? Object.entries(leadsData.by_status).map(([status, count]) => ({
        key: status,
        status: status.toUpperCase(),
        count,
      }))
    : [];

  const claimsStatusColumns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  const claimsStatusData = claimsData?.by_status
    ? Object.entries(claimsData.by_status).map(([status, count]) => ({
        key: status,
        status: status.toUpperCase(),
        count,
      }))
    : [];

  const supervisorsColumns = [
    {
      title: 'Supervisor',
      dataIndex: 'supervisor_name',
      key: 'supervisor_name',
    },
    {
      title: 'Assigned Operators',
      dataIndex: 'assigned_operators',
      key: 'assigned_operators',
    },
    {
      title: 'Total Claims',
      dataIndex: 'total_claims',
      key: 'total_claims',
    },
    {
      title: 'Resolved',
      dataIndex: 'resolved_claims',
      key: 'resolved_claims',
    },
    {
      title: 'Resolution Rate',
      dataIndex: 'resolution_rate',
      key: 'resolution_rate',
      render: (rate) => `${rate.toFixed(1)}%`,
    },
  ];

  return (
    <div>
      <h1>Analytics Dashboard</h1>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Leads"
              value={leadsData?.total_leads || 0}
              prefix={<RiseOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Clients"
              value={clientsData?.total_clients || 0}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={revenueData?.total_revenue || 0}
              prefix={<DollarOutlined />}
              precision={2}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Claims"
              value={claimsData?.total_claims || 0}
              prefix={<FileTextOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Leads by Status" loading={loading}>
            <Table
              dataSource={leadsStatusData}
              columns={leadsStatusColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Claims by Status" loading={loading}>
            <Table
              dataSource={claimsStatusData}
              columns={claimsStatusColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="Supervisor Performance" loading={loading}>
            <Table
              dataSource={supervisorsData?.supervisors || []}
              columns={supervisorsColumns}
              pagination={false}
              rowKey="supervisor_name"
            />
          </Card>
        </Col>
      </Row>

      {revenueData?.by_product && (
        <Row gutter={16}>
          <Col span={24}>
            <Card title="Revenue by Product" loading={loading}>
              <Table
                dataSource={Object.entries(revenueData.by_product).map(([name, data]) => ({
                  key: name,
                  product: name,
                  type: data.type,
                  price: `$${data.price.toFixed(2)}`,
                  assigned_count: data.assigned_count,
                  revenue: `$${data.revenue.toFixed(2)}`,
                }))}
                columns={[
                  { title: 'Product', dataIndex: 'product', key: 'product' },
                  { title: 'Type', dataIndex: 'type', key: 'type' },
                  { title: 'Price', dataIndex: 'price', key: 'price' },
                  { title: 'Assigned Count', dataIndex: 'assigned_count', key: 'assigned_count' },
                  { title: 'Revenue', dataIndex: 'revenue', key: 'revenue' },
                ]}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AdminAnalyticsDashboard;
