# Guion de exposición y demo

Guion de 20 minutos alineado con la rúbrica del Proyecto 2. Cada integrante debe poder explicar tanto el flujo funcional como el código que lo implementa.

## 1. Gancho y problema — 3 minutos

Abrir con una situación concreta: un estudiante necesita resolver un bloqueo técnico, pero no sabe qué mentor domina la habilidad, cuándo está disponible ni cómo reservar una sesión.

Explicar brevemente:

- a quién afecta el problema
- qué fricción existe hoy
- por qué un directorio con reserva y seguimiento aporta valor

## 2. Solución — 4 minutos

Presentar STEM Link como una plataforma que permite descubrir mentores, filtrar por habilidades, revisar disponibilidad, reservar y dar seguimiento a la mentoría.

Usar capturas o mockups para enumerar las funciones; reservar la aplicación real para la demo.

## 3. Arquitectura — 2 minutos

Explicar el flujo `React -> Axios -> API REST -> base de datos` y señalar:

- páginas, componentes y hooks separados
- `AuthContext` para estado global
- cliente Axios con token, refresh, retry y cancelación
- React Router con guards, rutas dinámicas y lazy loading
- variables de entorno en Vercel

## 4. Demo en vivo — 6 minutos

Preparar datos antes de comenzar. Flujo sugerido:

1. abrir la landing desplegada
2. entrar al listado con `?page=0&search=osman`
3. cambiar búsqueda, habilidad, página y tamaño; mostrar que la URL conserva el estado
4. abrir `/mentors/:id`, revisar perfil y disponibilidad
5. iniciar sesión con una cuenta ya creada
6. crear una reserva y mostrar la confirmación
7. revisar dashboard, sesiones y notificaciones
8. editar un perfil; con rol mentor, mostrar habilidades y disponibilidad
9. mostrar brevemente responsive mobile desde DevTools

## 5. Preguntas — 5 minutos

Todos deben saber ubicar y explicar:

- `src/api/client.ts`: interceptores, refresh, retry y `AbortSignal`
- `src/app/router.tsx`: lazy loading, guards, parámetros y 404
- `src/hooks/useAsyncResource.ts`: loading, error, cancelación y reload
- `src/hooks/usePagination.ts`: query params y tamaño de página
- formularios: React Hook Form, Zod y prevención de doble envío
- diferencia entre estado del backend, contexto global y estado local
- motivo de usar `sessionStorage` y limitaciones de seguridad en una SPA

## Checklist antes de presentar

- [ ] `npm ci`, `npm run build` y `npm run lint` pasan
- [ ] Vercel responde en la raíz y en rutas profundas
- [ ] backend despierto y endpoint de mentores disponible
- [ ] login y refresh token verificados en producción
- [ ] CORS sin errores desde el dominio de Vercel
- [ ] cuentas de estudiante y mentor preparadas
- [ ] mentores, reservas, sesiones y notificaciones precargados
- [ ] flujo principal ensayado con cronómetro
- [ ] plan alternativo con video o capturas si falla la red
- [ ] cambios sincronizados con los repositorios frontend y mobile de Classroom
