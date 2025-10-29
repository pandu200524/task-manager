import axios from 'axios';

const API_URL = '/api/tasks';

const api = axios.create({
  baseURL: API_URL,
});

export const getTasks = () => api.get('/');
export const getTask = (id) => api.get(`/${id}`);
export const createTask = (task) => api.post('/', task);
export const updateTask = (id, task) => api.put(`/${id}`, task);
export const deleteTask = (id) => api.delete(`/${id}`);

export default api;