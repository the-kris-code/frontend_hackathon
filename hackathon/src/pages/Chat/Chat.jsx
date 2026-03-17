import React, { useState } from 'react';
import styled from 'styled-components';

export default function ChatPage() {
  const [inputText, setInputText] = useState("");
  
  // Estado que armazena as mensagens. 
  // Para ver a tela "vazia", basta deixar este array vazio: useState([])
  const [messages, setMessages] = useState([
    { id: 1, text: "Lorem ipsum dolor sit amet, consectetur adipiscing", sender: "user" },
    { id: 2, text: "Lorem ipsum dolor sit amet, consectetur adipiscing", sender: "ai" },
    { id: 3, text: "Lorem ipsum dolor sit amet, consec", sender: "user" },
    { 
      id: 4, 
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam", 
      sender: "ai",
      hasSaveButton: true 
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user"
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <Container>
      <Sidebar>
        <Logo>hackathon</Logo>
        
        <NavButtons>
          <NewChatButton onClick={() => setMessages([])}>
            Novo chat <span>+</span>
          </NewChatButton>
          
          <HistoryButton>Fisiologia do esporte</HistoryButton>
          <HistoryButton>Planejamento 2º bime...</HistoryButton>
          <HistoryButton>Recuperação inglês</HistoryButton>
        </NavButtons>

        <ProfileButton>
          <ProfileIcon>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </ProfileIcon>
        </ProfileButton>
      </Sidebar>

      <MainArea>
        <ChatContent>
          {messages.length === 0 ? (
            <EmptyState>Comece um novo chat</EmptyState>
          ) : (
            <MessageList>
              {messages.map((msg) => (
                <MessageRow key={msg.id} $isUser={msg.sender === "user"}>
                  <MessageBubble $isUser={msg.sender === "user"}>
                    <p>{msg.text}</p>
                    {msg.hasSaveButton && (
                      <SaveButtonRow>
                        <SaveButton>Salvar</SaveButton>
                      </SaveButtonRow>
                    )}
                  </MessageBubble>
                </MessageRow>
              ))}
            </MessageList>
          )}
        </ChatContent>

        <InputContainer onSubmit={handleSendMessage}>
          <InputWrapper>
            <TextInput 
              placeholder="Digite sua mensagem..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <SendButton type="submit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
            </SendButton>
          </InputWrapper>
        </InputContainer>
      </MainArea>
    </Container>
  );
}

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

  span {
    font-size: 18px;
    font-weight: bold;
  }
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
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  margin-top: auto; 
`;

const ProfileIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: #00A7C4;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #090914;
  
  svg {
    width: 30px;
    height: 30px;
  }
`;

const MainArea = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #0e111a; 
  position: relative;
`;

const ChatContent = styled.div`
  flex-grow: 1;
  padding: 40px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

const EmptyState = styled.div`
  color: #fff;
  font-size: 22px;
  margin: auto; 
  font-weight: 500;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;
  margin: 0 auto; 
  width: 100%;
`;

const MessageRow = styled.div`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div`
  background-color: #ffffff;
  color: #000000;
  padding: 16px 20px;
  border-radius: 8px;
  max-width: 70%;
  font-size: 15px;
  line-height: 1.5;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);

  p {
    margin: 0;
  }
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
  font-weight: 600;
  cursor: pointer;
  font-family: 'Manrope', sans-serif;
  
  &:hover {
    opacity: 0.9;
  }
`;

const InputContainer = styled.form`
  padding: 30px 40px;
  display: flex;
  justify-content: center;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 10px 10px 10px 20px;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

const TextInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 16px;
  font-family: 'Manrope', sans-serif;
  background: transparent;
  color: #000;
`;

const SendButton = styled.button`
  background-color: #4B3A71; 
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;