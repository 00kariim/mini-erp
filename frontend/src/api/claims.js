import api from './axios';

// Create claim (client)
export const createClaim = (data) => api.post('/claims', data);

// List claims
export const getClaims = () => api.get('/claims');

// Claim details
export const getClaim = (id) => api.get(`/claims/${id}`);

// Update claim (assign operator or change status)
export const updateClaim = (id, data) => api.put(`/claims/${id}`, data);

// Upload file
export const uploadClaimFile = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post(`/claims/${id}/files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Add comment
export const addClaimComment = (id, payload) =>
  api.post(`/claims/${id}/comments`, payload);

// Assign claim to operator (admin only)
export const assignClaimToOperator = (claimId, payload) =>
  api.post(`/claims/${claimId}/assign-operator`, payload);

// Assign claim to operator by supervisor
export const assignClaimToOperatorBySupervisor = (claimId, payload) =>
  api.post(`/claims/${claimId}/assign-operator-by-supervisor`, payload);

// Change claim status (admin only)
export const changeClaimStatus = (claimId, payload) =>
  api.post(`/claims/${claimId}/change-status`, payload);

// Change claim status by supervisor
export const changeClaimStatusBySupervisor = (claimId, payload) =>
  api.post(`/claims/${claimId}/change-status-by-supervisor`, payload);
