import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { ChronosService } from '../../api/chronosService'; 
import { AulaService } from '../../api/aulaService'; 
import { HabilidadeService } from '../../api/habilidadeService';
import html2pdf from 'html2pdf.js';

const OPCOES_FILTRO = {
  anos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 67, 89, 345, 6789, 12345],
  materias: [
    { id: 7, nome: "Arte" },
    { id: 4, nome: "Biologia" },
    { id: 10, nome: "Ciências" },
    { id: 16, nome: "Ciências da Natureza e suas Tecnologias" },
    { id: 17, nome: "Ciências Humanas e Sociais Aplicadas" },
    { id: 13, nome: "Computação" },
    { id: 18, nome: "Computação Ensino Médio" },
    { id: 8, nome: "Educação Física" },
    { id: 5, nome: "educacao_infantil" },
    { id: 12, nome: "Ensino Religioso" },
    { id: 11, nome: "Geografia" },
    { id: 3, nome: "História" },
    { id: 14, nome: "Linguagens e suas Tecnologias" },
    { id: 9, nome: "Língua Inglesa" },
    { id: 6, nome: "Língua Portuguesa" },
    { id: 1, nome: "Matemática" },
    { id: 15, nome: "Matemática e suas Tecnologias" },
    { id: 2, nome: "Português" }
  ]
};

export default function ChatPage() {
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState("chat"); 
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [selectedAula, setSelectedAula] = useState("");
  const [activeChatId, setActiveChatId] = useState(null); 
  
  const [chatHistory, setChatHistory] = useState([]);
  const [aulas, setAulas] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [filtroMateria, setFiltroMateria] = useState("");
  const [filtroAno, setFiltroAno] = useState("");
  const [habilidades, setHabilidades] = useState([]);
  
  const [selectedHabilidade, setSelectedHabilidade] = useState("");
  const [temaAtividade, setTemaAtividade] = useState("");

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        const data = await AulaService.getAulas();
        setAulas(data);
      } catch (error) {
        console.error("Erro ao buscar as aulas:", error);
      }
    };
    fetchAulas();
  }, []);

  useEffect(() => {
    if (showModal) {
      const fetchHabilidades = async () => {
        try {
          const data = await HabilidadeService.getHabilidades();
          
          let arraySeguro = [];
          if (Array.isArray(data)) arraySeguro = data;
          else if (data && Array.isArray(data.data)) arraySeguro = data.data;
          else if (data && Array.isArray(data.items)) arraySeguro = data.items;
          else if (data && Array.isArray(data.content)) arraySeguro = data.content;
          else if (data && Array.isArray(data.habilidades)) arraySeguro = data.habilidades;

          setHabilidades(arraySeguro);
        } catch (error) {
          console.error("Erro ao buscar habilidades:", error);
          setHabilidades([]);
        }
      };
      
      fetchHabilidades();
    }
  }, [showModal]); 

  const habilidadesFiltradas = habilidades.filter(hab => {
    let passaFiltroMateria = true;
    let passaFiltroAno = true;

    if (filtroMateria) {
      const nomeMateria = hab.objetoConhecimento?.unidadeTematica?.materia?.nome;
      passaFiltroMateria = nomeMateria === filtroMateria;
    }

    if (filtroAno) {
      passaFiltroAno = String(hab.anoEscolar) === filtroAno;
    }

    return passaFiltroMateria && passaFiltroAno;
  });

  const getLastAiMessageText = () => {
    return [...messages].reverse().find(m => m.sender === "ai")?.text || "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (messages.length === 0 && !selectedAula) {
      alert("Por favor, selecione uma aula antes de iniciar o chat!");
      return;
    }

    const userText = inputText;
    const newUserMsg = { id: Date.now(), text: userText, sender: "user" };
    
    let currentChatId = activeChatId;

    if (!currentChatId) {
      currentChatId = Date.now().toString();
      const shortTitle = userText.length > 25 ? userText.substring(0, 30) + '...' : userText;

      const newChat = { id: currentChatId, title: shortTitle, aulaId: selectedAula, messages: [newUserMsg] };
      setChatHistory((prev) => [newChat, ...prev]);
      setActiveChatId(currentChatId);
    } else {
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId ? { ...chat, messages: [...chat.messages, newUserMsg] } : chat
      ));
    }

    setMessages((prev) => [...prev, newUserMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const data = await ChronosService.conversar(Number(selectedAula), userText);
      const aiResponse = {
        id: Date.now(),
        text: data.resposta || data.data?.resposta || data.mensagem || "Resposta recebida, mas em formato inesperado.",
        sender: "ai",
        hasSaveButton: true
      };

      setMessages((prev) => [...prev, aiResponse]);
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId ? { ...chat, messages: [...chat.messages, aiResponse] } : chat
      ));
    } catch (error) {
      console.error("Erro ao chamar a API:", error);
      const errorText = error.response?.status === 401 ? "Sua sessão expirou." : "Erro de conexão.";
      const errorMsg = { id: Date.now(), text: errorText, sender: "ai" };
      setMessages((prev) => [...prev, errorMsg]);
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId ? { ...chat, messages: [...chat.messages, errorMsg] } : chat
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleGerarAtividade = async (e) => {
    e.preventDefault();
    if (!selectedAula) {
      alert("Por favor, selecione uma aula no chat principal primeiro.");
      setShowModal(false);
      return;
    }
    if (!selectedHabilidade || !temaAtividade.trim()) {
      alert("A habilidade e o tema são obrigatórios!");
      return;
    }

    setShowModal(false); 
    setIsTyping(true); 

    const comandoVisual = `Gerar atividade sobre: **${temaAtividade}** (Habilidade: ${selectedHabilidade})`;
    const newUserMsg = { id: Date.now(), text: comandoVisual, sender: "user" };

    let currentChatId = activeChatId;

    if (!currentChatId) {
      currentChatId = Date.now().toString();
      const shortTitle = temaAtividade.length > 25 ? temaAtividade.substring(0, 25) + '...' : temaAtividade;

      const newChat = { id: currentChatId, title: shortTitle, aulaId: selectedAula, messages: [newUserMsg] };
      setChatHistory((prev) => [newChat, ...prev]);
      setActiveChatId(currentChatId);
    } else {
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId ? { ...chat, messages: [...chat.messages, newUserMsg] } : chat
      ));
    }

    setMessages((prev) => [...prev, newUserMsg]);

    try {
      const data = await ChronosService.gerarAtividade(
        Number(selectedAula), 
        selectedHabilidade, 
        temaAtividade
      );

      let conteudoAtividade = "Atividade gerada com sucesso!";

      if (data) {
        if (data.titulo && data.descricao) {
          let markdown = `# 📝 ${data.titulo}\n\n`;
          if (data.tipo) markdown += `**Tema:** ${data.tipo}\n\n---\n\n`;

          try {
            const descObj = JSON.parse(data.descricao);
            
            if (descObj.instrucoes) {
              markdown += `### Instruções\n${descObj.instrucoes}\n\n`;
            }

            if (descObj.exercicios && Array.isArray(descObj.exercicios)) {
              markdown += `### Exercícios\n\n`;
              descObj.exercicios.forEach((ex, index) => {
                markdown += `**${index + 1}. [${ex.tipo}]**\n${ex.enunciado}\n\n`;
                markdown += `> **Resposta Esperada:**\n> ${ex.respostaEsperada.replace(/\n/g, '\n> ')}\n\n`;
              });
            }
            conteudoAtividade = markdown;

          } catch (e) {
            console.error("Erro ao fazer parse da descrição:", e);
            conteudoAtividade = markdown + data.descricao;
          }
        } 
        else if (data.atividade) {
          conteudoAtividade = typeof data.atividade === 'string' 
            ? data.atividade 
            : "```json\n" + JSON.stringify(data.atividade, null, 2) + "\n```";
        } else if (data.resposta) {
          conteudoAtividade = data.resposta;
        } else if (typeof data === 'string') {
          conteudoAtividade = data;
        }
      }

      const aiResponse = {
        id: Date.now() + 1, 
        text: conteudoAtividade,
        sender: "ai",
        hasSaveButton: true
      };

      setMessages((prev) => [...prev, aiResponse]);
      
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId ? { ...chat, messages: [...chat.messages, aiResponse] } : chat
      ));

    } catch (error) {
      console.error("Erro ao gerar atividade:", error);
      const errorMsg = { id: Date.now() + 1, text: "Erro ao gerar a atividade.", sender: "ai" };
      setMessages((prev) => [...prev, errorMsg]);
      
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId ? { ...chat, messages: [...chat.messages, errorMsg] } : chat
      ));
    } finally {
      setIsTyping(false);
      setTemaAtividade("");
      setSelectedHabilidade("");
    }
  }

  const handleCopy = () => {
    const lastAiText = getLastAiMessageText();
    if (lastAiText) {
      navigator.clipboard.writeText(lastAiText);
      alert("Texto copiado");
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-content');
    
    if (!element) {
      alert("Conteúdo não encontrado para gerar o PDF.");
      return;
    }

    const opt = {
      margin:       15, 
      filename:     `Atividade_Chronos_${Date.now()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 }, 
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const loadChatFromHistory = (chat) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages || []);
    setSelectedAula(chat.aulaId || "");
    setMode("chat");
  };

  return (
    <Container>
      <Sidebar>
        <NavButtons>
          <NewChatButton onClick={() => {
            setActiveChatId(null);
            setMessages([]);
            setSelectedAula(""); 
            setMode("chat");
          }}>
            Novo chat <span>+</span>
          </NewChatButton>

          <GenerateButton onClick={() => setShowModal(true)}>
            Gerar Atividade <span>+</span>
          </GenerateButton>
          
          <Divider />

          {chatHistory.map((chat) => (
            <HistoryButton 
              key={chat.id} 
              title={chat.title}
              onClick={() => loadChatFromHistory(chat)}
              $isActive={activeChatId === chat.id} 
            >
              {chat.title}
            </HistoryButton>
          ))}
        </NavButtons>

        <ProfileButton>
          <ProfileIcon>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </ProfileIcon>
        </ProfileButton>
      </Sidebar>

      <MainArea>
        <ChatContent>
          {mode === "chat" ? (
            messages.length === 0 ? (
              <EmptyState>Selecione uma aula e comece o chat</EmptyState>
            ) : (
              <MessageList>
                {messages.map((msg) => (
                  <MessageRow key={msg.id} $isUser={msg.sender === "user"}>
                    <MessageBubble $isUser={msg.sender === "user"}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                      
                      {msg.hasSaveButton && (
                        <SaveButtonRow>
                          <SaveButton onClick={() => setMode("result")}>
                            Mais...
                          </SaveButton>
                        </SaveButtonRow>
                      )}
                    </MessageBubble>
                  </MessageRow>
                ))}

                {isTyping && (
                  <MessageRow>
                    <MessageBubble>
                      <p style={{ opacity: 0.6 }}>O Agente Chronos está processando...</p>
                    </MessageBubble>
                  </MessageRow>
                )}
              </MessageList>
            )
          ) : (
            <>
              <MessageList>
                <MessageRow>
                  <MessageBubble id="pdf-content">
                    <ReactMarkdown>{getLastAiMessageText()}</ReactMarkdown>
                  </MessageBubble>
                </MessageRow>
              </MessageList>
              
              <ResultButtons>
                <ResultButton onClick={handleCopy}>Copiar</ResultButton>
                
                <ResultButton onClick={handleDownloadPDF}>PDF</ResultButton>
                
              </ResultButtons>
              <ResultButtons>
                <ResultButton onClick={() => setMode("chat")}>Voltar</ResultButton>
              </ResultButtons>
            </>
          )}
        </ChatContent>

        {mode === "chat" && (
          <InputContainer onSubmit={handleSendMessage}>
            <InputWrapper>
              <AulaSelect 
                value={selectedAula} 
                onChange={(e) => setSelectedAula(e.target.value)}
                disabled={messages.length > 0}
              >
                <option value="" disabled>Selecione a aula...</option>
                {aulas.map(aula => (
                  <option key={aula.id} value={aula.id}>{aula.nome}</option>
                ))}
              </AulaSelect>

              <TextInput
                placeholder="Digite sua mensagem..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <SendButton type="submit" disabled={isTyping}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </SendButton>
            </InputWrapper>
          </InputContainer>
        )}
      </MainArea>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Gerar Nova Atividade</ModalTitle>
            
            <FormGroup>
              <Label>Matéria (Opcional)</Label>
              <Select value={filtroMateria} onChange={(e) => setFiltroMateria(e.target.value)}>
                <option value="">Todas as matérias</option>
                {OPCOES_FILTRO.materias.map(mat => (
                  <option key={mat.id} value={mat.nome}>
                    {mat.nome === "educacao_infantil" ? "Educação Infantil" : mat.nome}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Ano Escolar (Opcional)</Label>
              <Select value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)}>
                <option value="">Todos os anos</option>
                {OPCOES_FILTRO.anos.map(ano => (
                  <option key={ano} value={String(ano)}>
                    {ano}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Habilidade BNCC *</Label>
              <Select 
                value={selectedHabilidade} 
                onChange={(e) => setSelectedHabilidade(e.target.value)}
                required
              >
                <option value="" disabled>Selecione uma habilidade...</option>
                
                {habilidadesFiltradas.length === 0 && (
                  <option disabled>Nenhuma habilidade encontrada para este filtro...</option>
                )}
                
                {habilidadesFiltradas.map((hab) => (
                  <option key={hab.id} value={hab.codigo}>
                    {hab.codigo} - {hab.descricao?.length > 70 ? hab.descricao.substring(0, 70) + "..." : hab.descricao}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Tema da Atividade *</Label>
              <ModalInput 
                placeholder="Ex: A importância da preservação da água" 
                value={temaAtividade}
                onChange={(e) => setTemaAtividade(e.target.value)}
                required
              />
            </FormGroup>

            <ModalActions>
              <CancelButton type="button" onClick={() => setShowModal(false)}>Cancelar</CancelButton>
              <SubmitButton type="button" onClick={handleGerarAtividade}>Gerar</SubmitButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}


const BaseButton = styled.button`
  width: 100%;
  padding: 14px 20px;
  border-radius: 20px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Manrope', sans-serif;
  cursor: pointer;
  text-align: left;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const NewChatButton = styled(BaseButton)`
  background-color: #00A7C4;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const GenerateButton = styled(BaseButton)`
  background-color: #4B3A71;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 10px 0;
`;

const HistoryButton = styled(BaseButton)`
  background-color: ${props => props.$isActive ? '#00A7C4' : '#0c3546'};
  color: #fff;
  border-radius: 20px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:hover {
    background-color: ${props => props.$isActive ? '#00A7C4' : '#0e4157'};
    opacity: 1;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background-color: #09071B;
  padding: 30px 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255,255,255,0.1);
`;

const ModalTitle = styled.h2`
  color: #fff;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Label = styled.label`
  color: #ccc;
  font-size: 14px;
  margin-bottom: 5px;
`;

const Select = styled.select`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #333;
  background-color: #1a1d2d;
  color: #fff;
  font-family: 'Manrope', sans-serif;
  outline: none;
  
  &:focus { border-color: #00A7C4; }
`;

const ModalInput = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #333;
  background-color: #1a1d2d;
  color: #fff;
  font-family: 'Manrope', sans-serif;
  outline: none;

  &:focus { border-color: #00A7C4; }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 25px;
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: #ccc;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Manrope', sans-serif;
  &:hover { color: #fff; }
`;

const SubmitButton = styled.button`
  background-color: #00A7C4;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-family: 'Manrope', sans-serif;
  cursor: pointer;
  &:hover { background-color: #008fa8; }
`;

const Container = styled.div`
  display: flex;
  height: 89.3vh;
  width: 100vw;
  background-color: #0b0c16; 
  font-family: 'Manrope', sans-serif;
`;

const Sidebar = styled.aside`
  width: 280px;
  background-color: #09071B; 
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
`;

const NavButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1; 
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  margin-top: auto;
`;

const ProfileIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: #00A7C4;
  border-radius: 50%;
`;

const MainArea = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #0e111a; 
`;

const ChatContent = styled.div`
  flex-grow: 1;
  padding: 40px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  color: #fff;
  font-size: 22px;
  margin: auto;
  text-align: center;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
`;

const MessageRow = styled.div`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div`
  background-color: ${props => props.$isUser ? '#4B3A71' : '#ffffff'};
  color: ${props => props.$isUser ? '#ffffff' : '#000000'};
  padding: 16px 20px;
  border-radius: 8px;
  max-width: 80%;
  
  h1, h2, h3 { margin: 0 0 10px 0; font-weight: 700; }
  h1 { font-size: 1.4rem; }
  h2 { font-size: 1.2rem; margin-top: 15px; }
  h3 { font-size: 1.1rem; }
  p { margin: 0 0 10px 0; line-height: 1.6; &:last-child { margin-bottom: 0; } }
  ul, ol { margin: 0 0 10px 20px; padding: 0; li { margin-bottom: 5px; } }
  strong { font-weight: 700; }
  hr { border: 0; border-top: 1px solid rgba(0,0,0,0.1); margin: 15px 0; }
`;

const SaveButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

const SaveButton = styled.button`
  background-color: #00A7C4;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
`;

const ResultButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`;

const ResultButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: #00A7C4;
  color: #fff;
  font-weight: 600;
`;

const InputContainer = styled.form`
  padding: 30px 40px;
`;

const InputWrapper = styled.div`
  display: flex;
  background-color: #fff;
  padding: 10px;
  border-radius: 12px;
`;

const TextInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 16px;
`;

const SendButton = styled.button`
  background-color: ${props => props.disabled ? '#ccc' : '#4B3A71'};
  color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;

  svg { width: 20px; height: 20px; }
`;

const AulaSelect = styled.select`
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 15px;
  color: #333;
  padding: 0 10px;
  margin-right: 15px;
  border-right: 2px solid #eaeaea; 
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  max-width: 200px;
`;