import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Alert } from 'antd';
import { getClients } from '../../api/clients';

const { Option } = Select;

const ClaimForm = ({
  initialValues,
  onSubmit,
  loading,
  error,
  submitText = 'Submit',
  showClientSelect = true,
  showStatusSelect = true,
}) => {
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (showClientSelect) {
      const fetchClients = async () => {
        try {
          const response = await getClients();
          setClients(response.data || []);
        } catch (err) {
          console.error('Error fetching clients:', err);
        }
      };
      fetchClients();
    }
  }, [showClientSelect]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const onFinish = (values) => {
    onSubmit(values);
  };

  return (
    <>
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          status: 'submitted',
        }}
      >
        {showClientSelect && (
          <Form.Item
            label="Client"
            name="client_id"
            rules={[{ required: true, message: 'Please select a client!' }]}
          >
            <Select placeholder="Select client">
              {clients.map((client) => (
                <Option key={client.id} value={client.id}>
                  {client.full_name} ({client.email})
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input claim description!' }]}
        >
          <Input.TextArea rows={5} placeholder="Describe the claim..." />
        </Form.Item>

        {showStatusSelect && (
          <Form.Item
            label="Status"
            name="status"
          >
            <Select>
              <Option value="submitted">Submitted</Option>
              <Option value="in_review">In Review</Option>
              <Option value="resolved">Resolved</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {submitText}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ClaimForm;

