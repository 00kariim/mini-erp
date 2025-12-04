import React, { useEffect } from 'react';
import { Form, Input, Button, Alert } from 'antd';

const ClientForm = ({ initialValues, onSubmit, loading, error, submitText = 'Submit' }) => {
  const [form] = Form.useForm();

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
      >
        <Form.Item
          label="Full Name"
          name="full_name"
          rules={[{ required: true, message: 'Please input full name!' }]}
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
          label="Address"
          name="address"
        >
          <Input.TextArea rows={3} />
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

export default ClientForm;

