import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Alert } from "../../components/SweetAlert";
import { useNavigate, useParams } from "react-router-dom";
import { MateriaService } from "../../api/materiaService";
import { PeriodoService } from "../../api/periodoService";

export default function MateriaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    nome: "",
    areaConhecimento: "",
    isAtivo: true,
    periodoId: "",
  });

  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    fetchPeriodos();

    if (isEdit) {
      fetchMateria();
    }
  }, []);

  const fetchPeriodos = async () => {
    try {
      const data = await PeriodoService.getAll();
      setPeriodos(data);
    } catch {
      Alert.error("Erro", "Erro ao carregar períodos.");
    }
  };

  const fetchMateria = async () => {
    try {
      const data = await MateriaService.getById(id);
      setForm(data);
    } catch {
      Alert.error("Erro", "Erro ao carregar matéria.");
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

    if (!form.nome || !form.areaConhecimento || !form.periodoId) {
      Alert.warning("Atenção", "Preencha todos os campos.");
      return;
    }

    const confirm = await Alert.confirm(
      isEdit ? "Salvar alterações?" : "Cadastrar matéria?",
      "Deseja continuar?"
    );

    if (!confirm.isConfirmed) return;

    try {
      if (isEdit) {
        await MateriaService.update(id, form);
      } else {
        await MateriaService.create(form);
      }

      Alert.success("Sucesso!", "Operação realizada.");
      navigate("/materias");
    } catch {
      Alert.error("Erro", "Erro ao salvar.");
    }
  };

  const handleCancel = async () => {
    const confirm = await Alert.confirm(
      "Cancelar",
      "Deseja descartar as alterações?"
    );

    if (confirm.isConfirmed) {
      navigate("/materias");
    }
  };

  const handleDelete = async () => {
    const confirm = await Alert.confirm(
      "Desabilitar",
      "Deseja desabilitar o periodo?"
    );

    if (confirm.isConfirmed) {
      await MateriaService.delete(id);
      navigate("/materias");
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/materias")}>
          ← Voltar
        </BackButton>
        <Title>{isEdit ? "Editar Matéria" : "Nova Matéria"}</Title>
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

          <FormGroup>
            <Label>Área do Conhecimento</Label>
            <Input
              value={form.areaConhecimento}
              onChange={(e) =>
                handleChange("areaConhecimento", e.target.value)
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Período</Label>
            <Select
              value={form.periodoId}
              onChange={(e) =>
                handleChange("periodoId", Number(e.target.value))
              }
            >
              <option value="">Selecione</option>
              {periodos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </Select>
          </FormGroup>

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
            <SaveButton type="submit">
              {isEdit ? "Salvar" : "Cadastrar"}
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

const Select = styled.select`
  padding: 12px;
  border-radius: 8px;
  border: none;
  outline: none;
  box-sizing: border-box;
  width: 100%;
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
  cursor: pointer;
  font-weight: 600;

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