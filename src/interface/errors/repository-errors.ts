/**
 * Errores personalizados para repositorios de Firestore
 * 
 * @packageDocumentation
 */

export class RepositoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public operation: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'RepositoryError';
    Object.setPrototypeOf(this, RepositoryError.prototype);
  }
}

export class DocumentNotFoundError extends RepositoryError {
  constructor(id: string, collection: string) {
    super(
      `Documento con ID '${id}' no encontrado en la colección '${collection}'`,
      'DOCUMENT_NOT_FOUND',
      'getById'
    );
    this.name = 'DocumentNotFoundError';
  }
}

export class ValidationError extends RepositoryError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 'validation');
    this.name = 'ValidationError';
    if (field) {
      this.message = `${message} (campo: ${field})`;
    }
  }
}

export class BatchOperationError extends RepositoryError {
  constructor(message: string, operation: string, public failedItems: number) {
    super(message, 'BATCH_OPERATION_ERROR', operation);
    this.name = 'BatchOperationError';
  }
}

export class DatabaseConnectionError extends RepositoryError {
  constructor(message: string, operation: string) {
    super(message, 'DATABASE_CONNECTION_ERROR', operation);
    this.name = 'DatabaseConnectionError';
  }
}
