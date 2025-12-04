import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { UserAddOutlined } from '@ant-design/icons';
import { getUsers } from '../../../api/users';
import UsersTable from '../../../components/Tables/UsersTable'; 

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUsers();
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>User Management</h1>
        <Link to="/admin/users/assign-operators">
          <Button type="primary" icon={<UserAddOutlined />}>
            Assign Operators to Supervisor
          </Button>
        </Link>
      </div>
      <UsersTable users={users} />
    </div>
  );
};

export default AdminUsers;
