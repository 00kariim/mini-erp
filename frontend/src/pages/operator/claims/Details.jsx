import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Space, Spin, Tag, Form, Select, message, Upload } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { getClaim, updateClaim, addClaimComment, uploadClaimFile } from '../../../api/claims';
import CommentsList from '../../../components/Comments/CommentsList';
import AddCommentForm from '../../../components/Comments/AddCommentForm';

const { Option } = Select;

const OperatorClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClaim();
  }, [id]);

  const fetchClaim = async () => {
    try {
      setLoading(true);
      const response = await getClaim(id);
      setClaim(response.data);
      form.setFieldsValue({ status: response.data.status });
    } catch (error) {
      console.error('Error fetching claim:', error);
      message.error('Failed to load claim');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (values) => {
    try {
      setSubmitting(true);
      await updateClaim(id, { status: values.status });
      message.success('Claim status updated successfully!');
      fetchClaim();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to update claim status';
      message.error(errorMsg);
      console.error('Error updating claim:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async (comment) => {
    try {
      await addClaimComment(id, { comment });
      message.success('Comment added successfully!');
      fetchClaim();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to add comment';
      message.error(errorMsg);
      console.error('Error adding comment:', err);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      await uploadClaimFile(id, file);
      message.success('File uploaded successfully!');
      fetchClaim();
      return false; // Prevent default upload
    } catch (err) {
      message.error('Failed to upload file');
      console.error('Error uploading file:', err);
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
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/operator/claims')}>
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
          <strong>Created: </strong>
          {new Date(claim.created_at).toLocaleString()}
        </div>
      </Card>

      <Card title="Update Status" style={{ marginBottom: 16 }}>
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
            <Button type="primary" htmlType="submit" loading={submitting}>
              Update Status
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

export default OperatorClaimDetails;

