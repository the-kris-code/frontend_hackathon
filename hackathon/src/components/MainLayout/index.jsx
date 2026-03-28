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
  background-color: #0b0c16;
  min-height: 100vh;
`;

const Content = styled.div`
  // padding-top: 20px;
`;