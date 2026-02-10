import { Component, ErrorInfo, ReactNode } from 'react';
import { Sentry } from '../lib/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Send error to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-900 mb-4">
              ⚠️ Coś poszło nie tak
            </h1>
            <p className="text-red-800 mb-4">
              Wystąpił nieoczekiwany błąd. Został on zgłoszony i pracujemy nad rozwiązaniem.
            </p>
            <div className="bg-red-100 p-4 rounded mb-4">
              <code className="text-sm text-red-900">
                {this.state.error?.message}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 font-bold"
            >
              Odśwież stronę
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


