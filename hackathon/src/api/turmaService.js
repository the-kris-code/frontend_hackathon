import api from "./api";

export const TurmaService = {
  async getAll() {
    try {
      const response = await api.get("/turmas");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/turmas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar turma:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await api.post("/turmas", data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar turma:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/turma/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar turma:", error);
      throw error;
    }
  },

  // async delete(id) {
  //   try {
  //     const response = await api.delete(`/turma/${id}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Erro ao excluir turma:", error);
  //     throw error;
  //   }
  // },
};