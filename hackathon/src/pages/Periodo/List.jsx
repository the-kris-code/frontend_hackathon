import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Alert } from "../../components/SweetAlert";
import { useNavigate } from "react-router-dom";
import { PeriodoService } from "../../api/periodoService";

export default function PeriodoList() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await PeriodoService.getAll();
      setData(response);
    } catch (err) {
      Alert.error("Erro", "Erro ao carregar períodos.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) =>
    item.nome?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <Title>Períodos</Title>
        <CreateButton onClick={() => navigate("/periodo/novo")}>
          + Novo Período
        </CreateButton>
      </Header>

      <FilterInput
        placeholder="Buscar período..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <Loading>Carregando...</Loading>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.horarioInicio}</td>
                  <td>{item.horarioFim}</td>
                  <td>
                    <Status $active={item.isAtivo}>
                      {item.isAtivo ? "Ativo" : "Inativo"}
                    </Status>
                  </td>
                  <td>
                    <ActionButton
                      onClick={() => navigate(`/periodo/${item.id}`)}
                    >
                      Editar
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: 40px;
  background-color: #0b0c16;
  min-height: 100vh;
  color: #fff;
  font-family: 'Manrope', sans-serif;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
`;

const Title = styled.h1`
  margin: 0;
`;

const CreateButton = styled.button`
  background-color: #00A7C4;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  height: 50px;
  font-weight: 600;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const FilterInput = styled.input`
  width: 300px;
  max-width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: none;
  outline: none;
  box-sizing: border-box;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const Loading = styled.div`
  color: #aaa;
  padding: 20px 0;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 500px; 

  th {
    text-align: left;
    padding: 12px;
    color: #aaa;
    white-space: nowrap;
  }

  td {
    padding: 12px;
    border-top: 1px solid #222;
  }

  tr:hover {
    background-color: #121826;
  }
`;

const Status = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  background-color: ${(p) => (p.$active ? "#36753C" : "#444")};
  white-space: nowrap;
`;

const ActionButton = styled.button`
  margin-right: 10px;
  background-color: #0047C5;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
`;