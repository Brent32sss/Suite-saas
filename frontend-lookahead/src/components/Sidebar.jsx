import { Link } from 'react-router-dom'
import ProfileMenu from './ProfileMenu.jsx'

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay oscuro — solo visible en mobile/tablet cuando el drawer está abierto */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-[#0F1615]/55 transition-opacity duration-200 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] max-w-[85vw] flex-col
          bg-surface shadow-drawer transition-transform duration-300 ease-out
          lg:translate-x-0 lg:border-r lg:border-border lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <ProfileMenu>
          <div className="flex items-center gap-3.5 p-5">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#D9DEE3] text-[15px] font-bold text-ink-secondary">
              CS
            </div>
            <div className="text-left">
              <p className="mb-0.5 text-sm font-bold text-ink">Christian Suárez</p>
              <p className="text-[11.5px] font-bold text-primary">Rol: ADMIN</p>
            </div>
          </div>
        </ProfileMenu>

        <div className="h-px bg-border" />

        <p className="px-6 pb-3 pt-5 text-[10.5px] font-bold tracking-wide text-ink-faint">
          NAVEGACIÓN
        </p>

        <nav className="flex flex-col gap-1 px-3">
          <Link
            to="/proyectos"
            onClick={onClose}
            className="flex items-center gap-3 rounded-md bg-primary-bg px-3 py-3 text-[13px] font-bold text-primary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Mis Proyectos
          </Link>
        </nav>
      </aside>
    </>
  )
}
