import { Link } from 'react-router-dom'

const ICONS = {
  'last-planner': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
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
  const iconBg = app.enabled ? 'icon-gradient' : 'bg-[#F3F4F6]'

  const content = (
    <>
      <div className={`mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-[11px] ${iconBg}`}>
        {ICONS[app.id]}
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

  const baseClasses = 'relative overflow-hidden rounded-lg border border-border bg-surface px-4 py-6 text-center lg:py-8'

  if (app.enabled) {
    return (
      <Link to={app.route} className={baseClasses}>
        <span className="absolute inset-x-0 top-0 h-1 bg-primary-light" />
        {content}
      </Link>
    )
  }

  return <div className={`${baseClasses} opacity-55`}>{content}</div>
}
