import React from 'react';
import { Table, Tag, Button } from 'antd';
import { Link } from 'react-router-dom';

const UsersTable = ({ users, onDelete }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <>
          {roles?.map((role) => (
            <Tag key={role.id} color="blue">
              {role.name}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
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
          <Link to={`/admin/users/${record.id}/edit`}>
            <Button type="link" size="small">Edit</Button>
          </Link>
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

  return <Table dataSource={users} columns={columns} rowKey="id" />;
};

export default UsersTable;

