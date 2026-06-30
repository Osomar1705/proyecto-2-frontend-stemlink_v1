import { createBrowserRouter } from 'react-router-dom'
import { AuthenticatedLayout } from '../components/layout/AuthenticatedLayout'
import { PrivateRoute } from '../components/layout/PrivateRoute'
import { PublicRoute } from '../components/layout/PublicRoute'
import { PublicLayout, RootLayout, RouteLoading } from './RootLayout'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    HydrateFallback: RouteLoading,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            index: true,
            handle: { title: 'Inicio' },
            lazy: async () => {
              const module = await import('../pages/LandingPage')
              return { Component: module.default }
            },
          },
          {
            path: 'mentors',
            handle: { title: 'Mentores' },
            lazy: async () => {
              const module = await import('../pages/MentorsPage')
              return { Component: module.default }
            },
          },
          {
            path: 'mentors/:id',
            handle: { title: 'Detalle del mentor' },
            lazy: async () => {
              const module = await import('../pages/MentorDetailPage')
              return { Component: module.default }
            },
          },
        ],
      },
      {
        path: 'login',
        handle: { title: 'Iniciar sesión' },
        lazy: async () => {
          const module = await import('../pages/LoginPage')

          return {
            Component() {
              return (
                <PublicRoute>
                  <module.default />
                </PublicRoute>
              )
            },
          }
        },
      },
      {
        path: 'register',
        handle: { title: 'Registro' },
        lazy: async () => {
          const module = await import('../pages/RegisterPage')

          return {
            Component() {
              return (
                <PublicRoute>
                  <module.default />
                </PublicRoute>
              )
            },
          }
        },
      },
      {
        path: '/',
        element: (
          <PrivateRoute>
            <AuthenticatedLayout />
          </PrivateRoute>
        ),
        children: [
          {
            path: 'dashboard',
            handle: { title: 'Inicio' },
            lazy: async () => {
              const module = await import('../pages/DashboardPage')
              return { Component: module.default }
            },
          },
          {
            path: 'sessions',
            handle: { title: 'Sesiones' },
            lazy: async () => {
              const module = await import('../pages/SessionsPage')
              return { Component: module.default }
            },
          },
          {
            path: 'notifications',
            handle: { title: 'Notificaciones' },
            lazy: async () => {
              const module = await import('../pages/NotificationsPage')
              return { Component: module.default }
            },
          },
          {
            path: 'profile',
            handle: { title: 'Mi perfil' },
            lazy: async () => {
              const module = await import('../pages/ProfilePage')
              return { Component: module.default }
            },
          },
          {
            path: 'mentor/profile',
            handle: { title: 'Mi perfil' },
            lazy: async () => {
              const module = await import('../pages/MentorProfilePage')

              return {
                Component() {
                  return (
                    <PrivateRoute role="MENTOR">
                      <module.default />
                    </PrivateRoute>
                  )
                },
              }
            },
          },
        ],
      },
      {
        path: '*',
        handle: { title: 'Página no encontrada' },
        lazy: async () => {
          const module = await import('../pages/NotFoundPage')
          return { Component: module.default }
        },
      },
    ],
  },
])
