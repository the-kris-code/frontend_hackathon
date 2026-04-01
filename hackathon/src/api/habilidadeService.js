import api from "./api";
import { AuthService } from "./authService";

export const HabilidadeService = {
  async getHabilidades(materiaId, anoEscolar) {
    const token = AuthService.getToken();
    let url = "/habilidades";
    
    const params = new URLSearchParams();
    if (materiaId) params.append("materiaId", materiaId);
    if (anoEscolar) params.append("anoEscolar", anoEscolar); 
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    const response = await api.get(url, {
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
  },
};