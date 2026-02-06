import api from './api';

const createTodayTask = async (taskData) => {
  // taskData: { title, priority }
  const response = await api.post('/today-tasks', taskData);
  return response.data;
};

const getTodayTasks = async () => {
  const response = await api.get('/today-tasks');
  return response.data;
};

const updateTodayTask = async (id, taskData) => {
  const response = await api.put(`/today-tasks/${id}`, taskData);
  return response.data;
};

const deleteTodayTask = async (id) => {
  const response = await api.delete(`/today-tasks/${id}`);
  return response.data;
};

const toggleTodayTaskCompletion = async (id) => {
  const response = await api.patch(`/today-tasks/${id}/toggle`, {});
  return response.data;
};

const todayTaskService = {
  createTodayTask,
  getTodayTasks,
  updateTodayTask,
  deleteTodayTask,
  toggleTodayTaskCompletion
};

export default todayTaskService;
