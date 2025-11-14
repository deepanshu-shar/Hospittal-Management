import { apiClient } from './client';

const createResourceClient = (resourceName) => ({
  list: (params) => apiClient.get(`/v1/${resourceName}`, { params }),
  getById: (id) => apiClient.get(`/v1/${resourceName}/${id}`),
  create: (payload) => apiClient.post(`/v1/${resourceName}`, payload),
  update: (id, payload) => apiClient.put(`/v1/${resourceName}/${id}`, payload),
  remove: (id) => apiClient.delete(`/v1/${resourceName}/${id}`)
});

const dashboardClient = {
  summary: () => apiClient.get('/v1/dashboard/summary')
};

export { createResourceClient, dashboardClient };
