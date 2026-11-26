import api from './axios';

export const courseApi = {
  getPrograms: () => api.get('/programs'),
  getProgramBySlug: (slug) => api.get(`/programs/${slug}`),
  getCourses: (params) => api.get('/courses', { params }),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`)
};
