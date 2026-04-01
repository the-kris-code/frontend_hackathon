import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../api/authService";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <Container>
      <Logo onClick={() => navigate("/periodos")}>
        Chronos
      </Logo>

      <Hamburger onClick={() => setIsOpen(!isOpen)}>
        <Bar $isOpen={isOpen} />
        <Bar $isOpen={isOpen} />
        <Bar $isOpen={isOpen} />
      </Hamburger>

      <MenuWrapper $isOpen={isOpen}>
        <Menu>
          <Item onClick={() => handleNavigate("/periodos")}>Períodos</Item>
          <Item onClick={() => handleNavigate("/materias")}>Matérias</Item>
          <Item onClick={() => handleNavigate("/turmas")}>Turmas</Item>
          <Item onClick={() => handleNavigate("/aulas")}>Aulas</Item>
          <Item onClick={() => handleNavigate("/chat")}>Chronos</Item>
        </Menu>

        <Right>
          <LogoutButton onClick={handleLogout}>
            Sair
          </LogoutButton>
        </Right>
      </MenuWrapper>
    </Container>
  );
}

const Container = styled.div`
  height: 70px;
  background-color: #09071B;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  border-bottom: 1px solid #121826;
  font-family: 'Manrope', sans-serif;
  position: relative;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const Logo = styled.div`
  color: #00A7C4;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
  z-index: 100;
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 25px;
  height: 18px;
  cursor: pointer;
  z-index: 100;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Bar = styled.span`
  height: 3px;
  width: 100%;
  background-color: #00A7C4;
  border-radius: 3px;
  transition: all 0.3s ease;

  &:nth-child(1) {
    transform: ${({ $isOpen }) => ($isOpen ? "rotate(45deg) translateY(5px) translateX(5px)" : "none")};
  }
  &:nth-child(2) {
    opacity: ${({ $isOpen }) => ($isOpen ? "0" : "1")};
  }
  &:nth-child(3) {
    transform: ${({ $isOpen }) => ($isOpen ? "rotate(-45deg) translateY(-6px) translateX(5px)" : "none")};
  }
`;

const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
    position: absolute;
    top: 70px;
    left: ${({ $isOpen }) => ($isOpen ? "0" : "-100%")};
    width: 100%;
    height: calc(100vh - 70px);
    background-color: #09071B;
    transition: left 0.3s ease-in-out;
    padding-top: 40px;
    z-index: 99;
  }
`;

const Menu = styled.div`
  display: flex;
  gap: 30px;
  margin-left: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    margin-left: 0;
    gap: 25px;
    width: 100%;
  }
`;

const Item = styled.div`
  color: #ccc;
  cursor: pointer;
  transition: 0.2s;
  font-size: 16px;

  &:hover {
    color: #00A7C4;
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Right = styled.div`
  @media (max-width: 768px) {
    margin-top: 40px;
  }
`;

const LogoutButton = styled.button`
  background-color: transparent;
  border: 1px solid #d33;
  color: #d33;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background-color: #d33;
    color: #fff;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 10px 30px;
  }
`;