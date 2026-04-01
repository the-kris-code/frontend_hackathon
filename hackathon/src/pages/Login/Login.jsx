import React, { useState } from 'react';
import styled from 'styled-components';
import bgImage from '../../assets/background.png';
import { AuthService } from '../../api/authService';
import { Alert } from '../../components/SweetAlert';
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    senha: ""
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.senha) {
      Alert.warning("Atenção", "Preencha todos os campos");
      return;
    }

    Swal.fire({
      title: 'Entrando...',
      text: 'Autenticando seus dados, aguarde.',
      background: '#121826',
      color: '#ffffff',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(); 
      }
    });

    try {
      const response = await AuthService.login(form);
      const token = response; 
      AuthService.setToken(token);

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Login realizado com sucesso!',
        background: '#121826',
        color: '#ffffff',
        showConfirmButton: false,
        timer: 1500, 
        timerProgressBar: true
      }).then(() => {
        navigate("/chat");
      });

    } catch (error) {
      Alert.error("Erro", "Credenciais inválidas");
    }
  };

  return (
    <Container>
      <LoginCard onSubmit={handleLogin}>
        <Title>Login</Title>

        <InputWrapper $isEmail>
          <Input
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </InputWrapper>

        <InputWrapper>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
          />

          <EyeButton
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </EyeButton>
        </InputWrapper>

        <Button type="submit">Entrar</Button>

        <TextCadastro onClick={() => navigate("/cadastro")}>
          Não possui conta? Cadastre-se
        </TextCadastro>
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
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%; 
  max-width: 400px; 

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const Title = styled.h1`
  color: #ffffff;
  font-family: 'Manrope', sans-serif;
  font-size: 26px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 30px;

  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px; 

  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
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
  padding: 14px 0; 
  margin-top: 10px;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  width: 100%; 
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #008fa8; 
  }
`;

const EyeButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px; 
  
  &:hover {
    color: #333;
  }
`;

const TextCadastro = styled.span`
  color: #ffffff;
  font-family: 'Manrope', sans-serif;
  font-size: 15px;
  margin-top: 25px;
  cursor: pointer;
  text-align: center;
  
  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;