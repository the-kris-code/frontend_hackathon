import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { ChronosService } from '../../api/chronosService'; 
import { AulaService } from '../../api/aulaService'; 
import { HabilidadeService } from '../../api/habilidadeService';
import html2pdf from 'html2pdf.js';
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function ChatPage() {
  const [opcoesFiltro, setOpcoesFiltro] = useState({ anos: [], materias: [] });
  const navigate = useNavigate();
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
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const formatMessageTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const day = date.toLocaleDateString('pt-BR');
    return `${day} às ${time}`;
  };

  const getPersistedConversaId = (chatId) => {
    if (!chatId) return undefined;

    const chatIdStr = String(chatId);
    if (chatIdStr.startsWith("temp-")) return undefined;

    const parsed = Number(chatIdStr);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [aulasData, conversasData] = await Promise.all([
          AulaService.getAulas(),
          ChronosService.getConversas() 
        ]);
        
        setAulas(aulasData);

        let conversasArray = [];
        if (Array.isArray(conversasData)) {
          conversasArray = conversasData;
        } else if (typeof conversasData === 'object' && conversasData !== null) {
          const possibleArray = Object.values(conversasData).find(val => Array.isArray(val));
          if (possibleArray) conversasArray = possibleArray;
        }

        if (conversasArray.length > 0) {
          const historicoFormatado = conversasArray.map((conv, index) => {
            
            const mensagensArray = Array.isArray(conv.mensagens) ? conv.mensagens : [];
            
            const primeiraMsgUser = mensagensArray.find(m => m.role === 'user');
            let titulo = primeiraMsgUser ? primeiraMsgUser.conteudo : (conv.aula?.nome || "Novo Chat");
            
            if (titulo.length > 25) titulo = titulo.substring(0, 25) + '...';

            return {
              id: String(conv.id || `chat-${index}`), 
              title: titulo,
              aulaId: String(conv.aulaId || conv.aula?.id || ""),
              messages: mensagensArray.map((m, mIndex) => ({
                id: m.id || `msg-${mIndex}`,
                text: m.conteudo,
                sender: m.role === 'assistant' ? 'ai' : 'user', 
                hasSaveButton: m.role === 'assistant',
                timestamp: m.criadoEm 
              }))
            };
          });
          setChatHistory(historicoFormatado.reverse());
        }

      } catch (error) {
        console.error("Erro ao buscar dados iniciais (Aulas/Conversas):", error);
      }
    };
    
    fetchInitialData();
  }, []);

 useEffect(() => {
  if (showModal) {
    const fetchDadosModal = async () => {
      try {
        const [habilidadesData, filtrosData] = await Promise.all([
          HabilidadeService.getHabilidades(filtroMateria, filtroAno),
          HabilidadeService.getFiltros() 
        ]);
        
        let arraySeguro = [];
        if (Array.isArray(habilidadesData)) arraySeguro = habilidadesData;
        else if (habilidadesData?.content) arraySeguro = habilidadesData.content;
        else if (habilidadesData?.data?.content) arraySeguro = habilidadesData.data.content;
        else if (habilidadesData?.data) arraySeguro = habilidadesData.data;
        else if (habilidadesData?.items) arraySeguro = habilidadesData.items;
        else if (habilidadesData?.habilidades) arraySeguro = habilidadesData.habilidades;

        setHabilidades(arraySeguro);

        if (filtrosData && opcoesFiltro.materias.length === 0) {
          setOpcoesFiltro({
            anos: filtrosData.anos || [],
            materias: filtrosData.materias || []
          });
        }
      } catch (error) {
        console.error(error);
        setHabilidades([]);
      }
    };
    
    fetchDadosModal();
  }
}, [showModal, filtroMateria, filtroAno]); 

  useEffect(() => {
    setSelectedHabilidade("");
  }, [filtroMateria, filtroAno]);

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
    const newUserMsg = { 
      id: Date.now(), 
      text: userText, 
      sender: "user",
      timestamp: new Date().toISOString() 
    };
    
    let currentChatId = activeChatId;

    if (!currentChatId) {
      currentChatId = `temp-${Date.now()}`;
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
      const data = await ChronosService.conversar(
        Number(selectedAula),
        userText,
        getPersistedConversaId(currentChatId)
      );
      const resolvedChatId = String(data.conversaId || currentChatId);
      const aiResponse = {
        id: Date.now() + 1,
        text: data.resposta || "Resposta recebida, mas em formato inesperado.",
        sender: "ai",
        hasSaveButton: true,
        timestamp: new Date().toISOString() 
      };

      setMessages((prev) => [...prev, aiResponse]);
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId
          ? { ...chat, id: resolvedChatId, messages: [...chat.messages, aiResponse] }
          : chat
      ));
      setActiveChatId(resolvedChatId);
    } catch (error) {
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
    const newUserMsg = { 
      id: Date.now(), 
      text: comandoVisual, 
      sender: "user",
      timestamp: new Date().toISOString() 
    };
    let currentChatId = activeChatId;

    if (!currentChatId) {
      currentChatId = `temp-${Date.now()}`;
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
        temaAtividade,
        getPersistedConversaId(currentChatId)
      );
      const resolvedChatId = String(data?.conversaId || currentChatId);

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
        hasSaveButton: true,
        timestamp: new Date().toISOString() 
      };

      setMessages((prev) => [...prev, aiResponse]);
      
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId
          ? { ...chat, id: resolvedChatId, messages: [...chat.messages, aiResponse] }
          : chat
      ));
      setActiveChatId(resolvedChatId);

    } catch (error) {
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
    setIsSidebarOpen(false); 
  };

  return (
    <Container>
      <MobileHeader>
        <MenuButton onClick={() => setIsSidebarOpen(true)}>
          <FaBars />
        </MenuButton>
        <MobileTitle>Chronos</MobileTitle>
      </MobileHeader>

      <SidebarOverlay $isOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(false)} />

      <Sidebar $isOpen={isSidebarOpen}>
        <CloseSidebarButton onClick={() => setIsSidebarOpen(false)}>
          <FaTimes />
        </CloseSidebarButton>

        <NavButtons>
          <NewChatButton onClick={() => {
            setActiveChatId(null);
            setMessages([]);
            setSelectedAula(""); 
            setMode("chat");
            setIsSidebarOpen(false);
          }}>
            Novo chat <span>+</span>
          </NewChatButton>

          <GenerateButton onClick={() => { setShowModal(true); setIsSidebarOpen(false); }}>
            Gerar Atividade <span>+</span>
          </GenerateButton>
          
          <Divider />

          <HistoryList>
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
          </HistoryList>
        </NavButtons>

        <ProfileButton onClick={() => navigate("/perfil")}>
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
                      
                      {msg.timestamp && (
                        <TimeText $isUser={msg.sender === "user"}>
                          {formatMessageTime(msg.timestamp)}
                        </TimeText>
                      )}
                      
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
                placeholder="Sua mensagem..."
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
                {opcoesFiltro.materias.map(mat => (
                  <option key={mat.id} value={mat.id}> 
                    {mat.nome === "educacao_infantil" ? "Educação Infantil" : mat.nome}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Ano Escolar (Opcional)</Label>
              <Select value={filtroAno} onChange={(e) => setFiltroAno(e.target.value)}>
                <option value="">Todos os anos</option>
                {opcoesFiltro.anos.map(ano => (
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
                
                {habilidades.length === 0 && (
                  <option disabled>Nenhuma habilidade encontrada...</option>
                )}
                
                {habilidades.map((hab, index) => (
                  <option key={hab.id || index} value={hab.codigo}>
                    {hab.codigo} - {hab.descricao?.length > 50 ? hab.descricao.substring(0, 50) + "..." : hab.descricao}
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

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex-grow: 1;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
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
  padding: 20px;
`;

const ModalContent = styled.div`
  background-color: #09071B;
  padding: 30px 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255,255,255,0.1);
  max-height: 90vh;
  overflow-y: auto;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const ModalTitle = styled.h2`
  color: #fff;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;

  @media (max-width: 480px) {
    font-size: 20px;
  }
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
  width: 100%;
  
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
  width: 100%;
  box-sizing: border-box;

  &:focus { border-color: #00A7C4; }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 25px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 10px;
  }
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: #ccc;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Manrope', sans-serif;
  padding: 10px 20px;
  &:hover { color: #fff; }

  @media (max-width: 480px) {
    background-color: #333;
    border-radius: 8px;
  }
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
  height: calc(100vh - 70px); 
  width: 100%;
  background-color: #0b0c16; 
  font-family: 'Manrope', sans-serif;
  position: relative;
  overflow: hidden;
`;

const MobileHeader = styled.div`
  display: none;
  align-items: center;
  padding: 10px 20px;
  background-color: #09071B;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  box-sizing: border-box;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
`;

const MobileTitle = styled.h2`
  color: #fff;
  margin: 0 0 0 15px;
  font-size: 18px;
`;

const SidebarOverlay = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: fixed;
    top: 70px;
    left: 0;
    width: 100vw;
    height: calc(100vh - 70px);
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
`;

const Sidebar = styled.aside`
  width: 280px;
  background-color: #09071B; 
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease-in-out;
  height: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    height: calc(100vh - 70px);
    z-index: 100;
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.$isOpen ? '5px 0 15px rgba(0,0,0,0.5)' : 'none'};
  }
`;

const CloseSidebarButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  align-self: flex-end;
  margin-bottom: 15px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1; 
  overflow: hidden;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  margin-top: 20px;
  cursor: pointer;
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
  height: 100%;
  
  @media (max-width: 768px) {
    padding-top: 50px; 
  }
`;

const ChatContent = styled.div`
  flex-grow: 1;
  padding: 40px;
  overflow-y: auto;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const EmptyState = styled.div`
  color: #fff;
  font-size: 22px;
  margin: auto;
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 18px;
  }
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
  word-wrap: break-word;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    max-width: 90%;
    padding: 12px 15px;
  }
  
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

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const ResultButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: #00A7C4;
  color: #fff;
  font-weight: 600;

  @media (max-width: 480px) {
    padding: 10px 15px;
    font-size: 14px;
  }
`;

const InputContainer = styled.form`
  padding: 20px 40px 30px 40px;
  background-color: #0e111a;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  background-color: #fff;
  padding: 10px;
  border-radius: 12px;
  align-items: center;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    padding: 8px;
    gap: 8px;
  }
`;

const TextInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 0 10px;
  min-width: 100px;

  @media (max-width: 768px) {
    width: calc(100% - 60px); 
    padding: 10px;
    order: 2;
  }
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
  flex-shrink: 0;

  svg { width: 20px; height: 20px; }

  @media (max-width: 768px) {
    order: 3;
  }
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

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    border-right: none;
    border-bottom: 1px solid #eaeaea;
    margin-right: 0;
    padding: 10px;
    order: 1;
  }
`;

const TimeText = styled.span`
  display: block;
  font-size: 11px;
  margin-top: 10px;
  text-align: right;
  opacity: 0.7;
  color: ${props => props.$isUser ? '#e0e0e0' : '#666666'};
`;
