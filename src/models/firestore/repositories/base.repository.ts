import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Firestore,
  DocumentData,
  QueryConstraint,
  WithFieldValue,
  writeBatch
} from 'firebase/firestore';

import { ILogger } from '@interface/logging.interface';
import { createLogger } from '@services/logging/console-logger.service';
import { createFirestoreErrorHandler, FirestoreErrorHandlerService } from '@services/error-handling/firestore-error-handler.service';
import { RepositoryError, DocumentNotFoundError, ValidationError } from '@interface/errors/repository-errors';

/**
 * Opciones de configuración del repositorio
 */
export interface RepositoryOptions {
  logger?: ILogger;
  enableLogging?: boolean;
  throwOnNotFound?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  serviceName?: string;
}

/**
 * Repositorio base para operaciones CRUD en Firestore
 */
export abstract class BaseRepository<T extends DocumentData> {
  protected readonly db: Firestore;
  protected readonly collectionName: string;
  protected readonly logger: ILogger;
  protected readonly errorHandler: FirestoreErrorHandlerService;
  protected readonly enableLogging: boolean;
  protected readonly throwOnNotFound: boolean;
  protected readonly maxRetries: number;
  protected readonly retryDelay: number;

  constructor(
    db: Firestore,
    collectionName: string,
    options: RepositoryOptions = {}
  ) {
    this.db = db;
    this.collectionName = collectionName;
    this.logger = options.logger || createLogger({
      serviceName: options.serviceName || 'firestore-repository',
      enabled: options.enableLogging ?? true
    });
    this.enableLogging = options.enableLogging ?? true;
    this.throwOnNotFound = options.throwOnNotFound ?? false;
    this.maxRetries = options.maxRetries ?? 3;
    this.retryDelay = options.retryDelay ?? 1000;

    this.errorHandler = createFirestoreErrorHandler(this.logger, {
      enableLogging: this.enableLogging,
      maxRetries: this.maxRetries,
      retryDelay: this.retryDelay
    });
  }

  /**
   * Maneja errores de Firestore y los convierte en errores personalizados
   */
  protected handleError(error: unknown, operation: string, context?: Record<string, any>): never {
    const fullContext = {
      collection: this.collectionName,
      ...context
    };
    this.errorHandler.handleError(error, operation, fullContext);
  }

  /**
   * Ejecuta una operación con reintentos en caso de errores transitorios
   */
  protected async executeWithRetry<R>(
    operation: () => Promise<R>,
    operationName: string,
    currentRetry = 0
  ): Promise<R> {
    return this.errorHandler.executeWithRetry(operation, operationName, currentRetry);
  }

  /**
   * Valida que un ID no esté vacío
   */
  protected validateId(id: string, operation: string): void {
    this.errorHandler.validateId(id, operation);
  }

  /**
   * Valida datos antes de crear o actualizar
   */
  protected validateData(data: any, operation: string): void {
    this.errorHandler.validateData(data, operation);
  }

  /**
   * Obtiene todos los documentos de la colección
   */
  async getAll(): Promise<T[]> {
    try {
      return await this.executeWithRetry(async () => {
        const querySnapshot = await getDocs(collection(this.db, this.collectionName));

        if (this.enableLogging) {
          this.logger.debug(`Obtenidos ${querySnapshot.docs.length} documentos`, {
            collection: this.collectionName
          });
        }

        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as unknown as T));
      }, 'getAll');
    } catch (error) {
      this.handleError(error, 'getAll');
    }
  }

  /**
   * Obtiene un documento por su ID
   */
  async getById(id: string): Promise<T | null> {
    this.validateId(id, 'getById');

    try {
      return await this.executeWithRetry(async () => {
        const docRef = doc(this.db, this.collectionName, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          if (this.throwOnNotFound) {
            throw new DocumentNotFoundError(id, this.collectionName);
          }

          if (this.enableLogging) {
            this.logger.warn(`Documento no encontrado`, { id, collection: this.collectionName });
          }

          return null;
        }

        return { id: docSnap.id, ...docSnap.data() } as unknown as T;
      }, 'getById');
    } catch (error) {
      if (error instanceof DocumentNotFoundError) {
        throw error;
      }
      this.handleError(error, 'getById', { id });
    }
  }

  /**
   * Obtiene un documento por su ID o lanza error si no existe
   */
  async getByIdOrFail(id: string): Promise<T> {
    const result = await this.getById(id);
    if (!result) {
      throw new DocumentNotFoundError(id, this.collectionName);
    }
    return result;
  }

  /**
   * Crea un nuevo documento
   */
  async create(data: WithFieldValue<T>): Promise<string> {
    this.validateData(data, 'create');

    try {
      return await this.executeWithRetry(async () => {
        const docRef = await addDoc(collection(this.db, this.collectionName), data);

        if (this.enableLogging) {
          this.logger.info(`Documento creado exitosamente`, {
            id: docRef.id,
            collection: this.collectionName
          });
        }

        return docRef.id;
      }, 'create');
    } catch (error) {
      this.handleError(error, 'create', { data });
    }
  }

  /**
   * Crea múltiples documentos en un batch
   */
  async createBatch(dataArray: WithFieldValue<T>[]): Promise<string[]> {
    if (!dataArray || dataArray.length === 0) {
      throw new ValidationError('El array de datos no puede estar vacío');
    }

    if (dataArray.length > 500) {
      throw new ValidationError('No se pueden crear más de 500 documentos en un batch');
    }

    try {
      return await this.executeWithRetry(async () => {
        const batch = writeBatch(this.db);
        const ids: string[] = [];

        dataArray.forEach(data => {
          const docRef = doc(collection(this.db, this.collectionName));
          batch.set(docRef, data);
          ids.push(docRef.id);
        });

        await batch.commit();

        if (this.enableLogging) {
          this.logger.info(`${dataArray.length} documentos creados en batch`, {
            collection: this.collectionName
          });
        }

        return ids;
      }, 'createBatch');
    } catch (error) {
      this.handleError(error, 'createBatch', { count: dataArray.length });
    }
  }

  /**
   * Actualiza un documento existente
   */
  async update(id: string, data: Partial<T>): Promise<void> {
    this.validateId(id, 'update');
    this.validateData(data, 'update');

    try {
      await this.executeWithRetry(async () => {
        const docRef = doc(this.db, this.collectionName, id);
        await updateDoc(docRef, data as DocumentData);

        if (this.enableLogging) {
          this.logger.info(`Documento actualizado exitosamente`, {
            id,
            collection: this.collectionName
          });
        }
      }, 'update');
    } catch (error) {
      this.handleError(error, 'update', { id, data });
    }
  }

  /**
   * Elimina un documento
   */
  async delete(id: string): Promise<void> {
    this.validateId(id, 'delete');

    try {
      await this.executeWithRetry(async () => {
        const docRef = doc(this.db, this.collectionName, id);
        await deleteDoc(docRef);

        if (this.enableLogging) {
          this.logger.info(`Documento eliminado exitosamente`, {
            id,
            collection: this.collectionName
          });
        }
      }, 'delete');
    } catch (error) {
      this.handleError(error, 'delete', { id });
    }
  }

  /**
   * Elimina múltiples documentos en un batch
   */
  async deleteBatch(ids: string[]): Promise<void> {
    if (!ids || ids.length === 0) {
      throw new ValidationError('El array de IDs no puede estar vacío');
    }

    if (ids.length > 500) {
      throw new ValidationError('No se pueden eliminar más de 500 documentos en un batch');
    }

    try {
      await this.executeWithRetry(async () => {
        const batch = writeBatch(this.db);

        ids.forEach(id => {
          this.validateId(id, 'deleteBatch');
          const docRef = doc(this.db, this.collectionName, id);
          batch.delete(docRef);
        });

        await batch.commit();

        if (this.enableLogging) {
          this.logger.info(`${ids.length} documentos eliminados en batch`, {
            collection: this.collectionName
          });
        }
      }, 'deleteBatch');
    } catch (error) {
      this.handleError(error, 'deleteBatch', { count: ids.length });
    }
  }

  /**
   * Ejecuta una consulta personalizada
   */
  async query(constraints: QueryConstraint[]): Promise<T[]> {
    try {
      return await this.executeWithRetry(async () => {
        const q = query(collection(this.db, this.collectionName), ...constraints);
        const querySnapshot = await getDocs(q);

        if (this.enableLogging) {
          this.logger.debug(`Query ejecutado con ${querySnapshot.docs.length} resultados`, {
            collection: this.collectionName,
            constraintsCount: constraints.length
          });
        }

        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as unknown as T));
      }, 'query');
    } catch (error) {
      this.handleError(error, 'query', { constraintsCount: constraints.length });
    }
  }

  /**
   * Busca documentos por campo y valor
   */
  async findByField(field: string, value: any): Promise<T[]> {
    if (!field || field.trim() === '') {
      throw new ValidationError('El nombre del campo no puede estar vacío', 'field');
    }

    return this.query([where(field, '==', value)]);
  }

  /**
   * Busca el primer documento que coincida con el campo y valor
   */
  async findOneByField(field: string, value: any): Promise<T | null> {
    const results = await this.findByField(field, value);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Verifica si existe un documento con el ID dado
   */
  async exists(id: string): Promise<boolean> {
    this.validateId(id, 'exists');

    try {
      return await this.executeWithRetry(async () => {
        const docRef = doc(this.db, this.collectionName, id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
      }, 'exists');
    } catch (error) {
      this.handleError(error, 'exists', { id });
    }
  }

  /**
   * Cuenta el número de documentos en la colección
   */
  async count(): Promise<number> {
    try {
      return await this.executeWithRetry(async () => {
        const querySnapshot = await getDocs(collection(this.db, this.collectionName));
        return querySnapshot.size;
      }, 'count');
    } catch (error) {
      this.handleError(error, 'count');
    }
  }

  /**
   * Cuenta documentos que cumplen con los constraints dados
   */
  async countWhere(constraints: QueryConstraint[]): Promise<number> {
    try {
      return await this.executeWithRetry(async () => {
        const q = query(collection(this.db, this.collectionName), ...constraints);
        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
      }, 'countWhere');
    } catch (error) {
      this.handleError(error, 'countWhere', { constraintsCount: constraints.length });
    }
  }
}