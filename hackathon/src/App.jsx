
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fontsource/manrope';
import Login from './pages/Login/Login'
import Cadastro from './pages/Cadastro/Cadastro';

function Layout() {
  //const location = useLocation();
  return (
        <>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
        </>
  )
}

function App() {
 // const location = useLocation();
  return (
        <>
      <Router>
      <Layout />
    </Router>
        </>
  )
}

export default App
