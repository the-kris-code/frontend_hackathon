import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Alert } from "../../components/SweetAlert";
import { useNavigate, useParams } from "react-router-dom";
import { PeriodoService } from "../../api/periodoService";

export default function PeriodoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    nome: "",
    horarioInicio: "",
    horarioFim: "",
    isAtivo: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchPeriodo();
    }
  }, [id]);

  const fetchPeriodo = async () => {
    try {
      setLoading(true);
      const data = await PeriodoService.getById(id);
      setForm(data);
    } catch (err) {
      Alert.error("Erro", "Erro ao carregar período.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nome || !form.horarioInicio || !form.horarioFim) {
      Alert.warning("Atenção", "Preencha todos os campos.");
      return;
    }

    if (form.horarioInicio >= form.horarioFim) {
      Alert.error("Erro", "Horário inicial deve ser menor que o final.");
      return;
    }

    const confirm = await Alert.confirm(
      isEdit ? "Salvar alterações?" : "Cadastrar período?",
      "Deseja continuar?"
    );

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      if (isEdit) {
        await PeriodoService.update(id, form);
      } else {
        await PeriodoService.create(form);
      }

      Alert.success(
        "Sucesso!",
        isEdit ? "Período atualizado." : "Período cadastrado."
      );

      navigate("/periodos");
    } catch (err) {
      Alert.error("Erro", "Erro ao salvar período.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirm = await Alert.confirm(
      "Cancelar",
      "Deseja descartar as alterações?"
    );

    if (confirm.isConfirmed) {
      navigate("/periodos");
    }
  };

  const handleDelete = async () => {
    const confirm = await Alert.confirm(
      "Desabilitar",
      "Deseja Desabilitar o periodo?"
    );

    if (confirm.isConfirmed) {
      await PeriodoService.delete(id);
      navigate("/periodos");
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/periodos")}>
          ← Voltar
        </BackButton>
        <Title>{isEdit ? "Editar Período" : "Novo Período"}</Title>
      </Header>

      <Content>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nome</Label>
            <Input
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
          </FormGroup>

          <Row>
            <FormGroup style={{ flex: 1 }}>
              <Label>Horário Início</Label>
              <Input
                type="time"
                value={form.horarioInicio}
                onChange={(e) =>
                  handleChange("horarioInicio", e.target.value)
                }
              />
            </FormGroup>

            <FormGroup style={{ flex: 1 }}>
              <Label>Horário Fim</Label>
              <Input
                type="time"
                value={form.horarioFim}
                onChange={(e) =>
                  handleChange("horarioFim", e.target.value)
                }
              />
            </FormGroup>
          </Row>

          <CheckboxRow>
            <input
              type="checkbox"
              checked={form.isAtivo}
              onChange={(e) =>
                handleChange("isAtivo", e.target.checked)
              }
            />
            <span>Ativo</span>
          </CheckboxRow>

          <ButtonRow>
            <CancelButton type="button" onClick={handleCancel}>
              Cancelar
            </CancelButton>
            <DeleteButton type="button" onClick={handleDelete}>
              Desabilitar
            </DeleteButton>
            <SaveButton type="submit" disabled={loading}>
              {loading ? "Salvando..." : isEdit ? "Salvar" : "Cadastrar"}
            </SaveButton>
          </ButtonRow>
        </Form>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  background-color: #0b0c16;
  font-family: 'Manrope', sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 30px 40px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 10px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #00A7C4;
  font-size: 16px;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  color: #fff;
  font-size: 22px;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const Form = styled.form`
  background-color: #121826;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 480px) {
    padding: 25px 20px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #aaa;
  margin-bottom: 6px;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: none;
  outline: none;
  box-sizing: border-box;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 15px;
    margin-top: 10px;
  }
`;

const SaveButton = styled.button`
  background-color: #00A7C4;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  font-weight: 600;
  opacity: ${(p) => (p.disabled ? 0.7 : 1)};

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CancelButton = styled.button`
  background-color: #333;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const DeleteButton = styled.button`
  background-color: #d33;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;

  @media (max-width: 480px) {
    width: 100%;
  }
`;