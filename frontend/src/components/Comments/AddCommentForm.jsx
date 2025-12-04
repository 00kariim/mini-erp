import React from 'react';
import { Form, Input, Button } from 'antd';

const { TextArea } = Input;

const AddCommentForm = ({ onSubmit, loading, submitText = 'Add Comment' }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onSubmit(values.comment);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="comment"
        rules={[{ required: true, message: 'Please input a comment!' }]}
      >
        <TextArea
          rows={3}
          placeholder="Add a comment..."
          showCount
          maxLength={1000}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddCommentForm;

