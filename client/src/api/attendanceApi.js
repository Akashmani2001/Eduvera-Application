import api from './axios';

export const attendanceApi = {
  getStudentProgress: (studentId) => api.get('/students/me/progress', { params: { studentId } })
};

export const announcementApi = {
  getAnnouncements: () => api.get('/announcements'),
  createAnnouncement: (data) => api.post('/announcements', data)
};

export const contactApi = {
  submitContact: (data) => api.post('/contact', data),
  getContacts: () => api.get('/contact')
};
