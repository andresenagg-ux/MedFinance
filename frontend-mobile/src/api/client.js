import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.warn('API error', error.response.status, error.response.data);
    } else {
      console.warn('Network error', error.message);
    }
    return Promise.reject(error);
  }
);

export const getApiBaseUrl = () => API_BASE_URL;

export default client;
