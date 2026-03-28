import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';

import PeriodoList from './pages/Periodo/List';
import PeriodoForm from './pages/Periodo/Form';

import MateriaList from './pages/Materia/List';
import MateriaForm from './pages/Materia/Form';

import TurmaList from './pages/Turma/List';
import TurmaForm from './pages/Turma/Form';

import AulaList from './pages/Aula/List';
import AulaForm from './pages/Aula/Form';

import ChatPage from './pages/Chat/Chat';

import PrivateRoute from './components/PrivateRoutes';
import MainLayout from './components/MainLayout';
import Perfil from './pages/Perfil/Perfil';


function PrivateLayout() {
  return (
    <PrivateRoute>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </PrivateRoute>
  );
}

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* TODAS AS ROTAS PRIVADAS */}
        <Route element={<PrivateLayout />}>

          <Route path="/chat" element={<ChatPage />} />

          <Route path="/periodos" element={<PeriodoList />} />
          <Route path="/periodo/novo" element={<PeriodoForm />} />
          <Route path="/periodo/:id" element={<PeriodoForm />} />

          <Route path="/materias" element={<MateriaList />} />
          <Route path="/materias/novo" element={<MateriaForm />} />
          <Route path="/materias/:id" element={<MateriaForm />} />

          <Route path="/turmas" element={<TurmaList />} />
          <Route path="/turmas/novo" element={<TurmaForm />} />
          <Route path="/turmas/:id" element={<TurmaForm />} />

          <Route path="/aulas" element={<AulaList />} />
          <Route path="/aulas/novo" element={<AulaForm />} />
          <Route path="/aulas/:id" element={<AulaForm />} />

          <Route path="/perfil" element={<Perfil />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;