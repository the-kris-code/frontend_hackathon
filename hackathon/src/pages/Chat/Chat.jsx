import React, { useState } from 'react';
import styled from 'styled-components';

export default function ChatPage() {
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState("chat"); // controle de tela
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([]);

  // simula resposta da IA
  const simulateAIResponse = (text) => {
    setIsTyping(true);

    setTimeout(() => {
      const response = {
        id: Date.now(),
        text: `Resposta simulada para: "${text}"`,
        sender: "ai",
        hasSaveButton: true
      };

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user"
    };

    setMessages((prev) => [...prev, newMessage]);
    simulateAIResponse(inputText);
    setInputText("");
  };

  // copiar texto do último resultado
  const handleCopy = () => {
    const lastAI = [...messages].reverse().find(m => m.sender === "ai");
    if (lastAI) {
      navigator.clipboard.writeText(lastAI.text);
      alert("Texto copiado");
    }
  };

  return (
    <Container>
      <Sidebar>
        <Logo>hackathon</Logo>

        <NavButtons>
          <NewChatButton onClick={() => {
            setMessages([]);
            setMode("chat");
          }}>
            Novo chat <span>+</span>
          </NewChatButton>

          <HistoryButton>Fisiologia do esporte</HistoryButton>
          <HistoryButton>Planejamento 2º bime...</HistoryButton>
          <HistoryButton>Recuperação inglês</HistoryButton>
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
              <EmptyState>Comece um novo chat</EmptyState>
            ) : (
              <MessageList>
                {messages.map((msg) => (
                  <MessageRow key={msg.id} $isUser={msg.sender === "user"}>
                    <MessageBubble $isUser={msg.sender === "user"}>
                      <p>{msg.text}</p>

                      {msg.hasSaveButton && (
                        <SaveButtonRow>
                          <SaveButton onClick={() => setMode("result")}>
                            Salvar
                          </SaveButton>
                        </SaveButtonRow>
                      )}
                    </MessageBubble>
                  </MessageRow>
                ))}

                {isTyping && (
                  <MessageRow>
                    <MessageBubble>
                      <p style={{ opacity: 0.6 }}>Digitando...</p>
                    </MessageBubble>
                  </MessageRow>
                )}
              </MessageList>
            )
          ) : (
            <>
              <MessageList>
                <MessageRow>
                  <MessageBubble>
                    <p>
                      {
                        [...messages]
                          .reverse()
                          .find(m => m.sender === "ai")?.text
                      }
                    </p>
                  </MessageBubble>
                </MessageRow>
              </MessageList>

              <ResultButtons>
                <ResultButton onClick={handleCopy}>Copiar</ResultButton>
                <ResultButton>PDF</ResultButton>
                <ResultButton>Word</ResultButton>
              </ResultButtons>

              <ResultButtons>
                <ResultButton onClick={() => setMode("chat")}>
                  Voltar
                </ResultButton>
              </ResultButtons>
            </>
          )}

        </ChatContent>

        {mode === "chat" && (
          <InputContainer onSubmit={handleSendMessage}>
            <InputWrapper>
              <TextInput
                placeholder="Digite sua mensagem..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <SendButton type="submit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </SendButton>
            </InputWrapper>
          </InputContainer>
        )}

      </MainArea>
    </Container>
  );
}

/* ===== SEU CSS ORIGINAL (inalterado) ===== */

const Container = styled.div`
  display: flex;
  height: 100vh;
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

const Logo = styled.h1`
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
`;

const NavButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1; 
`;

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
  margin-bottom: 10px;
`;

const HistoryButton = styled(BaseButton)`
  background-color: #0c3546;
  color: #fff;
  border-radius: 20px;
  font-weight: 500;
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
  background-color: #ffffff;
  color: #000;
  padding: 16px 20px;
  border-radius: 8px;
  max-width: 70%;
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
`;

const SendButton = styled.button`
  background-color: #4B3A71;
  color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
`;