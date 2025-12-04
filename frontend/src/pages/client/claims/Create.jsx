import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Spin, message } from 'antd';
import { createClaim } from '../../../api/claims';
import { getClients } from '../../../api/clients';
import ClaimForm from '../../../components/Forms/ClaimForm';

const ClientClaimCreate = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [clientId, setClientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientForUser = async () => {
      try {
        setLoading(true);
        const response = await getClients();
        const clients = response.data || [];

        // Find the client profile that belongs to the currently logged-in user
        const currentClient = clients.find((c) => c.user_id === user?.id);

        if (!currentClient) {
          setError('No client profile found for this user.');
          message.error('No client profile found for this user.');
          return;
        }

        setClientId(currentClient.id);
      } catch (err) {
        console.error('Error fetching client profile for claim:', err);
        setError('Failed to load client profile.');
        message.error('Failed to load client profile.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchClientForUser();
    }
  }, [user]);

  const handleSubmit = async (values) => {
    if (!clientId) {
      message.error('Cannot create claim without a client profile.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await createClaim({
        client_id: clientId,
        description: values.description,
        status: values.status || 'submitted',
      });

      message.success('Claim submitted successfully!');
      navigate('/client/claims');
    } catch (err) {
      console.error('Error creating claim:', err);
      const errorMsg = err.response?.data?.detail || 'Failed to create claim';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!clientId) {
    return <div>Unable to create claim: no client profile found.</div>;
  }

  return (
    <div>
      <h1>Create Claim</h1>
      <Card>
        <ClaimForm
          onSubmit={handleSubmit}
          loading={submitting}
          error={error}
          submitText="Submit Claim"
          showClientSelect={false}
          showStatusSelect={false}
        />
      </Card>
    </div>
  );
};

export default ClientClaimCreate;

