import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, Alert } from 'antd';
import { getClients } from '../../api/clients';

const { Option } = Select;

const AssignProductToClientModal = ({ visible, onCancel, onOk, productId, loading }) => {
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      const fetchClients = async () => {
        try {
          const response = await getClients();
          setClients(response.data || []);
          form.resetFields();
        } catch (err) {
          setError('Failed to load clients');
          console.error('Error fetching clients:', err);
        }
      };
      fetchClients();
    }
  }, [visible, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onOk(values.client_id);
      form.resetFields();
      setError(null);
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setError(null);
    onCancel();
  };

  return (
    <Modal
      title="Assign Product to Client"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          Assign
        </Button>,
      ]}
    >
      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
      <Form form={form} layout="vertical">
        <Form.Item
          label="Client"
          name="client_id"
          rules={[{ required: true, message: 'Please select a client!' }]}
        >
          <Select placeholder="Select client" showSearch optionFilterProp="children">
            {clients.map((client) => (
              <Option key={client.id} value={client.id}>
                {client.full_name} ({client.email})
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignProductToClientModal;

