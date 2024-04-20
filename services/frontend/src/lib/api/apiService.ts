import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
