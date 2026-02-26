import api from '../apis/axios';

export const useScheduleApi = {
  find: (data: { scheduleId: number }) =>
    api.get(`/schedule/${data.scheduleId}`),

  delete: ( scheduleId: number ) =>
    api.delete(`/schedule/${scheduleId}`),
  findAll: () => api.get('/schedlue'),
  create: (data: {
    scheduleName: string;
    scheduleDescription: string;
    roomId: number;
    userId: number;
    scheduleDate: string;
    startTime: string;
    endTime: string;
    schedulePeople: number;
  }) => api.post('/schedule', data),

  edit: (data: {
    scheduleId: number;
    scheduleName: string;
    scheduleDescription: string;
    roomId: number;
    userId: number;
    scheduleDate: string;
    startTime: string;
    endTime:string;
    schedulePeople: number;
  }) =>
    api.put(`/schedule/${data.scheduleId}`, {
      scheduleName: data.scheduleName,
      scheduleDescription: data.scheduleDescription,
      roomId: data.roomId,
      userId: data.userId,
      scheduleDate: data.scheduleDate,
      startTime: data.startTime,
      endTime: data.endTime,
      schedulePeople: data.schedulePeople,
    }),
};
