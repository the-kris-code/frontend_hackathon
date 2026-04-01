import Navbar from "../Navbar/index";
import styled from "styled-components";

export default function MainLayout({ children }) {
  return (
    <Container>
      <Navbar />
      <Content>{children}</Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #0b0c16;
  min-height: 100vh;
  width: 100%;
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;