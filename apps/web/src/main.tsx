import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Application Error:', error, errorInfo)
        // Here you could integrate with error reporting service like Sentry
      }}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
) 