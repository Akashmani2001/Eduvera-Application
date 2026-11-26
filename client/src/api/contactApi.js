import api from './axios';

export const contactApi = {
  submitContact: (data) => api.post('/contact', data),
  getContacts: () => api.get('/contact')
};
