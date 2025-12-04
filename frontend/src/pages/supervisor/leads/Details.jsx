import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Space, Spin, Tag, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CommentsList from '../../../components/Comments/CommentsList';
import AddCommentForm from '../../../components/Comments/AddCommentForm';
import { getLead, addLeadComment } from '../../../api/leads';

const SupervisorLeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await getLead(id);
      setLead(response.data);
    } catch (err) {
      message.error('Failed to load lead');
      console.error('Error fetching lead:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (comment) => {
    try {
      await addLeadComment(id, { comment });
      message.success('Comment added successfully!');
      fetchLead();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to add comment';
      message.error(errorMsg);
      console.error('Error adding comment:', err);
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
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/supervisor/leads')}>
          Back to Leads
        </Button>
      </Space>

      <h1>Lead Details: {lead.first_name} {lead.last_name}</h1>

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

      <Card title="Comments" style={{ marginBottom: 16 }}>
        <CommentsList comments={lead.comments || []} />
        <div style={{ marginTop: 16 }}>
          <AddCommentForm onSubmit={handleAddComment} />
        </div>
      </Card>
    </div>
  );
};

export default SupervisorLeadDetails;

