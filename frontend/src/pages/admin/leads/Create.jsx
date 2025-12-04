import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import LeadForm from '../../../components/Forms/LeadForm';
import { createLead } from '../../../api/leads';

const AdminLeadCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      await createLead(values);
      navigate('/admin/leads');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create lead');
      console.error('Error creating lead:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Lead</h1>
      <Card>
        <LeadForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          submitText="Create Lead"
        />
      </Card>
    </div>
  );
};

export default AdminLeadCreate;
