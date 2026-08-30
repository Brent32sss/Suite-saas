import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api.js'

export default function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState('csuarez')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(user, password)
      // TODO: guardar el token real (localStorage / context) cuando el backend valide de verdad
      navigate('/proyectos')
    } catch (err) {
      setError('No pudimos iniciar sesión. Revisa tus datos.')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[400px] rounded-xl border border-border bg-surface px-8 pb-8 pt-10 lg:max-w-[440px]"
      >
        <div className="icon-gradient mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[18px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 3 L21 9 V21 H3 V9 Z" fill="#FFFFFF" />
          </svg>
        </div>

        <h1 className="mb-1.5 text-center text-[22px] font-bold text-ink">Bienvenido</h1>
        <p className="mb-7 text-center text-[13px] text-ink-muted">
          Ingresa tus datos para continuar
        </p>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-[12.5px] text-red-600">{error}</p>
        )}

        <div className="mb-5">
          <label htmlFor="user" className="mb-2 block text-[13px] text-ink-secondary">
            Usuario o correo
          </label>
          <input
            id="user"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            className="h-[46px] w-full rounded-sm border border-border-strong bg-[#FBFBFC] px-3.5 text-[13px] text-ink-secondary outline-none focus:border-primary focus:ring-[3px] focus:ring-primary-bg"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="mb-2 block text-[13px] text-ink-secondary">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-[46px] w-full rounded-sm border border-border-strong bg-[#FBFBFC] px-3.5 text-[13px] text-ink-secondary outline-none focus:border-primary focus:ring-[3px] focus:ring-primary-bg"
          />
        </div>

        <div className="mb-6 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-[#4B5563]">
            <input type="checkbox" className="h-4 w-4 rounded border-ink-faint" />
            Recordar sesión
          </label>
          <a href="#" className="text-[12.5px] font-semibold text-primary">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button
          type="submit"
          className="btn-gradient h-[50px] w-full rounded-sm text-[15px] font-bold text-white"
        >
          Ingresar
        </button>

        <p className="mt-6 text-center text-[10.5px] text-ink-faint">© 2026 Index Corp</p>
      </form>
    </main>
  )
}
