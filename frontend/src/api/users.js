import api from './axios';

// Admin: create new user
export const createUser = (data) => api.post('/users', data);

// Admin: list all users
export const getUsers = () => api.get('/users');

// Get specific user
export const getUser = (id) => api.get(`/users/${id}`);

// Update user info
export const updateUser = (id, data) => api.put(`/users/${id}`, data);

// Update user password
export const resetPassword = (id, payload) =>
  api.patch(`/users/${id}/password`, payload);

// Deactivate / delete user
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Assign role
export const assignRole = (data) => api.post('/users/roles/assign', data);

// Bind operator to supervisor
export const bindOperator = (supervisorId, payload) =>
  api.post(`/users/supervisor/${supervisorId}/assign-operator`, payload);
