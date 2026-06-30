# STEM Link Web

Frontend web de STEM Link construido con `Vite + React + TypeScript + Tailwind CSS`.

La app cubre el flujo principal de estudiante y mentor para la rúbrica web del Proyecto 2 DBP:

- autenticación con `sessionStorage`
- routing lazy con `React Router`
- guards públicos/privados por rol
- componentes UI reutilizables
- búsqueda con debounce
- paginación en mentores y notificaciones
- formularios con `react-hook-form + zod`
- estados vacíos, skeletons, modales y error boundaries

## Stack

- `react`
- `react-router-dom`
- `axios`
- `react-hook-form`
- `zod`
- `react-hot-toast`
- `tailwindcss`

## Requisitos

- `Node.js 20+`
- backend STEM Link levantado y accesible

## Variables de entorno

Crea `.env`:

```env
VITE_API_BASE_URL=http://localhost:8082
```

Si el backend se unifica a `/api/v1`, el frontend ya soporta query params paginados y `skillIds` serializado como `1,2,3`; solo habría que alinear las rutas del backend expuesto.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Rutas principales

Públicas:

- `/`
- `/mentors`
- `/mentors/:id`
- `/login`
- `/register`

Privadas:

- `/dashboard`
- `/sessions`
- `/notifications`
- `/profile`
- `/mentor/profile`

Fallback:

- `*` → página 404

## Estado actual frente a la rúbrica web

Implementado en este repo:

- cliente HTTP centralizado con auth header, cancelación y retry simple de red
- más de 10 componentes base reutilizables
- lazy routes + suspense + error boundary
- paginación reusable en mentores y notificaciones
- dashboard y flujos de estudiante/mentor
- filtros, empty states, skeletons, toasts y validaciones

Pendiente fuera de este repo:

- backend definitivo con CORS de producción y rutas finales `/api/v1`
- endpoint paginado de bookings si el backend lo exige
- repo mobile con Expo
- deployment público integral y pitch/demo final

## Notas de integración

- El token se persiste en `sessionStorage`.
- Las requests `GET` hacen un reintento automático corto en fallos de red/5xx transitorios.
- Los arrays en query params se serializan como CSV para filtros tipo `skillIds=1,2`.
