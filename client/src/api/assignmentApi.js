import api from './axios';

export const assignmentApi = {
  getAssignments: (params) => api.get('/assignments', { params }),
  getAssignmentById: (id) => api.get(`/assignments/${id}`),
  createAssignment: (data) => api.post('/assignments', data),
  submitAssignment: (id, formData) => api.post(`/assignments/${id}/submissions`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getSubmissionsForAssignment: (id) => api.get(`/assignments/${id}/submissions`),
  gradeSubmission: (id, data) => api.patch(`/submissions/${id}/grade`, data),
  getMySubmissions: () => api.get('/submissions/my')
};
