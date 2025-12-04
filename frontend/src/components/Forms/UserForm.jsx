import React, { useEffect } from 'react';
import { Form, Input, Select, Switch, Button, Alert } from 'antd';

const { Option } = Select;

// Static role mapping based on backend seed data
// mini=> select * from roles;
// 1: Admin, 3: Supervisor, 4: Operator, 5: Client
const STATIC_ROLES = [
  { id: 1, name: 'Admin' },
  { id: 3, name: 'Supervisor' },
  { id: 4, name: 'Operator' },
  { id: 5, name: 'Client' },
];

const UserForm = ({ initialValues, onSubmit, loading, error, submitText = 'Submit' }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        role_ids: initialValues.roles?.map((r) => r.id) || [],
      });
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
          is_active: true,
          role_ids: [],
        }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input username!' }]}
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

        {!initialValues ? (
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password />
          </Form.Item>
        ) : (
          <Form.Item
            label="Password (leave blank to keep current password)"
            name="password"
            rules={[
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password placeholder="Enter new password or leave blank" />
          </Form.Item>
        )}

        <Form.Item
          label="Roles"
          name="role_ids"
          rules={[
            { required: true, message: 'Please select at least one role!' },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select roles"
            optionFilterProp="children"
          >
            {STATIC_ROLES.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Active"
          name="is_active"
          valuePropName="checked"
        >
          <Switch />
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

export default UserForm;

