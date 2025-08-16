import React, { Component, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { GlassPanel } from './GlassPanel'
import { Button } from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  retryCount: number
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        retryCount: prevState.retryCount + 1
      }))
    }
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const canRetry = this.state.retryCount < this.maxRetries

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-dark-navy">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <GlassPanel variant="strong" className="text-center p-8 space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center"
              >
                <AlertTriangle size={32} className="text-white" />
              </motion.div>

              <div className="space-y-3">
                <h2 className="text-xl font-bold text-text-primary">
                  Что-то пошло не так
                </h2>
                <p className="text-text-secondary text-sm">
                  {this.state.error?.message || 'Произошла неожиданная ошибка'}
                </p>
                {!canRetry && (
                  <p className="text-red-400 text-xs">
                    Превышено максимальное количество попыток
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {canRetry && (
                  <Button
                    onClick={this.handleRetry}
                    className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Попробовать снова ({this.maxRetries - this.state.retryCount} попыток)
                  </Button>
                )}
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  <Home size={16} className="mr-2" />
                  На главную
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left text-xs text-text-muted">
                  <summary className="cursor-pointer text-text-secondary">
                    Подробности ошибки
                  </summary>
                  <pre className="mt-2 p-2 bg-dark-navy/50 rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </GlassPanel>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    // Could integrate with error reporting service here
  }
}

// Simple error fallback component
export function ErrorFallback({ 
  error, 
  retry, 
  title = "Ошибка загрузки",
  message = "Не удалось загрузить данные" 
}: {
  error?: Error
  retry?: () => void
  title?: string
  message?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-6"
    >
      <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
        <AlertTriangle size={24} className="text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-secondary text-sm mb-4">
        {message}
      </p>
      {retry && (
        <Button onClick={retry} size="sm" variant="outline">
          <RefreshCw size={14} className="mr-2" />
          Повторить
        </Button>
      )}
    </motion.div>
  )
} 