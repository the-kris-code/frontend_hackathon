// import axios from "axios";

// const api = axios.create({
// // baseURL: "http://localhost:3000/api",
// baseURL: "https://hackaton-backend-fiap.onrender.com",
// });

// export default api; 

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