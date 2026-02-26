import axios from 'axios';

const api = axios.create({
  baseURL: 'http://43.201.122.57:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;

  // const noAuthPaths = ['/users/login'];

  // const url = config.url || '';

  // if (!noAuthPaths.some((path) => url.includes(path))) {
  //   const token = localStorage.getItem('accessToken');
  //   if (token && config.headers) {
  //     config.headers['Authorization'] = `Bearer ${token}`;
  //   }
  // }
  // return config;
});

export default api;
