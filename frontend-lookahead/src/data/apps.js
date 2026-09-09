// Datos de ejemplo — reemplaza por GET /api/proyectos/:id/apps
export const apps = [
  {
    id: 'last-planner',
    title: 'LookAhead',
    subtitle: 'Gestión del Cronograma',
    enabled: true,
    route: '/lookahead',
  },
  {
    id: 'registro-fotografico',
    title: 'Registro Fotográfico',
    subtitle: 'Comunicación',
    enabled: true,
    route: '/registro-fotografico', // Esta es la ruta que usaremos
  },
  {
    id: 'presupuesto',
    title: 'Control de Presupuesto',
    subtitle: null,
    enabled: false,
    route: null,
  },
  {
    id: 'wbs',
    title: 'WBS / EDT Dinámico',
    subtitle: null,
    enabled: false,
    route: null,
  },
]
