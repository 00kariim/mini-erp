import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, Alert } from 'antd';

const ProductForm = ({ initialValues, onSubmit, loading, error, submitText = 'Submit' }) => {
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
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input product name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Please input product type!' }]}
        >
          <Input placeholder="e.g., Insurance, Real Estate, Service" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            step={0.01}
            precision={2}
            placeholder="0.00"
          />
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

export default ProductForm;

