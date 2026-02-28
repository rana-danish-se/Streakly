import api from './api';

const getArchivedTasks = async () => {
  const response = await api.get('/archived-tasks');
  return response.data;
};

const moveToToday = async (id) => {
  const response = await api.post(`/archived-tasks/${id}/move-to-today`, {});
  return response.data;
};

const scheduleTask = async (id, scheduledDate) => {
  const response = await api.post(`/archived-tasks/${id}/schedule`, { scheduledDate });
  return response.data;
};

const deleteArchivedTask = async (id) => {
  const response = await api.delete(`/archived-tasks/${id}`);
  return response.data;
};

const archivedTaskService = {
  getArchivedTasks,
  moveToToday,
  scheduleTask,
  deleteArchivedTask
};

export default archivedTaskService;
