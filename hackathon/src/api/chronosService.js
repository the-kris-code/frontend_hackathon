import api from "./api";
import { AuthService } from "./authService";

export const ChronosService = {
  async conversar(aulaId, mensagem, conversaId) {
    const token = AuthService.getToken();
    const response = await api.post(
      "/chronos/conversar", 
      {
        aulaId: aulaId,
        mensagem: mensagem,
        ...(conversaId ? { conversaId } : {})
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  async gerarAtividade(aulaId, codigoHabilidade, tema, conversaId) {
    const token = AuthService.getToken();
    const response = await api.post(
      "/chronos/gerar-atividade",
      {
        aulaId: aulaId,
        codigoHabilidade: codigoHabilidade,
        tema: tema,
        ...(conversaId ? { conversaId } : {})
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  async gerarPlano(aulaId, codigoHabilidade, tema) {
    const token = AuthService.getToken();
    const response = await api.post(
      "/chronos/gerar-plano",
      {
        aulaId: aulaId,
        codigoHabilidade: codigoHabilidade,
        tema: tema
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  async getConversas() {
    const token = AuthService.getToken();
    const response = await api.get("/chronos/conversas", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getFiltros() {
    const token = AuthService.getToken(); 
    const response = await api.get("/habilidades/filtros", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
