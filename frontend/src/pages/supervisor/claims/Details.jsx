import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Space, Spin, Tag, Form, Select, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getClaim, changeClaimStatusBySupervisor, assignClaimToOperatorBySupervisor, addClaimComment } from '../../../api/claims';
import { getUsers } from '../../../api/users';
import CommentsList from '../../../components/Comments/CommentsList';
import AddCommentForm from '../../../components/Comments/AddCommentForm';
import AssignOperatorModal from '../../../components/Modals/AssignOperatorModal';

const { Option } = Select;

const SupervisorClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [claim, setClaim] = useState(null);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [claimRes, usersRes] = await Promise.all([
        getClaim(id),
        getUsers()
      ]);
      setClaim(claimRes.data);
      const ops = usersRes.data?.filter(user => 
        user.roles?.some(role => role.name === 'Operator')
      ) || [];
      setOperators(ops);
      form.setFieldsValue({ status: claimRes.data.status });
    } catch (error) {
      console.error('Error fetching claim data:', error);
      message.error('Failed to load claim');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (values) => {
    try {
      setSubmitting(true);
      await changeClaimStatusBySupervisor(id, { status: values.status });
      message.success('Claim status updated successfully!');
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to update claim status';
      message.error(errorMsg);
      console.error('Error updating claim:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignOperator = async (operatorId) => {
    try {
      setAssigning(true);
      await assignClaimToOperatorBySupervisor(id, { operator_id: operatorId });
      message.success('Claim assigned to operator successfully!');
      setAssignModalVisible(false);
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to assign claim to operator';
      message.error(errorMsg);
      console.error('Error assigning claim:', err);
    } finally {
      setAssigning(false);
    }
  };

  const handleAddComment = async (comment) => {
    try {
      await addClaimComment(id, { comment });
      message.success('Comment added successfully!');
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to add comment';
      message.error(errorMsg);
      console.error('Error adding comment:', err);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!claim) {
    return <div>Claim not found</div>;
  }

  const getStatusColor = (status) => {
    const colors = {
      submitted: 'blue',
      in_review: 'orange',
      resolved: 'green',
    };
    return colors[status] || 'default';
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/supervisor/claims')}>
          Back to Claims
        </Button>
      </Space>

      <h1>Claim Details: #{claim.id}</h1>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <strong>Status: </strong>
          <Tag color={getStatusColor(claim.status)}>{claim.status?.toUpperCase()}</Tag>
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Description: </strong>
          {claim.description}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Client ID: </strong>
          {claim.client_id}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Assigned Operator ID: </strong>
          {claim.assigned_operator_id || 'None'}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Created: </strong>
          {new Date(claim.created_at).toLocaleString()}
        </div>
      </Card>

      <Card title="Manage Claim" style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical" onFinish={handleUpdateStatus}>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select a status!' }]}
          >
            <Select>
              <Option value="submitted">Submitted</Option>
              <Option value="in_review">In Review</Option>
              <Option value="resolved">Resolved</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Update Status
              </Button>
              <Button onClick={() => setAssignModalVisible(true)}>
                Assign to Operator
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Comments" style={{ marginBottom: 16 }}>
        <CommentsList comments={claim.comments || []} />
        <div style={{ marginTop: 16 }}>
          <AddCommentForm onSubmit={handleAddComment} />
        </div>
      </Card>

      <AssignOperatorModal
        visible={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        onOk={handleAssignOperator}
        claimId={id}
        currentOperatorId={claim?.assigned_operator_id}
        loading={assigning}
      />
    </div>
  );
};

export default SupervisorClaimDetails;

