// src/axios.config.js
import axios from 'axios';
import { PUBLIC_API_URL } from '../Config/env.config.js'

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Your FastAPI backend URL
  withCredentials: true // Include cookies with requests
});

// Request Interceptor to add the Authorization header if needed
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get the idToken from cookies
    const idToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('__session='))
      ?.split('=')[1];

    if (idToken) {
      config.headers['Authorization'] = `Bearer ${idToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
