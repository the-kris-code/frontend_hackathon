import React from 'react';
import styled from 'styled-components';
import bgImage from '../../assets/background.png';

export default function Login() {
  
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Tentativa de login enviada!");
  };

  return (
    <Container>
      <LoginCard onSubmit={handleLogin}>
        <Title>Login</Title>
        
        <Input type="email" placeholder="E-mail" required />
        <Input type="password" placeholder="Senha" required />
        
        <Button type="submit">Entrar</Button>
      </LoginCard>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #070813; 
  
  position: relative; 
  z-index: 1; 

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${bgImage}); 
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat; 
    opacity: 0.2; 
    z-index: -1; 
  }
`;

const LoginCard = styled.form`
  background-color: #09071B; 
  padding: 50px 40px;
  border-radius: 8px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 320px;
`;

const Title = styled.h1`
  color: #ffffff;
  font-family: 'Manrope', sans-serif;
  font-size: 26px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 30px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  margin-bottom: 20px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  background-color: #ffffff;
  box-sizing: border-box; 
  
  &:focus {
    outline: 2px solid #00A7C4;
  }
`;

const Button = styled.button`
  background-color: #00A7C4; 
  color: #ffffff;
  padding: 12px 0;
  margin-top: 10px;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  width: 60%; 
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #0096B0; 
  }
`;