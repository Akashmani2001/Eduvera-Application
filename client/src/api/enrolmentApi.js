import api from './axios';

export const enrolmentApi = {
  requestEnrolment: (courseId, notes) => api.post('/enrolments', { courseId, notes }),
  getEnrolments: (params) => api.get('/enrolments', { params }),
  updateEnrolmentStatus: (id, status, notes) => api.patch(`/enrolments/${id}`, { status, notes })
};
