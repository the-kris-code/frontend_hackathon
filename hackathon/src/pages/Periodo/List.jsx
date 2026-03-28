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

//   const handleDelete = async (id) => {
//     const confirm = await Alert.confirm(
//       "Excluir",
//       "Deseja excluir este período?"
//     );

//     if (!confirm.isConfirmed) return;

//     try {
//       await PeriodoService.delete(id);

//       // remove da tela
//       setData((prev) => prev.filter((item) => item.id !== id));

//       Alert.success("Excluído", "Período removido.");
//     } catch (err) {
//       Alert.error("Erro", "Erro ao excluir período.");
//     }
//   };

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

                  {/* <DeleteButton onClick={() => handleDelete(item.id)}>
                    Excluir
                  </DeleteButton> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.h1``;

const CreateButton = styled.button`
  background-color: #00A7C4;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  height: 50px;
`;

const FilterInput = styled.input`
  width: 300px;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: none;
  outline:none;
`;

const Loading = styled.div`
  color: #aaa;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 12px;
    color: #aaa;
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
`;

const ActionButton = styled.button`
  margin-right: 10px;
  background-color: #0047C5;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: #d33;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
`;