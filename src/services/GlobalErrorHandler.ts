
import { errorHandlingService } from './ErrorHandlingService';

export type ErrorCategory = 'circuit' | 'sdk' | 'simulation' | 'system';

export interface ErrorContext {
  category: ErrorCategory;
  userAction?: string;
  circuitState?: any;
  sdkVersion?: string;
  browserInfo?: {
    userAgent: string;
    viewport: string;
    url: string;
  };
}

class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  constructor() {
    // Set up global error handlers
    this.setupGlobalHandlers();
  }

  private setupGlobalHandlers() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event.error, 'system', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError(new Error(event.reason), 'system', {
        promiseRejection: true,
        reason: event.reason
      });
    });
  }

  handleCircuitError(error: Error, context?: any) {
    return this.handleCategorizedError(error, 'circuit', context);
  }

  handleSDKError(error: Error, context?: any) {
    return this.handleCategorizedError(error, 'sdk', context);
  }

  handleSimulationError(error: Error, context?: any) {
    return this.handleCategorizedError(error, 'simulation', context);
  }

  handleSystemError(error: Error, context?: any) {
    return this.handleCategorizedError(error, 'system', context);
  }

  private handleCategorizedError(error: Error, category: ErrorCategory, additionalContext?: any) {
    const severity = this.determineSeverity(error, category);
    const context = this.buildContext(category, additionalContext);

    return errorHandlingService.addError({
      type: this.mapCategoryToType(category),
      severity,
      message: error.message || 'Unknown error occurred',
      cause: error.stack || error.toString(),
      possibleFix: this.suggestFix(error, category),
      context: {
        ...context,
        category,
        originalError: error.name,
        errorDetails: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      }
    });
  }

  private handleGlobalError(error: Error, category: ErrorCategory, additionalContext?: any) {
    console.error('Global error caught:', error);
    this.handleCategorizedError(error, category, additionalContext);
  }

  private determineSeverity(error: Error, category: ErrorCategory) {
    if (category === 'system' || error.message.includes('critical')) {
      return 'critical' as const;
    }
    if (category === 'simulation' && error.message.includes('timeout')) {
      return 'warning' as const;
    }
    if (category === 'circuit' && error.message.includes('configuration')) {
      return 'warning' as const;
    }
    return 'critical' as const;
  }

  private mapCategoryToType(category: ErrorCategory) {
    switch (category) {
      case 'circuit':
        return 'circuit' as const;
      case 'sdk':
        return 'backend' as const;
      case 'simulation':
        return 'runtime' as const;
      case 'system':
        return 'runtime' as const;
      default:
        return 'runtime' as const;
    }
  }

  private suggestFix(error: Error, category: ErrorCategory): string {
    switch (category) {
      case 'circuit':
        if (error.message.includes('qubit')) {
          return 'Check qubit indices are within valid range (0 to register size - 1)';
        }
        if (error.message.includes('gate')) {
          return 'Verify gate configuration and required parameters';
        }
        return 'Review your circuit design and gate connections';
        
      case 'sdk':
        return 'Verify SDK configuration and API credentials';
        
      case 'simulation':
        return 'Try reducing circuit complexity or check simulation parameters';
        
      case 'system':
        if (error.message.includes('network')) {
          return 'Check your internet connection and try again';
        }
        return 'Try refreshing the page or contact support if the issue persists';
        
      default:
        return 'Please check the console for more details or contact support';
    }
  }

  private buildContext(category: ErrorCategory, additionalContext?: any): ErrorContext {
    return {
      category,
      browserInfo: {
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href
      },
      ...additionalContext
    };
  }
}

export const globalErrorHandler = GlobalErrorHandler.getInstance();
