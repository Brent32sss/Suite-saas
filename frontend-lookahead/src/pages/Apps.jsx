import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import AppCard from '../components/AppCard.jsx'
import { getProjectApps } from '../services/api.js'

export default function Apps() {
  const navigate = useNavigate()
  const [apps, setApps] = useState([])

  useEffect(() => {
    getProjectApps('PROY0001').then(setApps)
  }, [])

  return (
    <Layout title="MAR ABIERTO">
      <div className="mb-1 flex items-center gap-3">
        <button
          onClick={() => navigate('/proyectos')}
          aria-label="Volver"
          className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-border bg-surface"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2">
            <path d="M15 5 L8 12 L15 19" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-ink">Aplicaciones Disponibles</h1>
      </div>
      <p className="mb-5 text-[11.5px] text-ink-muted">
        Proyecto: <strong className="text-primary">MAR ABIERTO</strong>
      </p>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] lg:gap-6">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </Layout>
  )
}
