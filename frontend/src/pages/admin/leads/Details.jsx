import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Space, Spin, Tag, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import LeadForm from '../../../components/Forms/LeadForm';
import CommentsList from '../../../components/Comments/CommentsList';
import AddCommentForm from '../../../components/Comments/AddCommentForm';
import AssignLeadToOperatorModal from '../../../components/Modals/AssignLeadToOperatorModal';
import { getLead, updateLead, addLeadComment, convertLeadToClient, assignLeadToOperator } from '../../../api/leads';

const AdminLeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await getLead(id);
      setLead(response.data);
      setComments(response.data.comments || []);
    } catch (err) {
      setError('Failed to load lead');
      console.error('Error fetching lead:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    try {
      setSubmitting(true);
      setError(null);
      await updateLead(id, values);
      fetchLead();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update lead');
      console.error('Error updating lead:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async (comment) => {
    try {
      await addLeadComment(id, { comment });
      fetchLead();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleConvertToClient = async () => {
    try {
      await convertLeadToClient(id);
      message.success('Lead converted to client successfully!');
      navigate('/admin/leads');
    } catch (err) {
      console.error('Error converting lead:', err);
      message.error('Failed to convert lead to client');
    }
  };

  const handleAssignOperator = async (operatorId) => {
    try {
      setAssigning(true);
      await assignLeadToOperator(id, { operator_id: operatorId });
      message.success('Lead assigned to operator successfully!');
      setAssignModalVisible(false);
      fetchLead();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to assign lead to operator';
      message.error(errorMsg);
      console.error('Error assigning lead:', err);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!lead) {
    return <div>Lead not found</div>;
  }

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

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/leads')}>
          Back to Leads
        </Button>
      </Space>

      <h1>Lead Details</h1>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <strong>Status: </strong>
          <Tag color={getStatusColor(lead.status)}>{lead.status?.toUpperCase()}</Tag>
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Name: </strong>
          {lead.first_name} {lead.last_name}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Email: </strong>
          {lead.email}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Phone: </strong>
          {lead.phone || 'N/A'}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Assigned Operator ID: </strong>
          {lead.assigned_operator_id || 'Unassigned'}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Created: </strong>
          {new Date(lead.created_at).toLocaleString()}
        </div>
      </Card>

      <Card title="Update Lead" style={{ marginBottom: 16 }}>
        <LeadForm
          initialValues={lead}
          onSubmit={handleUpdate}
          loading={submitting}
          error={error}
          submitText="Update Lead"
        />
      </Card>

      <Card
        title="Actions"
        style={{ marginBottom: 16 }}
      >
        <Space>
          <Button type="primary" onClick={() => setAssignModalVisible(true)}>
            Assign to Operator
          </Button>
          <Button onClick={handleConvertToClient}>
            Convert to Client
          </Button>
        </Space>
      </Card>

      <AssignLeadToOperatorModal
        visible={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        onOk={handleAssignOperator}
        leadId={id}
        currentOperatorId={lead?.assigned_operator_id}
        loading={assigning}
      />

      <Card title="Comments" style={{ marginBottom: 16 }}>
        <CommentsList comments={comments} />
        <div style={{ marginTop: 16 }}>
          <AddCommentForm onSubmit={handleAddComment} />
        </div>
      </Card>
    </div>
  );
};

export default AdminLeadDetails;
