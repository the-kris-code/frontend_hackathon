import React, { useState } from 'react';
import styled from 'styled-components';
import bgImage from '../../assets/background.png';
import { useNavigate } from 'react-router-dom';
import { ProfessorService } from '../../api/professorService';
import { Alert } from '../../components/SweetAlert'; 

export default function Cadastro() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    telefone: '',
    formacao: '',
    especialidade: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (!formData.nomeCompleto || !formData.dataNascimento || !formData.telefone || !formData.formacao) {
      Alert.warning("Atenção", "Preencha todos os campos antes de avançar.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      Alert.warning("Atenção", "As senhas não coincidem!");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        nomeCompleto: formData.nomeCompleto,
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone,
        dataNascimento: new Date(formData.dataNascimento).toISOString(),
        formacao: formData.formacao,
        especialidade: formData.especialidade,
        isAtivo: true 
      };

      await ProfessorService.cadastrar(dataToSend);
      
      Alert.success("Sucesso!", "Cadastro realizado com sucesso. Faça seu login!");
      navigate("/"); 
      
    } catch (error) {
      console.error("Erro no cadastro:", error);
      Alert.error("Erro", "Falha ao realizar o cadastro. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <CadastroCard onSubmit={handleSubmit}>
        <Title>Cadastro</Title>

        {step === 1 && (
          <>
            <Input 
              type="text" 
              name="nomeCompleto"
              placeholder="Nome Completo" 
              value={formData.nomeCompleto}
              onChange={handleChange}
              required 
            />
            <Input 
              type="date" 
              name="dataNascimento"
              placeholder="Data de nascimento" 
              value={formData.dataNascimento}
              onChange={handleChange}
              required 
            />
            <Input 
              type="tel" 
              name="telefone"
              placeholder="Telefone (Apenas números)" 
              value={formData.telefone}
              onChange={handleChange}
              required 
            />
            <Input 
              type="text" 
              name="formacao"
              placeholder="Formação (Ex: Pedagogia)" 
              value={formData.formacao}
              onChange={handleChange}
              required 
            />
            
            <Button type="button" onClick={handleNextStep}>
              Próximo
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Input 
              type="text" 
              name="especialidade"
              placeholder="Especialidade (Ex: Matemática)" 
              value={formData.especialidade}
              onChange={handleChange}
              required 
            />
            <Input 
              type="email" 
              name="email"
              placeholder="E-mail" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <Input 
              type="password" 
              name="senha"
              placeholder="Senha" 
              value={formData.senha}
              onChange={handleChange}
              required 
            />
            <Input 
              type="password" 
              name="confirmarSenha"
              placeholder="Confirme sua senha" 
              value={formData.confirmarSenha}
              onChange={handleChange}
              required 
            />
            
            <ButtonsRow>
              <Button type="button" onClick={() => setStep(1)} disabled={loading}>
                Voltar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Aguarde..." : "Cadastrar"}
              </Button>
            </ButtonsRow>
          </>
        )}
        <TextLogin onClick={() => navigate("/")}>Já possui conta? Faça login</TextLogin>
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
  background-color: ${(p) => p.disabled ? '#555' : '#00A7C4'}; 
  color: #ffffff;
  padding: 12px 0;
  margin-top: 10px;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 500;
  cursor: ${(p) => p.disabled ? 'not-allowed' : 'pointer'};
  width: 60%; 
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${(p) => p.disabled ? '#555' : '#008fa8'}; 
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

const TextLogin = styled.span`
  color: #ffffff;
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  margin-top: 25px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;