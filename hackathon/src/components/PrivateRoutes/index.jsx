import { Navigate } from "react-router-dom";
import { AuthService } from "../../api/authService";

export default function PrivateRoute({ children }) {
  const isAuth = AuthService.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  return children;
}