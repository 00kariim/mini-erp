import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Alert } from 'antd';
import { getUsers } from '../../api/users';

const { Option } = Select;

const LeadForm = ({ initialValues, onSubmit, loading, error, submitText = 'Submit' }) => {
  const [form] = Form.useForm();
  const [operators, setOperators] = React.useState([]);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const response = await getUsers();
        // Filter for operators
        const ops = response.data?.filter(user => 
          user.roles?.some(role => role.name === 'Operator')
        ) || [];
        setOperators(ops);
      } catch (err) {
        console.error('Error fetching operators:', err);
      }
    };
    fetchOperators();
  }, []);

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
          status: 'new',
        }}
      >
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: 'Please input first name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: 'Please input last name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
        >
          <Select>
            <Option value="new">New</Option>
            <Option value="contacted">Contacted</Option>
            <Option value="qualified">Qualified</Option>
            <Option value="converted">Converted</Option>
            <Option value="lost">Lost</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Assign Operator"
          name="assigned_operator_id"
        >
          <Select allowClear placeholder="Select operator">
            {operators.map((operator) => (
              <Option key={operator.id} value={operator.id}>
                {operator.username}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {submitText}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LeadForm;

