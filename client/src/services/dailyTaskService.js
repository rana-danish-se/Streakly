
import axios from 'axios';

const API_URL = '/api/daily-tasks'; // Proxy handles base URL

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const createDailyTask = async (taskData) => {
    // taskData should include { title, time, timezone }
    const config = {
        headers: getAuthHeader()
    };
    const response = await axios.post(API_URL, taskData, config);
    return response.data;
};

const getDailyTasks = async () => {
    const config = {
        headers: getAuthHeader()
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const updateDailyTask = async (id, taskData) => {
    const config = {
        headers: getAuthHeader()
    };
    const response = await axios.put(`${API_URL}/${id}`, taskData, config);
    return response.data;
};

const deleteDailyTask = async (id) => {
    const config = {
        headers: getAuthHeader()
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
};

const toggleTaskCompletion = async (id) => {
    const config = {
        headers: getAuthHeader()
    };
    const response = await axios.patch(`${API_URL}/${id}/toggle`, {}, config);
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
