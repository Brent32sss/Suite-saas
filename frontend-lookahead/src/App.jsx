import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Proyectos from './pages/Proyectos.jsx'
import Apps from './pages/Apps.jsx'
import LookAhead from './pages/LookAhead.jsx'
import Perfil from './pages/Perfil.jsx'
import Soporte from './pages/Soporte.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/apps" element={<Apps />} />
        <Route path="/lookahead" element={<LookAhead />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/soporte" element={<Soporte />} />
      </Routes>
    </BrowserRouter>
  )
}
