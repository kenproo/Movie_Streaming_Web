import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '400px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              width: '100%',
              background: 'rgba(30, 41, 59, 0.4)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                marginBottom: '20px',
              }}
            >
              <AlertCircle size={32} />
            </div>

            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                margin: '0 0 8px 0',
                color: '#f8fafc',
              }}
            >
              Đã có lỗi xảy ra ở giao diện
            </h2>

            <p
              style={{
                fontSize: '14px',
                color: '#94a3b8',
                lineHeight: 1.5,
                margin: '0 0 20px 0',
              }}
            >
              Ứng dụng gặp sự cố xử lý giao diện cục bộ. Vui lòng bấm Tải lại trang.
            </p>

            {this.state.error && (
              <pre
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: '#fda4af',
                  fontFamily: 'monospace',
                  textAlign: 'left',
                  overflowX: 'auto',
                  maxHeight: '120px',
                  margin: '0 0 24px 0',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {this.state.error.message}
              </pre>
            )}

            <button
              onClick={this.handleReload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(to right, #ef4444, #dc2626)',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <RefreshCw size={16} />
              Tải lại trang
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
export default ErrorBoundary
