import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../contexts/AuthContext'
import { ErrorBoundary } from '../components/layout/ErrorBoundary'
import { Navbar } from '../components/layout/Navbar'
import { Spinner } from '../components/ui/Spinner'

export function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <Spinner size="lg" />
    </div>
  )
}

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export function RootLayout() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Outlet />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </ErrorBoundary>
    </AuthProvider>
  )
}
