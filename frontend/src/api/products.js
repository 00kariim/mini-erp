import api from './axios';

// Create product
export const createProduct = (data) => api.post('/products', data);

// List products
export const getProducts = () => api.get('/products');

// Product detail
export const getProduct = (id) => api.get(`/products/${id}`);

// Update product
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);

// Delete product
export const deleteProduct = (id) => api.delete(`/products/${id}`);
