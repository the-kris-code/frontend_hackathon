import axios from "axios";
import { AuthService } from '../api/authService';

const api = axios.create({
  baseURL: "https://hackaton-backend-fiap.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = AuthService.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;