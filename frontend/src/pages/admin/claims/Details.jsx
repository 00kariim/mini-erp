import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Space, Spin, Tag, Form, Select, message, Upload } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { getClaim, updateClaim, addClaimComment, uploadClaimFile } from '../../../api/claims';
import { getUsers } from '../../../api/users';
import CommentsList from '../../../components/Comments/CommentsList';
import AddCommentForm from '../../../components/Comments/AddCommentForm';

const { Option } = Select;

const AdminClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [claim, setClaim] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [claimRes, usersRes] = await Promise.all([
        getClaim(id),
        getUsers(),
      ]);
      setClaim(claimRes.data);
      setUsers(usersRes.data);
      form.setFieldsValue({
        status: claimRes.data.status,
        assigned_operator_id: claimRes.data.assigned_operator_id || undefined,
        assigned_supervisor_id: claimRes.data.assigned_supervisor_id || undefined,
      });
    } catch (error) {
      console.error('Error fetching claim data:', error);
      message.error('Failed to load claim');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClaim = async (values) => {
    try {
      setSubmitting(true);
      await updateClaim(id, {
        status: values.status,
        assigned_operator_id: values.assigned_operator_id || null,
        assigned_supervisor_id: values.assigned_supervisor_id || null,
      });
      message.success('Claim updated successfully!');
      fetchData();
    } catch (error) {
      console.error('Error updating claim:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to update claim';
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async (comment) => {
    try {
      await addClaimComment(id, { comment });
      message.success('Comment added successfully!');
      fetchData();
    } catch (error) {
      console.error('Error adding comment:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to add comment';
      message.error(errorMsg);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      await uploadClaimFile(id, file);
      message.success('File uploaded successfully!');
      fetchData();
      return false;
    } catch (error) {
      console.error('Error uploading file:', error);
      message.error('Failed to upload file');
      return false;
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
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/claims')}>
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
          <strong>Assigned Supervisor ID: </strong>
          {claim.assigned_supervisor_id || 'None'}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Created: </strong>
          {new Date(claim.created_at).toLocaleString()}
        </div>
      </Card>

      <Card title="Update Claim" style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical" onFinish={handleUpdateClaim}>
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

          <Form.Item label="Assign Operator" name="assigned_operator_id">
            <Select allowClear placeholder="Select operator">
              {users
                .filter((u) => u.roles?.some((r) => r.name === 'Operator'))
                .map((user) => (
                  <Option key={user.id} value={user.id}>
                    {user.username}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="Assign Supervisor" name="assigned_supervisor_id">
            <Select allowClear placeholder="Select supervisor">
              {users
                .filter((u) => u.roles?.some((r) => r.name === 'Supervisor'))
                .map((user) => (
                  <Option key={user.id} value={user.id}>
                    {user.username}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Update Claim
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Upload File" style={{ marginBottom: 16 }}>
        <Upload
          beforeUpload={handleFileUpload}
          accept=".pdf,.jpg,.jpeg,.png"
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload File</Button>
        </Upload>
      </Card>

      <Card title="Comments" style={{ marginBottom: 16 }}>
        <CommentsList comments={claim.comments || []} />
        <div style={{ marginTop: 16 }}>
          <AddCommentForm onSubmit={handleAddComment} />
        </div>
      </Card>
    </div>
  );
};

export default AdminClaimDetails;

