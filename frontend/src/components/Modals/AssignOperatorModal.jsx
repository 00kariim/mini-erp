import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, Alert } from 'antd';
import { getUsers } from '../../api/users';

const { Option } = Select;

const AssignOperatorModal = ({ visible, onCancel, onOk, claimId, currentOperatorId, loading }) => {
  const [form] = Form.useForm();
  const [operators, setOperators] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      const fetchOperators = async () => {
        try {
          const response = await getUsers();
          const ops = response.data?.filter(user => 
            user.roles?.some(role => role.name === 'Operator')
          ) || [];
          setOperators(ops);
          form.setFieldsValue({ operator_id: currentOperatorId || undefined });
        } catch (err) {
          setError('Failed to load operators');
          console.error('Error fetching operators:', err);
        }
      };
      fetchOperators();
    }
  }, [visible, currentOperatorId, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onOk(values.operator_id);
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
      title="Assign Operator"
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
          label="Operator"
          name="operator_id"
          rules={[{ required: true, message: 'Please select an operator!' }]}
        >
          <Select placeholder="Select operator" allowClear>
            {operators.map((operator) => (
              <Option key={operator.id} value={operator.id}>
                {operator.username} ({operator.email})
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignOperatorModal;

