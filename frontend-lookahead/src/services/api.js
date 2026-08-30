// ============================================
// Capa de servicios — funciones que hablan con
// tu backend de Node.js.
//
// Por ahora cada función devuelve los datos de
// ejemplo de src/data/. Cuando tu backend esté
// listo, reemplaza el cuerpo de cada función por
// un fetch() real, ej:
//
//   export async function login(user, password) {
//     const res = await fetch(`${API_URL}/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ user, password }),
//     })
//     if (!res.ok) throw new Error('Credenciales inválidas')
//     return res.json() // { token, user }
//   }
// ============================================

import { projects } from '../data/projects.js'
import { apps } from '../data/apps.js'
import { days, lookAheadRows } from '../data/lookahead.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function login(user, password) {
  // TODO: conectar a POST {API_URL}/login
  return { token: 'fake-token', user: { name: 'Christian Suárez', role: 'ADMIN' } }
}

export async function getProjects() {
  // TODO: conectar a GET {API_URL}/proyectos
  return projects
}

export async function getProjectApps(projectId) {
  // TODO: conectar a GET {API_URL}/proyectos/:id/apps
  return apps
}

export async function getLookAhead(projectId) {
  // TODO: conectar a GET {API_URL}/proyectos/:id/lookahead
  return { days, rows: lookAheadRows }
}
