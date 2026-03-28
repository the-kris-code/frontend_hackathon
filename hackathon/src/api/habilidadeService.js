import api from "./api";
import { AuthService } from "./authService";

export const HabilidadeService = {
  async getHabilidades(materia, ano) {
    const token = AuthService.getToken();
    
    const response = await api.get("/habilidades", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        materia: materia || undefined, 
        ano: ano || undefined
      }
    });
    
    return response.data; 
  }
};