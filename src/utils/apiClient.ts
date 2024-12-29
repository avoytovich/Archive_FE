import axios from 'axios';
import { handleError } from '.';

// Axios instance with baseURL
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8033',
});

// Axios interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    handleError(error, 'API Error');
    return Promise.reject(error);
  }
);

export default apiClient;
