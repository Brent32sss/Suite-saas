import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  const isActive = project.status === 'activo'
  const accent = isActive ? 'bg-primary-light' : 'bg-[#F59E0B]'

  return (
    <article className="relative overflow-hidden rounded-lg border border-border bg-surface py-5 pl-6 pr-4 lg:py-6 lg:pl-6 lg:pr-5">
      <span className={`absolute inset-y-0 left-0 w-1 ${accent}`} />

      <span className="mb-2.5 inline-block rounded-[5px] bg-[#F3F4F6] px-2 py-1 text-[9.5px] font-bold text-ink-secondary">
        {project.code}
      </span>

      <span
        className={`ml-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8.5px] font-bold ${
          isActive ? 'bg-success-bg text-success-text' : 'bg-warning-bg text-warning-text'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-success-dot' : 'bg-warning-dot'}`} />
        {isActive ? 'ACTIVO' : 'PLANIFICACIÓN'}
      </span>

      <h3 className="my-2.5 text-[15px] font-bold leading-tight text-ink">{project.name}</h3>

      <p className="mb-5 flex items-start gap-1.5 text-[10px] text-ink-muted">
        📍 {project.location}
      </p>

      <Link
        to="/apps"
        className="btn-gradient flex h-[34px] w-full items-center justify-center rounded-md text-[11px] font-bold text-white"
      >
        Ver Apps
      </Link>
    </article>
  )
}
