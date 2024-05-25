import axios from "axios";

const BASE_URL = "http://fargat-farga-opbzm5amp8ir-1656924029.us-east-1.elb.amazonaws.com";


export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.method === 'delete' && config.data) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
