import Layout from '../components/Layout.jsx'

export default function Perfil() {
  return (
    <Layout title="Mi Perfil">
      <div className="rounded-lg border border-border bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#D9DEE3] text-lg font-bold text-ink-secondary">
          CS
        </div>
        <h2 className="mb-1 text-lg font-bold text-ink">Christian Suárez</h2>
        <p className="mb-6 text-sm text-ink-muted">csuarez · Rol: ADMIN</p>
        <p className="text-xs text-ink-faint">
          Pantalla en construcción — aquí irán los datos reales del usuario
          una vez conectado el backend.
        </p>
      </div>
    </Layout>
  )
}
