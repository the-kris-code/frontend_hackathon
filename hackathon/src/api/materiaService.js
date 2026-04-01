import api from "./api";

export const MateriaService = {
  getAll: async () => {
    const response = await api.get("/materias");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/materias/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/materia", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/materia/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/materia/${id}`);
    return response.data;
  },
};