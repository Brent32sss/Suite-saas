import { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function ProfileMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  
  // Traemos los datos del usuario y la función de logout desde el Context
  const { user, handleLogout } = useContext(AuthContext)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function onLogout() {
    handleLogout()
    setIsOpen(false)
    navigate('/')
  }

  function goTo(path) {
    setIsOpen(false)
    navigate(path)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="block w-full appearance-none rounded-lg border-0 bg-transparent p-0 text-left transition-colors hover:bg-canvas"
      >
        {children}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 rounded-lg border border-border bg-surface shadow-md">
          <div className="p-4">
            {/* Mostramos el nombre y rol dinámicamente */}
            <p className="text-sm font-bold text-ink">{user?.nombre || 'Cargando...'}</p>
            <p className="text-xs font-semibold text-ink-muted">Rol: {user?.rol || 'N/A'}</p>
          </div>
          <div className="h-px bg-border" />
          <div className="p-1.5">
            <button
              onClick={() => goTo('/perfil')}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[13px] font-medium text-ink-secondary hover:bg-canvas"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
              </svg>
              Mi Perfil
            </button>
            <button
              onClick={() => goTo('/soporte')}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[13px] font-medium text-ink-secondary hover:bg-canvas"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2 1.8-2 3.3M12 17h.01" />
              </svg>
              Soporte
            </button>
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[13px] font-medium text-red-600 hover:bg-red-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3M15 16l4-4-4-4M19 12H9" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
