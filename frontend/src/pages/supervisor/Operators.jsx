import React, { useEffect, useState } from 'react';
import { Table, Tag, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getUsers } from '../../api/users';

const SupervisorOperators = () => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      // Filter for operators
      const ops = response.data?.filter(user => 
        user.roles?.some(role => role.name === 'Operator')
      ) || [];
      setOperators(ops);
    } catch (error) {
      console.error('Error fetching operators:', error);
    } finally {
      setLoading(false);
    }
  };

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
  ];

  return (
    <div>
      <h1>Operators</h1>
      <Card>
        <Table
          dataSource={operators}
          columns={columns}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default SupervisorOperators;

