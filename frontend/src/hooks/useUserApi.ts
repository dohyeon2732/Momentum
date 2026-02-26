import api from '../apis/axios';

export const useUserApi = {
  login: (data: { kukName: string; userName: string; password: string }) =>
    api.post('user/login', data),

  me: () => api.get('/user/me'),
  findAll: () => api.get('/user'),
  create: (data: { userName: string; password: string; kukId: number }) =>
    api.post('/user', data),

  scheduleUpcoming: (data: { userId: number }) =>
    api.get(`/user/${data.userId}/schedule/upcoming`),

  schedulePast: (data: { userId: number }) =>
    api.get(`/user/${data.userId}/schedule/past`),

  find: (data: { userId: number }) => api.get(`/user/id/${data.userId}`),
  delete: (data: { userId: number }) => api.get(`/user/id/${data.userId}`),
  findByKuk: (data: { kukId: number }) => api.get(`/user/kuk/${data.kukId}`),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/user/password', data),
};
