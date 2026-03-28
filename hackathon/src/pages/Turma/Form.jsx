import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Alert } from "../../components/SweetAlert";
import { useNavigate, useParams } from "react-router-dom";
import { TurmaService } from "../../api/turmaService";
import { PeriodoService } from "../../api/periodoService";

export default function TurmaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    nome: "",
    anoEscolar: "",
    anoLetivo: "",
    isAtivo: true,
    periodoId: "",
  });

  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    fetchPeriodos();

    if (isEdit) {
      fetchTurma();
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

  const fetchTurma = async () => {
    try {
      const data = await TurmaService.getById(id);
      setForm(data);
    } catch {
      Alert.error("Erro", "Erro ao carregar turma.");
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

    if (!form.nome || !form.anoEscolar || !form.anoLetivo || !form.periodoId) {
      Alert.warning("Atenção", "Preencha todos os campos.");
      return;
    }

    const confirm = await Alert.confirm(
      isEdit ? "Salvar alterações?" : "Cadastrar turma?",
      "Deseja continuar?"
    );

    if (!confirm.isConfirmed) return;

    try {
      if (isEdit) {
        await TurmaService.update(id, form);
      } else {
        await TurmaService.create(form);
      }

      Alert.success("Sucesso!", "Operação realizada.");
      navigate("/turmas");
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
      navigate("/turmas");
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/turmas")}>
          ← Voltar
        </BackButton>
        <Title>{isEdit ? "Editar Turma" : "Nova Turma"}</Title>
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
            <Label>Ano Escolar</Label>
            <Input
              type="number"
              value={form.anoEscolar}
              onChange={(e) =>
                handleChange("anoEscolar", Number(e.target.value))
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>Ano Letivo</Label>
            <Input
              type="number"
              value={form.anoLetivo}
              onChange={(e) =>
                handleChange("anoLetivo", Number(e.target.value))
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
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #00A7C4;
  font-size: 16px;
  cursor: pointer;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 22px;
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
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
`;

const Select = styled.select`
  padding: 12px;
  border-radius: 8px;
  border: none;
  outline: none;
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
`;

const SaveButton = styled.button`
  background-color: #00A7C4;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: #333;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
`;