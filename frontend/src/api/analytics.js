import api from './axios';

// Get leads analytics
export const getLeadsAnalytics = () => api.get('/analytics/leads');

// Get clients analytics
export const getClientsAnalytics = () => api.get('/analytics/clients');

// Get revenue analytics
export const getRevenueAnalytics = () => api.get('/analytics/revenue');

// Get claims analytics
export const getClaimsAnalytics = () => api.get('/analytics/claims');

// Get supervisors analytics
export const getSupervisorsAnalytics = () => api.get('/analytics/supervisors');

