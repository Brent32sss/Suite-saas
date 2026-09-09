import { Link } from 'react-router-dom'

const ICONS = {
  'last-planner': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  // 1. Agregamos el icono de la cámara
  'registro-fotografico': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  ),
  presupuesto: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  wbs: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.8">
      <path d="M4 6h16M4 12h10M4 18h13" />
    </svg>
  ),
}

export default function AppCard({ app }) {
  // 2. Evaluamos si es la tarjeta de fotos
  const isCameraApp = app.id === 'registro-fotografico'

  // 3. Fondo dinámico para el icono
  const iconBg = app.enabled 
    ? (isCameraApp ? 'bg-[#1e293b]' : 'icon-gradient') 
    : 'bg-[#F3F4F6]'

  // 4. Color dinámico para la barra superior
  const topBarClass = isCameraApp ? 'bg-[#1e293b]' : 'bg-primary-light'

  const content = (
    <>
      <div className={`mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-[11px] ${iconBg}`}>
        {ICONS[app.id] || ICONS['wbs']} {/* Fallback por seguridad */}
      </div>
      <p className={`mb-1.5 text-[12.5px] font-bold ${app.enabled ? 'text-ink' : 'text-ink-faint'}`}>
        {app.title}
      </p>
      {app.enabled ? (
        <p className="text-[10px] text-ink-muted">{app.subtitle}</p>
      ) : (
        <span className="mt-2 inline-block rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[9px] font-semibold text-ink-faint">
          PRÓXIMAMENTE
        </span>
      )}
    </>
  )

  const baseClasses = 'relative overflow-hidden rounded-lg border border-border bg-surface px-4 py-6 text-center lg:py-8 transition-shadow hover:shadow-md'

  if (app.enabled) {
    return (
      <Link to={app.route} className={baseClasses}>
        {/* Aquí aplicamos el color de la franja superior */}
        <span className={`absolute inset-x-0 top-0 h-1 ${topBarClass}`} />
        {content}
      </Link>
    )
  }

  return <div className={`${baseClasses} opacity-55`}>{content}</div>
}
