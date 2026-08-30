# Frontend — Sistema de Control de Obra (React + Tailwind)

Este es el frontend en React + Vite + Tailwind, con el mismo diseño que
ya validamos, más una capa de `services/` lista para conectarse al
backend de Node.js que estás armando con Gemini.

## Cómo integrarlo a tu proyecto `Suite-saas`

1. Copia esta carpeta completa (`frontend/`) dentro de tu carpeta raíz `Suite-saas`,
   junto a tu carpeta del backend.
2. Si ya tenías una carpeta `frontend-lookahead`, renómbrala a `frontend-viejo`
   (tal como te sugirió Gemini) para no perder tu `api.js` de referencia.
3. Instala dependencias:

```bash
cd Suite-saas/frontend
npm install
npm run dev
```

Abre http://localhost:5173

## Conectar con tu backend de Node

Todas las llamadas al backend están centralizadas en **`src/services/api.js`**.
Por ahora cada función devuelve datos de ejemplo (de `src/data/`). Cuando
tu backend esté listo:

1. Crea un archivo `.env` en la raíz de `frontend/` con:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```
   (ajusta el puerto al que use tu servidor de Node)

2. En `src/services/api.js`, reemplaza el cuerpo de cada función por un
   `fetch()` real. Ya dejé la URL base (`API_URL`) leyendo esa variable
   de entorno y un ejemplo comentado de cómo debería quedar `login()`.

3. Borra los archivos de `src/data/` una vez que ya no los uses — están
   ahí solo como referencia de la forma que deben tener los datos que
   te devuelva la API (mismo formato, mismos nombres de campos).

## Estructura

```
src/
├── main.jsx
├── App.jsx                  rutas (react-router-dom)
├── index.css                  Tailwind + un par de utilidades custom (gradientes)
├── components/
│   ├── Layout.jsx              header + sidebar + contenido
│   ├── Header.jsx
│   ├── Sidebar.jsx              drawer responsive (overlay en mobile, fijo en desktop)
│   ├── ProjectCard.jsx
│   └── AppCard.jsx
├── pages/
│   ├── Login.jsx                 ruta "/"
│   ├── Proyectos.jsx             ruta "/proyectos"
│   ├── Apps.jsx                   ruta "/apps"
│   └── LookAhead.jsx              ruta "/lookahead"
├── services/
│   └── api.js                     ← TODAS las llamadas al backend viven aquí
└── data/
    └── *.js                        datos de ejemplo (borrar cuando conectes la API real)
```

## Sobre el diseño

Los colores, radios y tipografía están definidos como tokens en
`tailwind.config.js` (`primary`, `primary-light`, `ink`, `canvas`, etc.)
en vez de estar sueltos en cada componente — si en algún momento cambian
la paleta de marca, se edita en un solo lugar.

## Responsive

- **Mobile / tablet (`< 1024px`)**: el sidebar es un drawer que se abre
  con el ícono de hamburguesa (overlay oscuro incluido).
- **Desktop (`≥ 1024px`)**: el sidebar queda fijo y visible siempre, el
  ícono de hamburguesa desaparece. Esto se resuelve solo con clases de
  Tailwind (`lg:`), no hay JS extra para eso.
