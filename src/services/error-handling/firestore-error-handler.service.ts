import { ILogger } from '../../interface/logging.interface';
import { 
  RepositoryError, 
  DocumentNotFoundError, 
  ValidationError,
  BatchOperationError,
  FirestoreConnectionError 
} from '../../interface/errors/repository-errors';
import { FirestoreError } from 'firebase/firestore';

/**
 * Servicio especializado para manejo de errores de Firestore
 * 
 * @packageDocumentation
 */
export interface ErrorHandlerOptions {
  enableLogging?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export class FirestoreErrorHandlerService {
  private readonly logger: ILogger;
  private readonly enableLogging: boolean;
  private readonly maxRetries: number;
  private readonly retryDelay: number;

  constructor(logger: ILogger, options: ErrorHandlerOptions = {}) {
    this.logger = logger;
    this.enableLogging = options.enableLogging ?? true;
    this.maxRetries = options.maxRetries ?? 3;
    this.retryDelay = options.retryDelay ?? 1000;
  }

  /**
   * Mapea errores de Firestore a errores personalizados
   */
  private mapFirestoreError(error: FirestoreError, operation: string, context?: Record<string, any>): RepositoryError {
    const errorMap: Record<string, { message: string; errorClass: new (message: string, operation: string, ...args: any[]) => RepositoryError }> = {
      'permission-denied': {
        message: 'No tienes permisos para realizar esta operación',
        errorClass: RepositoryError
      },
      'unavailable': {
        message: 'El servicio no está disponible. Intenta nuevamente',
        errorClass: FirestoreConnectionError
      },
      'not-found': {
        message: 'El documento o colección no existe',
        errorClass: DocumentNotFoundError
      },
      'already-exists': {
        message: 'El documento ya existe',
        errorClass: RepositoryError
      },
      'resource-exhausted': {
        message: 'Se excedió el límite de recursos',
        errorClass: RepositoryError
      },
      'failed-precondition': {
        message: 'La operación falló debido a una condición previa',
        errorClass: RepositoryError
      },
      'aborted': {
        message: 'La operación fue abortada',
        errorClass: RepositoryError
      },
      'out-of-range': {
        message: 'Operación fuera de rango válido',
        errorClass: ValidationError
      },
      'unimplemented': {
        message: 'Operación no implementada',
        errorClass: RepositoryError
      },
      'internal': {
        message: 'Error interno del servidor',
        errorClass: RepositoryError
      },
      'data-loss': {
        message: 'Pérdida de datos irrecuperable',
        errorClass: RepositoryError
      },
      'unauthenticated': {
        message: 'Debes autenticarte para realizar esta operación',
        errorClass: RepositoryError
      }
    };

    const errorInfo = errorMap[error.code] || {
      message: error.message || 'Error desconocido en la operación',
      errorClass: RepositoryError
    };

    return new errorInfo.errorClass(
      errorInfo.message,
      error.code || 'UNKNOWN_ERROR',
      operation,
      error
    );
  }

  /**
   * Maneja errores y los convierte en errores personalizados
   */
  handleError(error: unknown, operation: string, context?: Record<string, any>): never {
    if (error instanceof RepositoryError) {
      throw error;
    }

    const firestoreError = error as FirestoreError;
    const errorContext = {
      operation,
      ...context
    };

    if (this.enableLogging) {
      this.logger.error(
        `Error en operación '${operation}'`,
        firestoreError,
        errorContext
      );
    }

    const mappedError = this.mapFirestoreError(firestoreError, operation, context);
    throw mappedError;
  }

  /**
   * Valida que un ID no esté vacío
   */
  validateId(id: string, operation: string): void {
    if (!id || id.trim() === '') {
      throw new ValidationError('El ID del documento no puede estar vacío', 'id');
    }
  }

  /**
   * Valida datos antes de crear o actualizar
   */
  validateData(data: any, operation: string): void {
    if (!data || Object.keys(data).length === 0) {
      throw new ValidationError('Los datos no pueden estar vacíos');
    }
  }

  /**
   * Ejecuta una operación con reintentos en caso de errores transitorios
   */
  async executeWithRetry<R>(
    operation: () => Promise<R>,
    operationName: string,
    currentRetry = 0
  ): Promise<R> {
    try {
      return await operation();
    } catch (error) {
      const firestoreError = error as FirestoreError;
      const retryableCodes = ['unavailable', 'deadline-exceeded', 'resource-exhausted'];

      if (
        currentRetry < this.maxRetries &&
        firestoreError.code &&
        retryableCodes.includes(firestoreError.code)
      ) {
        const delay = this.retryDelay * Math.pow(2, currentRetry); // Backoff exponencial

        if (this.enableLogging) {
          this.logger.warn(
            `Reintentando operación '${operationName}' (intento ${currentRetry + 1}/${this.maxRetries})`,
            { delay, error: firestoreError.code }
          );
        }

        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeWithRetry(operation, operationName, currentRetry + 1);
      }

      throw error;
    }
  }

  /**
   * Crea un error de batch operation
   */
  createBatchError(message: string, operation: string, failedItems: number): BatchOperationError {
    return new BatchOperationError(message, operation, failedItems);
  }
}

/**
 * Factory para crear instancias del manejador de errores
 */
export const createFirestoreErrorHandler = (
  logger: ILogger,
  options?: ErrorHandlerOptions
): FirestoreErrorHandlerService => {
  return new FirestoreErrorHandlerService(logger, options);
};