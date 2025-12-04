import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import UserForm from '../../../components/Forms/UserForm';
import { createUser } from '../../../api/users';

const AdminUserCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      await createUser(values);
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user');
      console.error('Error creating user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create User</h1>
      <Card>
        <UserForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          submitText="Create User"
        />
      </Card>
    </div>
  );
};

export default AdminUserCreate;
