import api from './axios';

// Create lead
export const createLead = (data) => api.post('/leads', data);

// List leads
export const getLeads = () => api.get('/leads');

// Lead details
export const getLead = (id) => api.get(`/leads/${id}`);

// Update lead
export const updateLead = (id, data) => api.put(`/leads/${id}`, data);

// Delete lead
export const deleteLead = (id) => api.delete(`/leads/${id}`);

// Add comment to lead
export const addLeadComment = (id, payload) =>
  api.post(`/leads/${id}/comments`, payload);

// Convert lead → client
export const convertLeadToClient = (id) => api.post(`/leads/${id}/convert`);

// Assign lead to operator (admin only)
export const assignLeadToOperator = (leadId, payload) =>
  api.post(`/leads/${leadId}/assign-operator`, payload);
