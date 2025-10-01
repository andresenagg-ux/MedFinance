import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
});

export const healthcheck = async () => {
  const response = await apiClient.get('/healthcheck');
  return response.data;
};

export default apiClient;
