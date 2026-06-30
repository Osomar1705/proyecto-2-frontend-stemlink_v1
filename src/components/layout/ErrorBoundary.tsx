import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Button } from '../ui/Button'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled render error', error, errorInfo)
  }

  private resetBoundary = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.10),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_52%,_#f8fafc_100%)]" />
          <div className="w-full max-w-lg rounded-[2rem] border border-border/70 bg-surface/95 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-surface shadow-lg">
              !
            </div>
            <h2 className="text-2xl font-bold text-text">Algo salió mal</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Ocurrió un error inesperado en la interfaz. Puedes intentar recuperar esta vista o recargar la aplicación.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button variant="secondary" onClick={this.resetBoundary}>Intentar de nuevo</Button>
              <Button onClick={() => window.location.reload()}>Recargar página</Button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
