import api from './axios';

export const announcementApi = {
  getAnnouncements: () => api.get('/announcements'),
  createAnnouncement: (data) => api.post('/announcements', data)
};
