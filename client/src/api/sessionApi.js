import api from './axios';

export const sessionApi = {
  getSessions: () => api.get('/sessions'),
  createSession: (data) => api.post('/sessions', data),
  updateSession: (id, data) => api.patch(`/sessions/${id}`, data),
  joinSession: (id) => api.post(`/sessions/${id}/join`),
  getSessionAttendance: (id) => api.get(`/sessions/${id}/attendance`),
  recordAttendance: (id, records) => api.post(`/sessions/${id}/attendance`, { records })
};
