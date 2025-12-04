import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../../api/products';

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    price: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null
      });
      navigate('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div>
      <h1>Create Product</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <input
            type="text"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default AdminProductCreate;

