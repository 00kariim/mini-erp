import api from './axios';

// Get all roles (if endpoint exists)
// Note: This endpoint may not exist in the backend yet
export const getRoles = () => api.get('/roles').catch(() => ({ data: [] }));

// Assign role to user (endpoint is /users/roles/assign based on router prefix)
export const assignRole = (payload) => api.post('/users/roles/assign', payload);
