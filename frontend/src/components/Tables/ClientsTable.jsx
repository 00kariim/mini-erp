import React from 'react';
import { Table, Button } from 'antd';
import { Link } from 'react-router-dom';

const ClientsTable = ({ clients, basePath = '/admin', loading = false, products = [] }) => {
  // Calculate revenue for each client
  const calculateRevenue = (client) => {
    if (!client.products || !Array.isArray(client.products)) return 0;
    
    return client.products.reduce((total, cp) => {
      // cp can be {product_id, assigned_at} or {id, assigned_at}
      const productId = cp.product_id || cp.id;
      const product = products.find(p => p.id === productId);
      if (product && product.price) {
        return total + parseFloat(product.price);
      }
      return total;
    }, 0);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Revenue',
      key: 'revenue',
      render: (_, record) => {
        const revenue = calculateRevenue(record);
        return revenue > 0 ? `$${revenue.toFixed(2)}` : '$0.00';
      },
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Link to={`${basePath}/clients/${record.id}`}>
          <Button type="link" size="small">View</Button>
        </Link>
      ),
    },
  ];

  return <Table dataSource={clients} columns={columns} rowKey="id" loading={loading} />;
};

export default ClientsTable;

