import api from './api';

export const PeriodoService = {
  getAll: async () => {
    const response = await api.get("/periodos");
    return response.data;
  },

  getById: async (id) => {  
    const response = await api.get(`/periodo/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/periodo", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/periodo/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/periodo/${id}`);
    return response.data;
  },
};