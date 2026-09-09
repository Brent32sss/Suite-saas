import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthProvider, AuthContext } from './context/AuthContext'
import Login from './pages/Login.jsx'
import Proyectos from './pages/Proyectos.jsx'
import Apps from './pages/Apps.jsx'
import LookAhead from './pages/LookAhead.jsx'
import Perfil from './pages/Perfil.jsx'
import Soporte from './pages/Soporte.jsx'

// 1. IMPORTAMOS EL NUEVO MÓDULO
import RegistroFotografico from './pages/RegistroFotografico.jsx'

// Componente para proteger las rutas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)
  
  if (loading) return null // O un spinner de carga
  if (!user) return <Navigate to="/" replace />
  
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/proyectos" element={<ProtectedRoute><Proyectos /></ProtectedRoute>} />
          <Route path="/apps" element={<ProtectedRoute><Apps /></ProtectedRoute>} />
          <Route path="/lookahead" element={<ProtectedRoute><LookAhead /></ProtectedRoute>} />
          
          {/* 2. AGREGAMOS LA RUTA PROTEGIDA DEL REGISTRO FOTOGRÁFICO */}
          <Route path="/registro-fotografico" element={<ProtectedRoute><RegistroFotografico /></ProtectedRoute>} />

          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/soporte" element={<ProtectedRoute><Soporte /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
