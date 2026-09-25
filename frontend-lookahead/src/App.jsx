import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthProvider, AuthContext } from './context/AuthContext'
import SplashScreen from './components/SplashScreen.jsx' // <-- 1. Importamos tu pantalla de carga
import Login from './pages/Login.jsx'
import Proyectos from './pages/Proyectos.jsx'
import Apps from './pages/Apps.jsx'
import LookAhead from './pages/LookAhead.jsx'
import Perfil from './pages/Perfil.jsx'
import Soporte from './pages/Soporte.jsx'
import RegistroFotografico from './pages/RegistroFotografico.jsx'

// Componente para proteger las rutas
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext)
  
  // Ya no necesitamos validar 'loading' aquí porque lo hacemos a nivel global
  if (!user) return <Navigate to="/" replace />
  
  return children
}

// 2. Creamos este sub-componente para poder consumir el AuthContext
const AppContent = () => {
  const { loading } = useContext(AuthContext)

  // 3. MIENTRAS CARGA: Mostramos tu SplashScreen a nivel global
  if (loading) {
    return <SplashScreen />
  }

  // 4. CUANDO TERMINA DE CARGAR: Mostramos las rutas normales
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/proyectos" element={<ProtectedRoute><Proyectos /></ProtectedRoute>} />
        <Route path="/apps" element={<ProtectedRoute><Apps /></ProtectedRoute>} />
        <Route path="/lookahead" element={<ProtectedRoute><LookAhead /></ProtectedRoute>} />
        <Route path="/registro-fotografico" element={<ProtectedRoute><RegistroFotografico /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/soporte" element={<ProtectedRoute><Soporte /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      {/* 5. Inyectamos nuestro componente con rutas dentro del Provider */}
      <AppContent />
    </AuthProvider>
  )
}
