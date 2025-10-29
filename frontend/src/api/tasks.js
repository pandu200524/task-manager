import axios from 'axios';

// Use environment variable for API URL, fallback to mock data if not available
const API_URL = process.env.REACT_APP_API_URL || null;

const api = API_URL ? axios.create({
  baseURL: API_URL,
}) : null;

// Helper function to get tasks from localStorage
const getLocalTasks = () => {
  return JSON.parse(localStorage.getItem('tasks') || '[]');
};

// Helper function to save tasks to localStorage
const saveLocalTasks = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const getTasks = async () => {
  if (!api) {
    // Return localStorage data when no backend is available
    return { data: getLocalTasks() };
  }
  try {
    return await api.get('/');
  } catch (error) {
    console.warn('Backend not available, using local storage');
    return { data: getLocalTasks() };
  }
};

export const getTask = async (id) => {
  if (!api) {
    const tasks = getLocalTasks();
    const task = tasks.find(t => t._id === id);
    return { data: task };
  }
  try {
    return await api.get(`/${id}`);
  } catch (error) {
    const tasks = getLocalTasks();
    const task = tasks.find(t => t._id === id);
    return { data: task };
  }
};

export const createTask = async (task) => {
  const newTask = { 
    ...task, 
    _id: Date.now().toString(), 
    createdAt: new Date().toISOString() 
  };
  
  if (!api) {
    const tasks = getLocalTasks();
    tasks.unshift(newTask); // Add to beginning
    saveLocalTasks(tasks);
    return { data: newTask };
  }
  
  try {
    return await api.post('/', task);
  } catch (error) {
    const tasks = getLocalTasks();
    tasks.unshift(newTask);
    saveLocalTasks(tasks);
    return { data: newTask };
  }
};

export const updateTask = async (id, taskUpdate) => {
  if (!api) {
    const tasks = getLocalTasks();
    const index = tasks.findIndex(t => t._id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...taskUpdate };
      saveLocalTasks(tasks);
      return { data: tasks[index] };
    }
    return { data: null };
  }
  
  try {
    return await api.put(`/${id}`, taskUpdate);
  } catch (error) {
    const tasks = getLocalTasks();
    const index = tasks.findIndex(t => t._id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...taskUpdate };
      saveLocalTasks(tasks);
      return { data: tasks[index] };
    }
    return { data: null };
  }
};

export const deleteTask = async (id) => {
  if (!api) {
    const tasks = getLocalTasks();
    const filtered = tasks.filter(t => t._id !== id);
    saveLocalTasks(filtered);
    return { data: { success: true } };
  }
  
  try {
    return await api.delete(`/${id}`);
  } catch (error) {
    const tasks = getLocalTasks();
    const filtered = tasks.filter(t => t._id !== id);
    saveLocalTasks(filtered);
    return { data: { success: true } };
  }
};

export default api;
