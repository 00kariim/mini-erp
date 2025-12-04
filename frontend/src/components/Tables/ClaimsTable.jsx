import React from 'react';
import { Table, Tag, Button } from 'antd';
import { Link } from 'react-router-dom';

const ClaimsTable = ({ claims, loading = false, basePath = '/client' }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'resolved' ? 'green' : status === 'in_review' ? 'orange' : 'blue'}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Link to={`${basePath}/claims/${record.id}`}>
          <Button type="link" size="small">View</Button>
        </Link>
      ),
    },
  ];

  return <Table dataSource={claims} columns={columns} rowKey="id" loading={loading} />;
};

export default ClaimsTable;