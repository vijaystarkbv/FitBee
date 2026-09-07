import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FitBee ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FAFAF8',
            padding: 24,
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: '32px 28px',
              maxWidth: 440,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
              border: '1px solid #E8E8E6',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                fontSize: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              ⚠️
            </div>

            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#1F2937',
                margin: '0 0 8px',
              }}
            >
              Something went wrong
            </h2>

            <p
              style={{
                fontSize: 13,
                color: '#6B7280',
                margin: '0 0 24px',
                lineHeight: 1.5,
              }}
            >
              FitBee encountered a temporary display issue. You can try refreshing the page or retrying.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 14,
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 14,
                  border: 'none',
                  backgroundColor: '#5C8D89',
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(92, 141, 137, 0.3)',
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
