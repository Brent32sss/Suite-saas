import { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { getProjects } from '../services/api.js'

export default function Proyectos() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    getProjects().then(setProjects)
  }, [])

  return (
    <Layout title="Mis Proyectos">
      <p className="mb-2 text-[11px] font-bold tracking-wide text-ink-muted">
        {projects.length} PROYECTOS ACTIVOS
      </p>
      <div className="mb-5 h-px bg-border" />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] lg:gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Layout>
  )
}
