import axios from 'axios';

// Use environment variable for API URL, fallback to mock data if not available
const API_URL = process.env.REACT_APP_API_URL || null;

const api = API_URL ? axios.create({
  baseURL: API_URL,
}) : null;

// Mock data for when there's no backend
const mockTasks = [];

export const getTasks = async () => {
  if (!api) {
    // Return mock data when no backend is available
    return { data: mockTasks };
  }
  try {
    return await api.get('/');
  } catch (error) {
    console.warn('Backend not available, using local storage');
    // Fallback to localStorage
    const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    return { data: localTasks };
  }
};

export const getTask = async (id) => {
  if (!api) {
    const task = mockTasks.find(t => t._id === id);
    return { data: task };
  }
  try {
    return await api.get(`/${id}`);
  } catch (error) {
    const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = localTasks.find(t => t._id === id);
    return { data: task };
  }
};

export const createTask = async (task) => {
  if (!api) {
    const newTask = { ...task, _id: Date.now().toString(), createdAt: new Date() };
    mockTasks.push(newTask);
    // Save to localStorage
    const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    localTasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(localTasks));
    return { data: newTask };
  }
  try {
    return await api.post('/', task);
  } catch (error) {
    const newTask = { ...task, _id: Date.now().toString(), createdAt: new Date() };
    const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    localTasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(localTasks));
    return { data: newTask };
  }
};

export const updateTask = async (id, task) => {
  if (!api) {
    const index = mockTasks.findIndex(t => t._id === id);
    if (index !== -1) {
      mockTasks[index] = { ...mockTasks[index], ...task };
    }
    // Update in localStorage
    const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const localIndex = localTasks.findIndex(t => t._id === id);
    if (localIndex !== -1) {
      localTasks[localIndex] = { ...localTasks[localIndex], ...task };
      localStorage.setItem('tasks', JSON.stringify(localTasks));
    }
    return { data: mockTasks[index] };
  }
  try {
    return await api.put(`/${id}`, task);
  } catch (error) {
    const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const localIndex = localTasks.findIndex(t => t._id === id);
    if (localIndex !== -1) {
      localTasks[localIndex] = { ...localTasks[localIndex], ...task };
      localStorage.setItem('tasks', JSON.stringify(localTasks));
    }
    return { data: localTasks[localIndex] };
  }
};

export const deleteTask = async (id) => {
  if (!api) {
    const index = mockTasks.findIndex(t => t._id === id);
    if (index !== -1) {
      mockTasks.splice(index, 1);
    }
    // Delete from localStorage
    const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const filtered = localTasks.filter(t => t._id !== id);
    localStorage.setItem('tasks', JSON.stringify(filtered));
    return { data: { success: true } };
  }
  try {
    return await api.delete(`/${id}`);
  } catch (error) {
    const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const filtered = localTasks.filter(t => t._id !== id);
    localStorage.setItem('tasks', JSON.stringify(filtered));
    return { data: { success: true } };
  }
};

export default api;
