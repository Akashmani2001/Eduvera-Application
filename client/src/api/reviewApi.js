import api from './axios';

export const reviewApi = {
  getPublicReviews: () => api.get('/reviews/public'),
  getTutorsAndSubjects: () => api.get('/reviews/tutors'),
  getMyReviews: () => api.get('/reviews/my'),
  createReview: (data) => api.post('/reviews', data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`)
};
