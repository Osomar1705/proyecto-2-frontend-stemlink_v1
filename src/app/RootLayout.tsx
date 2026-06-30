import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../contexts/AuthContext'
import { ErrorBoundary } from '../components/layout/ErrorBoundary'

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
