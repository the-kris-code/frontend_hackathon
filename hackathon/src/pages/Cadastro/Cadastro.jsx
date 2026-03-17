import React, { useState } from 'react';
import styled from 'styled-components';
import bgImage from '../../assets/background.png';

export default function Cadastro() {
  const [step, setStep] = useState(1);


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cadastro realizado com sucesso!");
    
  };

  return (
    <Container>
      <CadastroCard onSubmit={handleSubmit}>
        <Title>Cadastro</Title>

        {step === 1 && (
          <>
            <Input type="text" placeholder="Nome" required />
            <Input type="date" placeholder="Data de nascimento" required />
            <Input type="tel" placeholder="Telefone" required />
            <Input type="text" placeholder="Formação" required />
            
            <Button type="button" onClick={() => setStep(2)}>
              Próximo
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Input type="text" placeholder="Especialidade" required />
            <Input type="email" placeholder="E-mail" required />
            <Input type="password" placeholder="Senha" required />
            <Input type="password" placeholder="Confirme sua senha" required />
            
            <ButtonsRow>
              <Button type="button" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button type="submit">
                Cadastrar
              </Button>
            </ButtonsRow>
          </>
        )}
      </CadastroCard>
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

const CadastroCard = styled.form`
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
  font-family: Arial, sans-serif;
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
    background-color: #008fa8; 
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  justify-content: space-between;
  button {
    width: 100%; 
  }
`;