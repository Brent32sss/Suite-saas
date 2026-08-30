// Datos de ejemplo — reemplaza por GET /api/proyectos/:id/lookahead
export const days = [
  { date: '17-AGO', label: 'LUN', isToday: false },
  { date: '18-AGO', label: 'MAR', isToday: false },
  { date: '19-AGO', label: 'MIÉ', isToday: false },
  { date: '20-AGO', label: 'JUE (HOY)', isToday: true },
]

export const lookAheadRows = [
  { type: 'group', ind: '4', description: 'CIMENTACIÓN' },
  {
    type: 'task',
    ind: '4.1',
    description: 'EXCAVACIÓN LOCALIZADA',
    zones: [null, null, null, null],
  },
  {
    type: 'task',
    ind: '4.5',
    description: 'SOLADOS DE CONCRETO',
    zones: [null, { code: 'Z7', color: 'purple' }, { code: 'Z8', color: 'green' }, null],
  },
  {
    type: 'task',
    ind: '4.6',
    description: 'ACERO EN ZAPATAS',
    zones: [
      { code: 'Z9', color: 'green' },
      { code: 'Z5', color: 'blue' },
      { code: 'Z5', color: 'blue' },
      { code: 'Z6', color: 'gray' },
    ],
  },
]
