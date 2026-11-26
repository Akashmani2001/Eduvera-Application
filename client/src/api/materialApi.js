import api from './axios';

export const materialApi = {
  getMaterials: (params) => api.get('/materials', { params }),
  createMaterial: (formData) => api.post('/materials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteMaterial: (id) => api.delete(`/materials/${id}`)
};
