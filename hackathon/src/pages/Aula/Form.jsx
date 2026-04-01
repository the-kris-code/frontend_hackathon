import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Alert } from "../../components/SweetAlert";
import { useNavigate, useParams } from "react-router-dom";
import { AulaService } from "../../api/aulaService";
import { MateriaService } from "../../api/materiaService";
import { TurmaService } from "../../api/turmaService";
import { ChronosService } from "../../api/chronosService";

export default function AulaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id; 

  const [form, setForm] = useState({
    nome: "",
    objetivosAprendizagem: "",
    dataAula: "",
    isAtivo: true,
    turmaId: "",
    materiaId: "",
    codigoHabilidade: "",
  });

  const [materias, setMaterias] = useState([]);
  const [turmas, setTurmas] = useState([]); 
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchDependencias();
    if (isEdit) fetchAula();
  }, []);

  const fetchDependencias = async () => {
    try {
      const [mats, turms] = await Promise.all([
        MateriaService.getAll(),
        TurmaService.getAll()
      ]);
      setMaterias(mats);
      setTurmas(turms);
    } catch {
      Alert.error("Erro", "Erro ao carregar matérias ou turmas.");
    }
  };

  const fetchAula = async () => {
    try {
      const data = await AulaService.getById(id);
      const dataFormatada = data.dataAula ? new Date(data.dataAula).toISOString().split('T')[0] : "";
      setForm({ ...data, dataAula: dataFormatada, codigoHabilidade: "" });
    } catch {
      Alert.error("Erro", "Erro ao carregar aula.");
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.dataAula || !form.turmaId || !form.materiaId) {
      Alert.warning("Atenção", "Preencha os campos obrigatórios.");
      return;
    }

    const confirm = await Alert.confirm(
      isEdit ? "Salvar alterações?" : "Cadastrar aula?",
      "Deseja continuar?"
    );
    if (!confirm.isConfirmed) return;

    try {
      const { codigoHabilidade, ...dadosDaAula } = form;
      
      const dataToSend = {
        ...dadosDaAula,
        dataAula: new Date(form.dataAula).toISOString(), 
      };

      if (isEdit) {
        await AulaService.update(id, dataToSend);
      } else {
        await AulaService.create(dataToSend);
      }
      
      Alert.success("Sucesso!", "Operação realizada.");
      navigate("/aulas");
    } catch {
      Alert.error("Erro", "Erro ao salvar.");
    }
  };

  const handleGerarPlano = async () => {
    if (!isEdit) {
      Alert.warning("Atenção", "Você precisa CADASTRAR a aula primeiro. Preencha os dados, clique em Cadastrar, e depois volte para Editar e gerar o plano!");
      return;
    }

    
    if (!form.nome || !form.codigoHabilidade) {
      Alert.warning("Atenção", "Preencha o 'Nome' e o 'Código da Habilidade BNCC' para gerar o plano.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await ChronosService.gerarPlano(
        Number(id), 
        form.codigoHabilidade, 
        form.nome
      );
      
      Alert.success("Plano Gerado", "O plano de aula foi gerado com sucesso pelo Chronos!");
      
      if (response) {
        const planoCompleto = `OBJETIVO:\n${response.objetivo || ''}\n\nMETODOLOGIA:\n${response.metodologia || ''}\n\nRECURSOS:\n${response.recursosDidaticos || ''}\n\nAVALIAÇÃO:\n${response.avaliacao || ''}`;
        
        handleChange("objetivosAprendizagem", planoCompleto);
      }
    } catch (error) {
      console.error(error);
      Alert.error("Erro", "Falha ao gerar plano com IA. Verifique o console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async () => {
    const confirm = await Alert.confirm(
      "Excluir",
      "Deseja excluir a aula?"
    );

    if (confirm.isConfirmed) {
      await AulaService.delete(id);
      navigate("/aulas");
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/aulas")}>← Voltar</BackButton>
        <Title>{isEdit ? "Editar Aula" : "Nova Aula"}</Title>
      </Header>

      <Content>
        <Form onSubmit={handleSubmit}>
          
          <FormGroup>
            <Label>Nome da Aula *</Label>
            <Input 
              value={form.nome} 
              onChange={(e) => handleChange("nome", e.target.value)} 
              placeholder="Ex: Características dos materiais"
            />
          </FormGroup>

          <FormGroup>
            <Label>Código Habilidade BNCC (Para gerar IA)</Label>
            <Input 
              value={form.codigoHabilidade} 
              onChange={(e) => handleChange("codigoHabilidade", e.target.value)} 
              placeholder="Ex: EF01CI01"
            />
          </FormGroup>

          <FormGroup>
            <Label>Data da Aula *</Label>
            <Input 
              type="date" 
              value={form.dataAula} 
              onChange={(e) => handleChange("dataAula", e.target.value)} 
            />
          </FormGroup>

          <FormGroup>
            <Label>Turma *</Label>
            <Select value={form.turmaId} onChange={(e) => handleChange("turmaId", Number(e.target.value))}>
              <option value="">Selecione a turma...</option>
              {turmas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Matéria *</Label>
            <Select value={form.materiaId} onChange={(e) => handleChange("materiaId", Number(e.target.value))}>
              <option value="">Selecione a matéria...</option>
              {materias.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Objetivos de Aprendizagem / Plano de Aula</Label>
            <TextArea 
              rows="10" 
              value={form.objetivosAprendizagem} 
              onChange={(e) => handleChange("objetivosAprendizagem", e.target.value)} 
              placeholder="Digite os objetivos ou use a IA para gerar o plano completo..."
            />
            
            <GeneratePlanoButton type="button" onClick={handleGerarPlano} disabled={isGenerating}>
              {isGenerating ? "Chronos está gerando o plano..." : "Gerar Plano de Aula com IA"}
            </GeneratePlanoButton>
          </FormGroup>

          <CheckboxRow>
            <input 
              type="checkbox" 
              checked={form.isAtivo} 
              onChange={(e) => handleChange("isAtivo", e.target.checked)} 
            />
            <span>Ativo</span>
          </CheckboxRow>

          <ButtonRow>
            <CancelButton type="button" onClick={() => navigate("/aulas")}>Cancelar</CancelButton>
            <DeleteButton type="button" onClick={handleDelete}>
              Excluir
            </DeleteButton>
            <SaveButton type="submit">{isEdit ? "Salvar Alterações" : "Cadastrar Aula"}</SaveButton>
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
  max-width: 600px;
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
  background-color: #fff;
  box-sizing: border-box;
  width: 100%;
`;

const Select = styled.select`
  padding: 12px;
  border-radius: 8px;
  border: none;
  outline: none;
  background-color: #fff;
  box-sizing: border-box;
  width: 100%;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border-radius: 8px;
  border: none;
  outline: none;
  resize: vertical;
  background-color: #fff;
  font-family: 'Manrope', sans-serif;
  line-height: 1.5;
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
  margin-top: 10px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 15px;
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

const GeneratePlanoButton = styled.button`
  background-color: #4B3A71;
  color: #fff;
  border: none;
  padding: 12px;
  margin-top: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.2s;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    opacity: 0.9;
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