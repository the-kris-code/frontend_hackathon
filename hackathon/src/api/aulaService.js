import api from "./api";
import { AuthService } from "./authService";

export const AulaService = {
  async getAulas() {
    const token = AuthService.getToken();
    
    const response = await api.get("/aulas", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  },

  async getById(id) {
    const token = AuthService.getToken();
    const response = await api.get(`/aulas/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async create(data) {
    const token = AuthService.getToken();
    const response = await api.post("/aula", data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async update(id, data) {
    const token = AuthService.getToken();
    const response = await api.put(`/aula/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async delete(id) {
    const token = AuthService.getToken();
    const response = await api.delete(`/aula/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};