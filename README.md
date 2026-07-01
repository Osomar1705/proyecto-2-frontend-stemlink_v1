[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/jafzw1cC)

# STEM Link Web

Frontend web de STEM Link construido con `Vite + React + TypeScript + Tailwind CSS`.

La app cubre el flujo principal de estudiante y mentor para la rubrica web del Proyecto 2 DBP:

- autenticacion con `sessionStorage`
- routing lazy con `React Router`
- guards publicos/privados por rol
- componentes UI reutilizables
- busqueda con debounce
- paginacion en mentores y notificaciones
- formularios con `react-hook-form + zod`
- estados vacios, skeletons, modales y error boundaries

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
VITE_API_BASE_URL=https://stem-link-app-1.onrender.com
```

El backend actual expone aliases en `/api` y `/api/v1`, asi que este frontend funciona contra la version ya publicada del backend sin cambios extra de rutas.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Rutas principales

Publicas:

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

- `*` -> pagina 404

## Estado actual frente a la rubrica web

Implementado en este repo:

- cliente HTTP centralizado con auth header, cancelacion y retry simple de red
- mas de 10 componentes base reutilizables
- lazy routes + suspense + error boundary
- paginacion reusable en mentores y notificaciones
- dashboard y flujos de estudiante/mentor
- filtros, empty states, skeletons, toasts y validaciones

Pendiente fuera de este repo:

- repo mobile con Expo
- deployment publico integral y pitch/demo final

## Notas de integracion

- El token se persiste en `sessionStorage`.
- Las requests `GET` hacen un reintento automatico corto en fallos de red/5xx transitorios.
- Los arrays en query params se serializan como CSV para filtros tipo `skillIds=1,2`.
