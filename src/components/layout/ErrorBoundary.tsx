import { Component } from 'react'
import type { ReactNode } from 'react'
import { Button } from '../ui/Button'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-text">Algo salió mal</h2>
            <p className="text-muted">Ocurrió un error inesperado.</p>
            <Button onClick={() => window.location.reload()}>Recargar página</Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
