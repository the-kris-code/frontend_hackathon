import api from "./api";
import { AuthService } from "./authService";

export const ProfessorService = {
  async cadastrar(data) {
    const response = await api.post("/professor/cadastro", data);
    return response.data;
  },
  
  async getPerfil() {
    const token = AuthService.getToken();
    const response = await api.get("/professor", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};