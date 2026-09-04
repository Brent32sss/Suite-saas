import { apps } from '../data/apps.js'
import { days, lookAheadRows } from '../data/lookahead.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function login(user, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: user, password })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Error al iniciar sesión')
  }
  
  return await response.json()
}

export async function getProjects(codigoUsuario) {
  const token = localStorage.getItem('token')
  
  const response = await fetch(`${API_URL}/proyectos/${codigoUsuario}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) throw new Error('Error de autorización o servidor')
  return await response.json()
}

export async function getProjectApps(projectId) {
  // Cuando conectes apps, haz lo mismo con el token aquí
  return apps
}

export async function getLookAhead(projectId) {
  // Cuando conectes lookahead, haz lo mismo con el token aquí
  return { days, rows: lookAheadRows }
}
