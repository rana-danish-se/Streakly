import api from './api';

const createDailyTask = async (taskData) => {
    // taskData should include { title, time, timezone }
    const response = await api.post('/daily-tasks', taskData);
    return response.data;
};

const getDailyTasks = async () => {
    const response = await api.get('/daily-tasks');
    return response.data;
};

const updateDailyTask = async (id, taskData) => {
    const response = await api.put(`/daily-tasks/${id}`, taskData);
    return response.data;
};

const deleteDailyTask = async (id) => {
    const response = await api.delete(`/daily-tasks/${id}`);
    return response.data;
};

const toggleTaskCompletion = async (id) => {
    const response = await api.patch(`/daily-tasks/${id}/toggle`, {});
    return response.data;
};

const dailyTaskService = {
    createDailyTask,
    getDailyTasks,
    updateDailyTask,
    deleteDailyTask,
    toggleTaskCompletion
};

export default dailyTaskService;
