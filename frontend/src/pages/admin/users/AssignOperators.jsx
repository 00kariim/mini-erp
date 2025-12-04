import React, { useEffect, useState } from 'react';
import { Card, Form, Select, Button, Alert, message } from 'antd';
import { getUsers, bindOperator } from '../../../api/users';

const { Option } = Select;

const AdminAssignOperators = () => {
  const [form] = Form.useForm();
  const [supervisors, setSupervisors] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      const allUsers = response.data || [];
      
      const sups = allUsers.filter(user => 
        user.roles?.some(role => role.name === 'Supervisor')
      );
      const ops = allUsers.filter(user => 
        user.roles?.some(role => role.name === 'Operator')
      );
      
      setSupervisors(sups);
      setOperators(ops);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error fetching users:', err);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      const { supervisor_id, operator_ids } = values;
      
      // Assign each operator to the supervisor
      const promises = operator_ids.map(operatorId =>
        bindOperator(supervisor_id, { operator_id: operatorId })
      );
      
      await Promise.all(promises);
      
      message.success('Operators assigned to supervisor successfully!');
      form.resetFields();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to assign operators';
      setError(errorMsg);
      message.error(errorMsg);
      console.error('Error assigning operators:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Assign Operators to Supervisor</h1>
      <Card>
        {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Supervisor"
            name="supervisor_id"
            rules={[{ required: true, message: 'Please select a supervisor!' }]}
          >
            <Select placeholder="Select supervisor" showSearch optionFilterProp="children">
              {supervisors.map((supervisor) => (
                <Option key={supervisor.id} value={supervisor.id}>
                  {supervisor.username} ({supervisor.email})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Operators"
            name="operator_ids"
            rules={[{ required: true, message: 'Please select at least one operator!' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select operators"
              showSearch
              optionFilterProp="children"
            >
              {operators.map((operator) => (
                <Option key={operator.id} value={operator.id}>
                  {operator.username} ({operator.email})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Assign Operators
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminAssignOperators;

