import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Alert } from "../../components/SweetAlert";
import { useNavigate } from "react-router-dom";
import { ProfessorService } from "../../api/professorService";

export default function Perfil() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    try {
      const data = await ProfessorService.getPerfil();
      setPerfil(data);
    } catch (error) {
      console.error(error);
      Alert.error("Erro", "Não foi possível carregar os dados do perfil.");
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (isoString) => {
    if (!isoString) return "-";
    const data = new Date(isoString);
    data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
    return data.toLocaleDateString("pt-BR");
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return "-";
    if (telefone.length === 11) {
      return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7, 11)}`;
    }
    return telefone;
  };

  if (loading) {
    return (
      <Container>
        <LoadingText>Carregando seu perfil...</LoadingText>
      </Container>
    );
  }

  if (!perfil) {
    return (
      <Container>
        <LoadingText>Nenhum dado encontrado.</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>← Voltar</BackButton>
        <Title>Meu Perfil</Title>
      </Header>

      <Content>
        <ProfileCard>
          <AvatarSection>
            <Avatar>
              {perfil.nomeCompleto ? perfil.nomeCompleto.charAt(0).toUpperCase() : "P"}
            </Avatar>
            <Name>{perfil.nomeCompleto}</Name>
            <Role>{perfil.especialidade || "Professor"}</Role>
          </AvatarSection>

          <Divider />

          <InfoGrid>
            <InfoItem>
              <Label>E-mail</Label>
              <Value>{perfil.email}</Value>
            </InfoItem>

            <InfoItem>
              <Label>Telefone</Label>
              <Value>{formatarTelefone(perfil.telefone)}</Value>
            </InfoItem>

            <InfoItem>
              <Label>Formação</Label>
              <Value>{perfil.formacao || "-"}</Value>
            </InfoItem>

            <InfoItem>
              <Label>Especialidade</Label>
              <Value>{perfil.especialidade || "-"}</Value>
            </InfoItem>

            <InfoItem>
              <Label>Data de Nascimento</Label>
              <Value>
                {formatarData(perfil.dataNascimento)} 
                {perfil.idade && <AgeTag>{perfil.idade} anos</AgeTag>}
              </Value>
            </InfoItem>

            <InfoItem>
              <Label>Membro desde</Label>
              <Value>{formatarData(perfil.dataCadastro)}</Value>
            </InfoItem>

            <InfoItem>
              <Label>Status da Conta</Label>
              <StatusBadge $ativo={perfil.isAtivo}>
                {perfil.isAtivo ? "Ativa" : "Inativa"}
              </StatusBadge>
            </InfoItem>
          </InfoGrid>
        </ProfileCard>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  background-color: #0b0c16;
  font-family: 'Manrope', sans-serif;
  color: #fff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 30px 40px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #00A7C4;
  font-size: 16px;
  cursor: pointer;
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  &:hover { text-decoration: underline; }
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const LoadingText = styled.div`
  padding: 50px;
  text-align: center;
  color: #aaa;
  font-size: 18px;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const ProfileCard = styled.div`
  background-color: #121826;
  width: 100%;
  max-width: 600px;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.4);
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #00A7C4, #4B3A71);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 15px;
  box-shadow: 0px 4px 10px rgba(0, 167, 196, 0.3);
`;

const Name = styled.h2`
  margin: 0;
  font-size: 22px;
  color: #fff;
`;

const Role = styled.span`
  margin-top: 5px;
  color: #00A7C4;
  font-size: 14px;
  font-weight: 600;
`;

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 0 30px 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  color: #888;
  font-size: 13px;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.div`
  color: #e0e0e0;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AgeTag = styled.span`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #bbb;
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background-color: ${(p) => (p.$ativo ? "rgba(54, 117, 60, 0.2)" : "rgba(200, 50, 50, 0.2)")};
  color: ${(p) => (p.$ativo ? "#4caf50" : "#ff5252")};
  border: 1px solid ${(p) => (p.$ativo ? "#4caf50" : "#ff5252")};
  width: fit-content;
`;