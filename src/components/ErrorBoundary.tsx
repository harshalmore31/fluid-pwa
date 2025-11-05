'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component for catching and handling React errors
 *
 * Provides graceful error handling with custom fallback UI and error reporting
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, errorInfo, reset) => (
 *     <div>
 *       <h2>Something went wrong</h2>
 *       <button onClick={reset}>Try again</button>
 *     </div>
 *   )}
 *   onError={(error, errorInfo) => {
 *     console.error('Error caught:', error, errorInfo);
 *     // Send to error tracking service
 *   }}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error && errorInfo) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, errorInfo, this.reset);
      }

      // Default fallback UI
      return (
        <div
          className="min-h-screen flex items-center justify-center p-4 bg-gray-50"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8 border border-red-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-600 mb-4">
                  We encountered an unexpected error. Please try refreshing the page or contact
                  support if the problem persists.
                </p>

                {process.env.NODE_ENV === 'development' && (
                  <details className="mb-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      Error Details (Development Only)
                    </summary>
                    <div className="mt-3 p-4 bg-gray-100 rounded-md overflow-auto">
                      <pre className="text-xs text-red-800 whitespace-pre-wrap">
                        <strong>Error:</strong> {error.toString()}
                        {'\n\n'}
                        <strong>Component Stack:</strong>
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  </details>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={this.reset}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * Hook-based error boundary wrapper (requires React 18+)
 *
 * @example
 * ```tsx
 * function MyApp() {
 *   return (
 *     <ErrorBoundaryWrapper>
 *       <App />
 *     </ErrorBoundaryWrapper>
 *   );
 * }
 * ```
 */
export function ErrorBoundaryWrapper({
  children,
  ...props
}: Omit<ErrorBoundaryProps, 'children'> & { children: ReactNode }) {
  return <ErrorBoundary {...props}>{children}</ErrorBoundary>;
}

export default ErrorBoundary;
