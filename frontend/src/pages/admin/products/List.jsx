import React, { useEffect, useState } from 'react';
import { Button, Modal, Card } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import ProductsTable from '../../../components/Tables/ProductsTable';
import ProductForm from '../../../components/Forms/ProductForm';
import AssignProductToClientModal from '../../../components/Modals/AssignProductToClientModal';
import { getProducts, deleteProduct, updateProduct } from '../../../api/products';
import { getClients } from '../../../api/clients';
import { assignProductToClient } from '../../../api/clients';
import ConfirmDeleteModal from '../../../components/Modals/ConfirmDeleteModal';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [assignProductId, setAssignProductId] = useState(null);
  const [clients, setClients] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await getClients();
      setClients(response.data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProductId);
      setDeleteModalVisible(false);
      setSelectedProductId(null);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openDeleteModal = (productId) => {
    setSelectedProductId(productId);
    setDeleteModalVisible(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditModalVisible(true);
    setError(null);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setSelectedProduct(null);
    setError(null);
  };

  const handleEditSubmit = async (values) => {
    try {
      setSubmitting(true);
      setError(null);
      await updateProduct(selectedProduct.id, values);
      setEditModalVisible(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update product');
      console.error('Error updating product:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const openAssignModal = (productId) => {
    setAssignProductId(productId);
    setAssignModalVisible(true);
  };

  const closeAssignModal = () => {
    setAssignModalVisible(false);
    setAssignProductId(null);
  };

  const handleAssignProduct = async (clientId) => {
    try {
      setSubmitting(true);
      await assignProductToClient(clientId, { client_id: clientId, product_id: assignProductId });
      setAssignModalVisible(false);
      setAssignProductId(null);
      fetchProducts();
    } catch (err) {
      console.error('Error assigning product:', err);
      alert(err.response?.data?.detail || 'Failed to assign product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Products</h1>
        <Link to="/admin/products/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Create Product
          </Button>
        </Link>
      </div>
      <ProductsTable
        products={products}
        onEdit={openEditModal}
        onAssign={openAssignModal}
        onDelete={openDeleteModal}
        loading={loading}
      />
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedProductId(null);
        }}
        onConfirm={handleDelete}
        title="Delete Product"
        content="Are you sure you want to delete this product? This action cannot be undone."
      />

      <Modal
        title="Edit Product"
        open={editModalVisible}
        onCancel={closeEditModal}
        footer={null}
        width={600}
      >
        <Card>
          <ProductForm
            initialValues={selectedProduct}
            onSubmit={handleEditSubmit}
            loading={submitting}
            error={error}
            submitText="Update Product"
          />
        </Card>
      </Modal>

      <AssignProductToClientModal
        visible={assignModalVisible}
        onCancel={closeAssignModal}
        onOk={handleAssignProduct}
        productId={assignProductId}
        loading={submitting}
      />
    </div>
  );
};

export default AdminProducts;

