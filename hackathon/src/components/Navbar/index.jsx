import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../api/authService";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  return (
    <Container>
      <Logo onClick={() => navigate("/periodos")}>
        School Manager
      </Logo>

      <Menu>
        <Item onClick={() => navigate("/periodos")}>Períodos</Item>
        <Item onClick={() => navigate("/materias")}>Matérias</Item>
        <Item onClick={() => navigate("/turmas")}>Turmas</Item>
        <Item onClick={() => navigate("/chat")}>Chat</Item>
      </Menu>

      <Right>
        <LogoutButton onClick={handleLogout}>
          Sair
        </LogoutButton>
      </Right>
    </Container>
  );
}

/* ===== STYLE ===== */

const Container = styled.div`
  height: 70px;
  background-color: #09071B;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  border-bottom: 1px solid #121826;
  font-family: 'Manrope', sans-serif;
`;

const Logo = styled.div`
  color: #00A7C4;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
`;

const Menu = styled.div`
  display: flex;
  gap: 30px;
`;

const Item = styled.div`
  color: #ccc;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    color: #00A7C4;
  }
`;

const Right = styled.div``;

const LogoutButton = styled.button`
  background-color: transparent;
  border: 1px solid #00A7C4;
  color: #00A7C4;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #00A7C4;
    color: #fff;
  }
`;