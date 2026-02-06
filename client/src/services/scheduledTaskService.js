import api from './api';

const createScheduledTask = async (taskData) => {
  // taskData: { title, priority, scheduledDate }
  const response = await api.post('/scheduled-tasks', taskData);
  return response.data;
};

const getScheduledTasks = async () => {
  const response = await api.get('/scheduled-tasks');
  return response.data;
};

const getScheduledTaskById = async (id) => {
  const response = await api.get(`/scheduled-tasks/${id}`);
  return response.data;
};

const updateScheduledTask = async (id, taskData) => {
  const response = await api.put(`/scheduled-tasks/${id}`, taskData);
  return response.data;
};

const deleteScheduledTask = async (id) => {
  const response = await api.delete(`/scheduled-tasks/${id}`);
  return response.data;
};

const scheduledTaskService = {
  createScheduledTask,
  getScheduledTasks,
  getScheduledTaskById,
  updateScheduledTask,
  deleteScheduledTask
};

export default scheduledTaskService;
