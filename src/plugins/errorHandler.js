import { ErrorHandler } from '../services/errorHandlingService';

export default {
  install: (app) => {
    app.config.errorHandler = async (error, vm, info) => {
      ErrorHandler.handleError(error, {
        componentName: vm?.$options?.name,
        errorInfo: info,
        componentData: vm?.$data
      });
    };

    window.addEventListener('unhandledrejection', async (event) => {
      ErrorHandler.handleError(event.reason, {
        type: 'unhandledRejection'
      });
    });

    window.addEventListener('error', async (event) => {
      ErrorHandler.handleError(event.error, {
        type: 'globalError',
        fileName: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno
      });
    });
  }
};
