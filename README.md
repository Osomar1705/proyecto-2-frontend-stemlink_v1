[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/jafzw1cC)

# STEM Link Web

Frontend web de STEM Link desarrollado con `Vite`, `React`, `TypeScript` y `Tailwind CSS`.

STEM Link Web cubre el flujo principal de mentoría para la entrega de Frontend del curso DBP: autenticación, descubrimiento de mentores, detalle de perfil, reservas, notificaciones y perfil de usuario/mentor con una interfaz pensada para demo y exposición.

## Visión General

- experiencia visual limpia, moderna y responsive
- arquitectura modular con componentes reutilizables
- consumo directo del backend como fuente de verdad
- rutas públicas y privadas separadas por rol
- validaciones, estados de carga, empty states y toasts
- paginación y filtros en los listados clave

## Stack

- `React`
- `React Router`
- `Axios`
- `React Hook Form`
- `Zod`
- `React Hot Toast`
- `Tailwind CSS`

## Requisitos

- `Node.js 20+`
- backend STEM Link desplegado y accesible

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=https://stem-link-app-1.onrender.com
```

La app consume el backend desde una base URL centralizada en `src/api/client.ts`.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Rutas

### Públicas

- `/`
- `/mentors`
- `/mentors/:id`
- `/login`
- `/register`

### Privadas

- `/dashboard`
- `/sessions`
- `/notifications`
- `/profile`
- `/mentor/profile`

### Fallback

- `*` -> pagina 404

## Funcionalidades Destacadas

- login y registro con validación client-side
- dashboard con resumen de actividad
- exploración de mentores con búsqueda, filtros y paginación
- detalle de mentor con disponibilidad y reserva
- perfil de usuario con edición visual de foto y enlaces
- perfil de mentor con edición de bio, LinkedIn, Instagram, habilidades y horarios
- modales accesibles con scroll correcto en pantallas pequeñas
- manejo de errores, loading states y reintentos simples para requests transitorios

## Rúbrica Web

Este repositorio cubre los criterios web principales:

- integración con backend y consumo de API
- arquitectura React modular
- routing y navegación
- manejo de errores y estados de carga
- UI/UX consistente y responsive
- vistas diferenciadas con contenido real
- paginación funcional

## Estado del Proyecto

Pendiente fuera de este repositorio:

- repo mobile con Expo
- sensores en mobile
- despliegue integral del stack completo
- presentación final y demo en vivo

## Notas Técnicas

- el token se persiste en `sessionStorage`
- las requests `GET` incluyen retry simple ante fallos transitorios
- los arrays en query params se serializan como CSV
- Vercel debe usar `VITE_API_BASE_URL=https://stem-link-app-1.onrender.com`

## Deploy

El frontend está preparado para Vercel con rewrite a SPA en `vercel.json`.

Si cambias el repo conectado en Vercel, un push a `main` debe disparar el redeploy automático.
