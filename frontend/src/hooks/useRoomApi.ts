import api from '../apis/axios';

export const useRoomApi = {
  findAll: () => api.get('/room'),
  createRoom: (data: { roomName: string }) => api.post('/room', data),
  searchRoomScheduleDate: (data: { roomId: number; scheduleDate: string }) =>
    api.get(`/room/${data.roomId}/schedule/date`, {
      params: { scheduleDate: data.scheduleDate },
    }),
  searchRoomSchedule: (data: { roomId: number }) =>
    api.get(`/room/${data.roomId}/schedule/room`),

  searchRoom: (data: { roomId: number }) => api.get(`/room/${data.roomId}`),
  deleteRoom: (data: { roomId: number }) => api.delete(`/room/${data.roomId}`),
};
