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
        <div className="flex min-h-screen items-center justify-center bg-surface-alt px-4 py-8">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 text-center shadow-lg">
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
