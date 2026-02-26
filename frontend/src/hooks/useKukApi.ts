import api from '../apis/axios';

export const useKukApi = {
  findAll: () => api.get('/kuk'),
  make: (data: { kukName: string }) => api.post('/kuk', data),
  find: (kukId: number) => api.get(`/kuk/${kukId}`),
  delete: (kukId: number) => api.delete(`/kuk/${kukId}`),
};
