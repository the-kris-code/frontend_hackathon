import api from "./api";

export const AuthService = {
  async login(data) {
    const response = await api.post("/login", data);
    return response.data;
  },

  setToken(token) {
    localStorage.setItem("token", token);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  logout() {
    localStorage.removeItem("token");
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }
};