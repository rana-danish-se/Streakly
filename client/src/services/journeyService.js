import api from './api';

/**
 * Create a new journey
 * @param {Object} journeyData - { title, description, targetDays, tasks? }
 * @returns {Promise} Journey creation response
 */
export const createJourney = async (journeyData) => {
  const response = await api.post('/journeys', journeyData);
  return response.data;
};

/**
 * Get all journeys for user
 * @param {string} status - 'active' | 'completed' | 'all'
 * @returns {Promise} Journeys list
 */
export const getJourneys = async (status = 'active') => {
  const response = await api.get(`/journeys?status=${status}`);
  return response.data;
};

/**
 * Get single journey with tasks
 * @param {string} journeyId - Journey ID
 * @returns {Promise} Journey details
 */
export const getJourney = async (journeyId) => {
  const response = await api.get(`/journeys/${journeyId}`);
  return response.data;
};

/**
 * Update journey
 * @param {string} journeyId - Journey ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise} Updated journey
 */
export const updateJourney = async (journeyId, updateData) => {
  const response = await api.put(`/journeys/${journeyId}`, updateData);
  return response.data;
};

/**
 * Delete journey (soft delete)
 * @param {string} journeyId - Journey ID
 * @returns {Promise} Deletion response
 */
export const deleteJourney = async (journeyId) => {
  const response = await api.delete(`/journeys/${journeyId}`);
  return response.data;
};

/**
 * Mark journey as completed
 * @param {string} journeyId - Journey ID
 * @param {string} notes - Optional completion notes
 * @returns {Promise} Completed journey
 */


/**
 * Reactivate a completed journey
 * @param {string} journeyId - Journey ID
 * @returns {Promise} Reactivated journey
 */
export const reactivateJourney = async (journeyId) => {
  const response = await api.post(`/journeys/${journeyId}/reactivate`);
  return response.data;
};

/**
 * Add resource to journey
 * @param {string} journeyId - Journey ID
 * @param {FormData|Object} resourceData - File or link data
 * @returns {Promise} Updated journey
 */
export const addResource = async (journeyId, resourceData) => {
  const headers = resourceData instanceof FormData 
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' };
    
  const response = await api.post(`/journeys/${journeyId}/resources`, resourceData, { headers });
  return response.data;
};

/**
 * Delete resource from journey
 * @param {string} journeyId - Journey ID
 * @param {string} resourceId - Resource ID
 * @returns {Promise} Updated journey
 */
export const deleteResource = async (journeyId, resourceId) => {
  const response = await api.delete(`/journeys/${journeyId}/resources/${resourceId}`);
  return response.data;
};

/**
 * Complete a journey
 * @param {string} journeyId - Journey ID
 * @param {string} notes - Optional completion notes
 * @returns {Promise} Completed journey
 */
export const completeJourney = async (journeyId, notes) => {
  const response = await api.post(`/journeys/${journeyId}/complete`, { notes });
  return response.data;
};

/**
 * Create a new task for a journey
 * @param {string} journeyId - Journey ID
 * @param {string} name - Task name
 * @returns {Promise} Created task
 */
export const createTask = async (journeyId, name) => {
  const response = await api.post(`/journeys/${journeyId}/tasks`, { name });
  return response.data;
};

/**
 * Create multiple tasks for a journey
 * @param {string} journeyId - Journey ID
 * @param {Array<string>} tasks - Array of task names
 * @returns {Promise} Created tasks response
 */
export const createBulkTasks = async (journeyId, tasks) => {
  const response = await api.post(`/journeys/${journeyId}/tasks/bulk`, { tasks });
  return response.data;
};

/**
 * Update a task
 * @param {string} taskId - Task ID
 * @param {Object} updates - { name, completed }
 * @returns {Promise} Updated task
 */
export const updateTask = async (taskId, updates) => {
  const response = await api.put(`/tasks/${taskId}`, updates);
  return response.data;
};

/**
 * Delete a task
 * @param {string} taskId - Task ID
 * @returns {Promise} Deletion response
 */
export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

/**
 * Start a pending journey immediately
 * @param {string} id - Journey ID
 * @returns {Promise} Update response
 */
export const startJourney = async (id) => {
  const response = await api.post(`/journeys/${id}/start`);
  return response.data;
};

export default {
  createJourney,
  getJourneys,
  getJourney,
  updateJourney,
  deleteJourney,
  completeJourney,
  addResource,
  deleteResource,
  startJourney,
  createTask,
  createBulkTasks,
  updateTask,
  deleteTask,
  reactivateJourney
};
