import Layout from '../components/Layout.jsx'

export default function Soporte() {
  return (
    <Layout title="Soporte">
      <div className="rounded-lg border border-border bg-surface p-8 text-center">
        <h2 className="mb-2 text-lg font-bold text-ink">¿Necesitas ayuda?</h2>
        <p className="mb-6 text-sm text-ink-muted">
          Pantalla en construcción — define aquí si va a ser un formulario,
          un correo de contacto, o un chat.
        </p>
        <a
          href="mailto:soporte@indexcorp.com"
          className="btn-gradient inline-flex h-[42px] items-center justify-center rounded-md px-6 text-[13px] font-bold text-white"
        >
          Escribir a soporte@indexcorp.com
        </a>
      </div>
    </Layout>
  )
}
