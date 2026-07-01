[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/jafzw1cC)

# STEM Link Web

Aplicación web para conectar estudiantes con mentores STEM, revisar perfiles y disponibilidad, reservar mentorías y dar seguimiento a sesiones y notificaciones. Este repositorio contiene el frontend web del Proyecto 2 de CS2031 - Desarrollo Basado en Plataformas.

## Enlaces de entrega

| Recurso | URL |
| --- | --- |
| Aplicación web | **https://proyecto-2-frontend-stemlink-v1.vercel.app/** |
| Demo de búsqueda y query params | **https://proyecto-2-frontend-stemlink-v1.vercel.app/mentors?page=0&search=osman** |
| Backend REST | https://stem-link-app-1.onrender.com |
| Repositorio evaluable de GitHub Classroom | https://github.com/CS2031-DBP/proyecto-2-frontend-stemlink |
| Repositorio externo de desarrollo | https://github.com/Osomar1705/proyecto-2-frontend-stemlink_v1 |

> **Importante para la evaluación:** si el desarrollo se realiza en un repositorio externo, ese trabajo debe estar enlazado y sincronizado con el repositorio de GitHub Classroom. Solo se calificarán los repositorios **frontend** y **mobile** de GitHub Classroom. Este clon ya tiene configurado el remoto `classroom` para el repositorio evaluable.

## Funcionalidades

- registro, inicio de sesión, cierre de sesión y rutas protegidas por autenticación y rol
- descubrimiento de mentores con búsqueda debounced, filtros por habilidades y URL compartible
- perfil detallado del mentor, disponibilidad y creación de reservas
- dashboard con resumen de actividad
- gestión y filtrado de reservas y sesiones
- envío de feedback de una sesión
- notificaciones paginadas y marcado como leído
- edición de perfil de estudiante o mentor, redes, habilidades y horarios
- estados de carga con skeletons/spinners, estados vacíos, reintentos y mensajes amigables
- diseño responsive y navegación accesible con breadcrumbs, labels y controles de teclado

## Stack

- React 19 + TypeScript
- Vite 8
- React Router 7 con rutas lazy
- Axios con cliente e interceptores centralizados
- React Hook Form + Zod
- Tailwind CSS 4
- React Hot Toast y Lucide React
- Vercel para el despliegue SPA

## Arquitectura

```text
src/
├── api/          cliente Axios y módulos por recurso
├── app/          router y layouts raíz
├── components/   componentes reutilizables de UI, layout y mentores
├── contexts/     estado global de autenticación
├── hooks/        carga asíncrona, debounce y paginación
├── pages/        vistas y coordinación de cada flujo
├── types/        contratos TypeScript de requests y responses
└── utils/        errores, sesión y recursos de perfil
```

El flujo de datos es `page/hook -> módulo API -> cliente Axios -> backend`. Las páginas coordinan los casos de uso; los componentes de UI no conocen el transporte. `AuthContext` mantiene el estado global de sesión.

### Integración con la API

`src/api/client.ts` centraliza:

- `baseURL`, timeout, `Accept` y `Content-Type`
- token `Bearer` mediante interceptor de request
- renovación del token ante `401` y cierre de sesión si falla
- retry con backoff para `GET` ante red, `408`, `429` y errores `5xx` recuperables
- serialización consistente de query params
- soporte de `AbortSignal`; los hooks cancelan requests al desmontarse o cambiar dependencias

Las funcionalidades core consumen el backend. Los módulos implementan `GET`, `POST`, `PATCH` y `DELETE`; no se usan colecciones locales como fuente de verdad.

### Routing

| Tipo | Rutas |
| --- | --- |
| Públicas | `/`, `/mentors`, `/mentors/:id`, `/login`, `/register` |
| Autenticadas | `/dashboard`, `/sessions`, `/notifications`, `/profile` |
| Solo mentor | `/mentor/profile` |
| Fallback | `*` (404) |

Todas las páginas se cargan bajo demanda. El listado de mentores usa parámetros como `?page=0&size=10&search=osman`, y la ruta `/mentors/:id` demuestra routing dinámico.

### Paginación

Los listados de mentores, reservas y notificaciones consumen respuestas paginadas del backend. El control compartido permite:

- anterior, siguiente y números de página
- tamaños de 10, 25, 50 o 100 resultados
- rango visible y total de resultados
- persistencia de `page` y `size` en query params

## Ejecución local

### Requisitos

- Node.js 20 o superior
- npm 10 o superior
- backend accesible

### Instalación

```bash
git clone https://github.com/CS2031-DBP/proyecto-2-frontend-stemlink.git
cd proyecto-2-frontend-stemlink
npm ci
cp .env.example .env
npm run dev
```

La aplicación quedará disponible en la URL que muestre Vite, normalmente `http://localhost:5173`.

### Variable de entorno

```env
VITE_API_BASE_URL=https://stem-link-app-1.onrender.com
```

No se deben versionar secretos ni tokens. `VITE_API_BASE_URL` también debe configurarse en Vercel. El token de sesión se guarda en `sessionStorage` y se elimina al cerrar sesión. El cliente de renovación usa `withCredentials` y actualiza el token con la respuesta del backend.

## Comandos de calidad

```bash
npm ci          # instalación reproducible desde package-lock.json
npm run dev     # servidor de desarrollo
npm run build   # type-check y bundle optimizado de producción
npm run lint    # análisis estático con oxlint
npm run preview # previsualización local del build
```

Antes de entregar, `npm run build` y `npm run lint` deben terminar sin errores.

## Cobertura de la rúbrica web

| Criterio | Evidencia en el repositorio |
| --- | --- |
| Integración backend | `src/api/client.ts`, interceptores y módulos en `src/api/` |
| Arquitectura React | componentes reutilizables, `AuthContext` y hooks en `src/hooks/` |
| Routing | router central, rutas dinámicas, query params, guards, lazy loading y 404 |
| Errores y validación | `ErrorBoundary`, `AsyncContent`, `utils/errors.ts`, React Hook Form y Zod |
| UI/UX | Tailwind responsive, skeletons, toasts, breadcrumbs, filtros y empty states |
| Vistas | landing, login, registro, dashboard, listados, detalle y perfiles editables |
| Paginación | mentores, reservas y notificaciones con tamaño configurable y estado en URL |
| Deployment | SPA en Vercel mediante `vercel.json` y API configurada por entorno |

## Despliegue

Vercel construye la aplicación con `npm run build`. `vercel.json` reescribe las rutas hacia `index.html`, por lo que las URLs profundas funcionan al recargar. La rama desplegada debe contener las mismas revisiones que `classroom/main`.

Comprobación rápida:

1. abrir https://proyecto-2-frontend-stemlink-v1.vercel.app/
2. abrir https://proyecto-2-frontend-stemlink-v1.vercel.app/mentors?page=0&search=osman
3. iniciar sesión y verificar dashboard, reservas, sesiones, notificaciones y perfiles
4. confirmar que no existan errores de CORS ni requests fallidos en DevTools

## Preparación de la exposición

El guion y checklist de demo están en [`docs/DEMO.md`](docs/DEMO.md). Conviene precargar usuarios, mentores, reservas y notificaciones antes de exponer para evitar esperas durante la demo.
