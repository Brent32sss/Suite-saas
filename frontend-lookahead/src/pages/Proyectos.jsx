import { useEffect, useState, useContext } from 'react'
import Layout from '../components/Layout.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { getProjects } from '../services/api.js'
import { AuthContext } from '../context/AuthContext.jsx'

export default function Proyectos() {
  const [projects, setProjects] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    // Obtenemos el código del usuario de la sesión ('csuarez')
    const codigoUsuario = user?.usuario || user?.codigo || 'csuarez'

    if (codigoUsuario) {
      getProjects(codigoUsuario)
        .then(data => setProjects(data))
        .catch(err => console.error("Error al cargar proyectos:", err))
    }
  }, [user])

  return (
    <Layout title="Mis Proyectos">
      <p className="mb-2 text-[11px] font-bold tracking-wide text-ink-muted">
        {projects.length} PROYECTOS ACTIVOS
      </p>
      <div className="mb-5 h-px bg-border" />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] lg:gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.codigo || project.id} project={project} />
        ))}
      </div>
    </Layout>
  )
}
