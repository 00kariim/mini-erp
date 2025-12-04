import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button, Alert } from 'antd';
import { getProducts } from '../../api/products';

const { Option } = Select;

const AssignProductModal = ({ visible, onCancel, onOk, clientId, loading }) => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      const fetchProducts = async () => {
        try {
          const response = await getProducts();
          setProducts(response.data || []);
          form.resetFields();
        } catch (err) {
          setError('Failed to load products');
          console.error('Error fetching products:', err);
        }
      };
      fetchProducts();
    }
  }, [visible, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onOk(values.product_id);
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
          label="Product"
          name="product_id"
          rules={[{ required: true, message: 'Please select a product!' }]}
        >
          <Select placeholder="Select product">
            {products.map((product) => (
              <Option key={product.id} value={product.id}>
                {product.name} ({product.type}) - ${product.price ? parseFloat(product.price).toFixed(2) : 'N/A'}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignProductModal;

