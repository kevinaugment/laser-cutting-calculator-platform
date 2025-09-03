import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from './alert';
import { Button } from './button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

// 错误类型定义
export interface ErrorDetails {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  timestamp: number;
  userAgent: string;
  url: string;
}

// 错误边界属性
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'section';
  name?: string;
}

// 错误边界状态
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

// 错误边界组件
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo
    });

    // 记录错误详情
    const errorDetails: ErrorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.name || 'Unknown',
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // 发送错误报告
    this.reportError(errorDetails);

    // 调用外部错误处理器
    this.props.onError?.(error, errorInfo);

    // 开发环境下打印详细错误信息
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Error Details:', errorDetails);
      console.groupEnd();
    }
  }

  // 报告错误到监控系统
  private reportError(errorDetails: ErrorDetails) {
    // 这里可以集成错误监控服务，如 Sentry, LogRocket 等
    try {
      // 示例：发送到错误监控服务
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: errorDetails.message,
          fatal: false
        });
      }

      // 本地存储错误日志
      const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]');
      errorLog.push(errorDetails);
      
      // 只保留最近50个错误
      if (errorLog.length > 50) {
        errorLog.splice(0, errorLog.length - 50);
      }
      
      localStorage.setItem('errorLog', JSON.stringify(errorLog));
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  // 重置错误状态
  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  // 刷新页面
  private handleRefresh = () => {
    window.location.reload();
  };

  // 返回首页
  private handleGoHome = () => {
    window.location.href = '/';
  };

  // 复制错误信息
  private handleCopyError = () => {
    const { error, errorInfo, errorId } = this.state;
    const errorText = `
Error ID: ${errorId}
Message: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
    `.trim();

    navigator.clipboard.writeText(errorText).then(() => {
      alert('Error details copied to clipboard');
    }).catch(() => {
      console.error('Failed to copy error details');
    });
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, errorId } = this.state;
      const { level = 'component', showDetails = false, name } = this.props;

      // 根据错误级别显示不同的UI
      const getErrorUI = () => {
        switch (level) {
          case 'page':
            return (
              <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full">
                  <div className="text-center">
                    <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      Oops! Something went wrong
                    </h1>
                    <p className="text-gray-600 mb-6">
                      We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
                    </p>
                    
                    <div className="space-y-3">
                      <Button onClick={this.handleRefresh} className="w-full">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Page
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={this.handleGoHome}
                        className="w-full"
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Go to Homepage
                      </Button>
                      
                      {showDetails && (
                        <Button 
                          variant="ghost" 
                          onClick={this.handleCopyError}
                          className="w-full text-sm"
                        >
                          <Bug className="h-4 w-4 mr-2" />
                          Copy Error Details
                        </Button>
                      )}
                    </div>

                    {showDetails && error && (
                      <details className="mt-6 text-left">
                        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                          Technical Details
                        </summary>
                        <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto max-h-40">
                          <div><strong>Error ID:</strong> {errorId}</div>
                          <div><strong>Message:</strong> {error.message}</div>
                          {error.stack && (
                            <div><strong>Stack:</strong><br />{error.stack}</div>
                          )}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            );

          case 'section':
            return (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                      Section Error
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      This section encountered an error and couldn't load properly.
                    </p>
                    <div className="mt-3 flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={this.handleReset}
                      >
                        Try Again
                      </Button>
                      {showDetails && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={this.handleCopyError}
                        >
                          Copy Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );

          default: // component
            return (
              <Alert variant="destructive" className="my-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>Component Error</strong>
                      <br />
                      {name ? `The ${name} component` : 'This component'} encountered an error.
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={this.handleReset}
                      className="ml-4"
                    >
                      Retry
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            );
        }
      };

      return getErrorUI();
    }

    return this.props.children;
  }
}

// 高阶组件：为组件添加错误边界
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook：在函数组件中使用错误边界
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
}

// 错误报告Hook
export function useErrorReporting() {
  const reportError = React.useCallback((error: Error, context?: string) => {
    const errorDetails: ErrorDetails = {
      message: error.message,
      stack: error.stack,
      errorBoundary: context || 'Manual Report',
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // 这里可以发送到错误监控服务
    console.error('Reported Error:', errorDetails);
  }, []);

  return { reportError };
}

export default ErrorBoundary;
