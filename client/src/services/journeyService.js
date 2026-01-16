import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
export const completeJourney = async (journeyId, notes) => {
  const response = await api.post(`/journeys/${journeyId}/complete`, { notes });
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

export default {
  createJourney,
  getJourneys,
  getJourney,
  updateJourney,
  deleteJourney,
  completeJourney,
  addResource,
  deleteResource
};
