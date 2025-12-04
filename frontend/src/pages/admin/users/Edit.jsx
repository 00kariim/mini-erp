import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin } from 'antd';
import UserForm from '../../../components/Forms/UserForm';
import { getUser, updateUser } from '../../../api/users';

const AdminUserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await getUser(id);
      setUser(response.data);
    } catch (err) {
      setError('Failed to load user');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      setError(null);
      await updateUser(id, values);
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update user');
      console.error('Error updating user:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <h1>Edit User</h1>
      <Card>
        <UserForm
          initialValues={user}
          onSubmit={handleSubmit}
          loading={submitting}
          error={error}
          submitText="Update User"
        />
      </Card>
    </div>
  );
};

export default AdminUserEdit;
