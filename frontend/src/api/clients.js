import api from './axios';

// List clients
export const getClients = () => api.get('/clients');

// Client profile
export const getClient = (id) => api.get(`/clients/${id}`);

// Get only client products
export const getClientProducts = (id) => api.get(`/clients/${id}/products`);

// Assign product/service
export const assignProductToClient = (id, payload) =>
  api.post(`/clients/${id}/products`, payload);

// Add comment
export const addClientComment = (id, payload) =>
  api.post(`/clients/${id}/comments`, payload);

// Get all claims for a client
export const getClientClaims = (id) =>
  api.get(`/clients/${id}/claims`);

