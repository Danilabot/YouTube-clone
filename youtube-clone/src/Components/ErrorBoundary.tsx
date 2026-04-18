import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, textAlign: 'center' }}>
          <h2>Что-то пошло не так</h2>
          <p style={{ color: '#888', marginTop: 8 }}>{this.state.error.message}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16 }}>
            Перезагрузить
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
