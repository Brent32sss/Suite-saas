import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthProvider, AuthContext } from './context/AuthContext'
import SplashScreen from './components/SplashScreen.jsx'
import Login from './pages/Login.jsx'
import Proyectos from './pages/Proyectos.jsx'
import Apps from './pages/Apps.jsx'
import LookAhead from './pages/LookAhead.jsx'
import Perfil from './pages/Perfil.jsx'
import Soporte from './pages/Soporte.jsx'
import RegistroFotografico from './pages/RegistroFotografico.jsx'
import ReporteDiario from './pages/ReporteDiario.jsx' // <-- NUEVA IMPORTACIÓN AISLADA

// Componente para proteger las rutas
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext)
  
  if (!user) return <Navigate to="/" replace />
  
  return children
}

// Sub-componente para consumir AuthContext y SplashScreen global
const AppContent = () => {
  const { loading } = useContext(AuthContext)

  if (loading) {
    return <SplashScreen />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/proyectos" element={<ProtectedRoute><Proyectos /></ProtectedRoute>} />
        <Route path="/apps" element={<ProtectedRoute><Apps /></ProtectedRoute>} />
        <Route path="/lookahead" element={<ProtectedRoute><LookAhead /></ProtectedRoute>} />
        <Route path="/registro-fotografico" element={<ProtectedRoute><RegistroFotografico /></ProtectedRoute>} />
        <Route path="/reporte-diario" element={<ProtectedRoute><ReporteDiario /></ProtectedRoute>} /> {/* <-- NUEVA RUTA */}
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/soporte" element={<ProtectedRoute><Soporte /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
