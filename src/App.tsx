import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { Navbar } from './components/layout/Navbar'
import { PrivateRoute } from './components/layout/PrivateRoute'
import { PublicRoute } from './components/layout/PublicRoute'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { Spinner } from './components/ui/Spinner'

const LoginPage         = lazy(() => import('./pages/LoginPage'))
const RegisterPage      = lazy(() => import('./pages/RegisterPage'))
const DashboardPage     = lazy(() => import('./pages/DashboardPage'))
const MentorsPage       = lazy(() => import('./pages/MentorsPage'))
const MentorDetailPage  = lazy(() => import('./pages/MentorDetailPage'))
const SessionsPage      = lazy(() => import('./pages/SessionsPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const MentorProfilePage = lazy(() => import('./pages/MentorProfilePage'))
const LandingPage       = lazy(() => import('./pages/LandingPage'))
const NotFoundPage      = lazy(() => import('./pages/NotFoundPage'))

function PageLoader() {
  return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-surface">
            <Navbar />
            <main>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                  <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                  <Route path="/mentors" element={<MentorsPage />} />
                  <Route path="/mentors/:id" element={<MentorDetailPage />} />

                  <Route path="/dashboard" element={
                    <PrivateRoute><DashboardPage /></PrivateRoute>
                  } />
                  <Route path="/sessions" element={
                    <PrivateRoute><SessionsPage /></PrivateRoute>
                  } />
                  <Route path="/notifications" element={
                    <PrivateRoute><NotificationsPage /></PrivateRoute>
                  } />
                  <Route path="/mentor/profile" element={
                    <PrivateRoute role="MENTOR"><MentorProfilePage /></PrivateRoute>
                  } />

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
          </div>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}
