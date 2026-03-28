import api from "./api";
import { AuthService } from "./authService";

export const ChronosService = {
  async conversar(aulaId, mensagem) {
    const token = AuthService.getToken();
    const response = await api.post(
      "/chronos/conversar", 
      {
        aulaId: aulaId,
        mensagem: mensagem
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  async gerarAtividade(aulaId, codigoHabilidade, tema) {
    const token = AuthService.getToken();
    const response = await api.post(
      "/chronos/gerar-atividade",
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
  }
};