import axios from "axios"; // Assuming the path to the redux store

const BASE_URL = "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  // timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
