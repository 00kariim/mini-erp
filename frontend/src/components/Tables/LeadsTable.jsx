import React from 'react';
import { Table, Tag, Button } from 'antd';
import { Link } from 'react-router-dom';

const LeadsTable = ({ leads, onDelete, onAssign, basePath = '/admin', loading = false }) => {
  const getStatusColor = (status) => {
    const colors = {
      new: 'blue',
      contacted: 'cyan',
      qualified: 'green',
      converted: 'purple',
      lost: 'red',
    };
    return colors[status] || 'default';
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
      key: 'name',
      render: (_, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Operator ID',
      dataIndex: 'assigned_operator_id',
      key: 'assigned_operator_id',
      render: (id) => id || 'Unassigned',
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
        <>
          <Link to={`${basePath}/leads/${record.id}`}>
            <Button type="link" size="small">View</Button>
          </Link>
          {onAssign && (
            <Button
              type="link"
              size="small"
              onClick={() => onAssign(record)}
            >
              Assign
            </Button>
          )}
          {onDelete && (
            <Button
              type="link"
              danger
              size="small"
              onClick={() => onDelete(record.id)}
            >
              Delete
            </Button>
          )}
        </>
      ),
    },
  ];

  return <Table dataSource={leads} columns={columns} rowKey="id" loading={loading} />;
};

export default LeadsTable;

