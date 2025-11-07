import * as admin from 'firebase-admin';
import type {
  Firestore,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  WriteBatch,
  FieldValue,
} from 'firebase-admin/firestore';

import { ILogger } from '@interface/logging.interface';
import { createLogger } from '@services/logging/console-logger.service';
import {
  createFirestoreErrorHandler,
  FirestoreErrorHandlerService
} from '@services/error-handling/firestore-error-handler.service';
import {
  RepositoryError,
  DocumentNotFoundError,
  ValidationError
} from '@interface/errors/repository-errors';

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
 * Opciones para consultas con paginación
 */
export interface QueryOptions {
  limit?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  startAfter?: any;
  startAt?: any;
  endBefore?: any;
  endAt?: any;
}

/**
 * Resultado de consulta paginada
 */
export interface PaginatedResult<T> {
  data: T[];
  lastDoc: QueryDocumentSnapshot | null;
  hasMore: boolean;
  total?: number;
}

/**
 * Repositorio base para operaciones CRUD en Firestore usando firebase-admin
 * 
 * @template T - Tipo del documento
 * 
 * @example
 * ```typescript
 * interface ProyectoLey extends DocumentData {
 *   boletin: string;
 *   titulo: string;
 *   descripcion: string;
 * }
 * 
 * class ProyectoLeyRepository extends BaseRepository<ProyectoLey> {
 *   constructor(db: Firestore) {
 *     super(db, 'proyectos_ley', {
 *       enableLogging: true,
 *       serviceName: 'proyecto-ley-repository'
 *     });
 *   }
 * }
 * ```
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
   * Obtiene la referencia a la colección
   */
  protected get collectionRef() {
    return this.db.collection(this.collectionName);
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
   * Convierte un DocumentSnapshot a objeto con ID
   */
  protected docToObject(doc: QueryDocumentSnapshot | DocumentSnapshot): T {
    return {
      id: doc.id,
      ...doc.data()
    } as unknown as T;
  }

  /**
   * Obtiene todos los documentos de la colección
   * ⚠️ Usar con precaución en colecciones grandes
   */
  async getAll(options?: QueryOptions): Promise<T[]> {
    try {
      return await this.executeWithRetry(async () => {
        let query = this.collectionRef as any;

        // Aplicar ordenamiento si está especificado
        if (options?.orderByField) {
          query = query.orderBy(
            options.orderByField,
            options.orderDirection || 'asc'
          );
        }

        // Aplicar límite si está especificado
        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const snapshot = await query.get();

        if (this.enableLogging) {
          this.logger.debug(`Obtenidos ${snapshot.docs.length} documentos`, {
            collection: this.collectionName
          });
        }

        return snapshot.docs.map((doc: QueryDocumentSnapshot) => this.docToObject(doc));
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
        const docRef = this.collectionRef.doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
          if (this.throwOnNotFound) {
            throw new DocumentNotFoundError(id, this.collectionName);
          }

          if (this.enableLogging) {
            this.logger.warn(`Documento no encontrado`, {
              id,
              collection: this.collectionName
            });
          }

          return null;
        }

        return this.docToObject(docSnap);
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
   * Crea un nuevo documento con ID autogenerado
   */
  async create(data: Partial<T>): Promise<string> {
    this.validateData(data, 'create');

    try {
      return await this.executeWithRetry(async () => {
        // Crear documento sin timestamps automáticos
        const docRef = await this.collectionRef.add(data);

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
   * Crea un documento con un ID específico
   */
  async createWithId(id: string, data: Partial<T>): Promise<void> {
    this.validateId(id, 'createWithId');
    this.validateData(data, 'createWithId');

    try {
      await this.executeWithRetry(async () => {
        // Crear documento sin timestamps automáticos
        await this.collectionRef.doc(id).set(data);

        if (this.enableLogging) {
          this.logger.info(`Documento creado con ID específico`, {
            id,
            collection: this.collectionName
          });
        }
      }, 'createWithId');
    } catch (error) {
      this.handleError(error, 'createWithId', { id, data });
    }
  }

  /**
   * Crea múltiples documentos en un batch
   * Límite de Firebase: 500 operaciones por batch
   */
  async createBatch(dataArray: Partial<T>[]): Promise<string[]> {
    if (!dataArray || dataArray.length === 0) {
      throw new ValidationError('El array de datos no puede estar vacío');
    }

    if (dataArray.length > 500) {
      throw new ValidationError('No se pueden crear más de 500 documentos en un batch');
    }

    try {
      return await this.executeWithRetry(async () => {
        const batch = this.db.batch();
        const ids: string[] = [];

        dataArray.forEach(data => {
          const docRef = this.collectionRef.doc();
          
          // Crear documento sin timestamps automáticos
          batch.set(docRef, data as T);
          
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
   * Crea múltiples documentos en un batch sin timestamps automáticos
   * Útil cuando los datos ya incluyen timestamps o se requiere control manual
   */
  async createBatchRaw(dataArray: Partial<T>[]): Promise<string[]> {
    if (!dataArray || dataArray.length === 0) {
      throw new ValidationError('El array de datos no puede estar vacío');
    }

    if (dataArray.length > 500) {
      throw new ValidationError('No se pueden crear más de 500 documentos en un batch');
    }

    try {
      return await this.executeWithRetry(async () => {
        const batch = this.db.batch();
        const ids: string[] = [];

        dataArray.forEach(data => {
          const docRef = this.collectionRef.doc();
          batch.set(docRef, data as T);
          ids.push(docRef.id);
        });

        await batch.commit();

        if (this.enableLogging) {
          this.logger.info(`${dataArray.length} documentos creados en batch (raw)`, {
            collection: this.collectionName
          });
        }

        return ids;
      }, 'createBatchRaw');
    } catch (error) {
      this.handleError(error, 'createBatchRaw', { count: dataArray.length });
    }
  }

  /**
   * Crea múltiples documentos usando server timestamps verdaderos
   * Más lento pero garantiza timestamps del servidor
   */
  async createBatchWithServerTimestamps(dataArray: Partial<T>[]): Promise<string[]> {
    if (!dataArray || dataArray.length === 0) {
      throw new ValidationError('El array de datos no puede estar vacío');
    }

    try {
      return await this.executeWithRetry(async () => {
        const ids: string[] = [];
        
        // Procesar en chunks para evitar límites de Firestore
        const chunkSize = 100;
        for (let i = 0; i < dataArray.length; i += chunkSize) {
          const chunk = dataArray.slice(i, i + chunkSize);
          const promises = chunk.map(async (data) => {
            const docRef = this.collectionRef.doc();
            await docRef.set({
              ...data,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            return docRef.id;
          });
          
          const chunkIds = await Promise.all(promises);
          ids.push(...chunkIds);
        }

        if (this.enableLogging) {
          this.logger.info(`${dataArray.length} documentos creados con server timestamps`, {
            collection: this.collectionName
          });
        }

        return ids;
      }, 'createBatchWithServerTimestamps');
    } catch (error) {
      this.handleError(error, 'createBatchWithServerTimestamps', { count: dataArray.length });
    }
  }

  /**
   * Crea múltiples documentos de forma individual con control de concurrencia
   * Más lento pero más confiable para grandes volúmenes de datos
   */
  async createIndividual(
    dataArray: Partial<T>[],
    options: { 
      concurrency?: number; 
      onProgress?: (completed: number, total: number) => void;
    } = {}
  ): Promise<string[]> {
    if (!dataArray || dataArray.length === 0) {
      throw new ValidationError('El array de datos no puede estar vacío');
    }

    const { concurrency = 10, onProgress } = options;

    try {
      return await this.executeWithRetry(async () => {
        const ids: string[] = [];

        // Procesar en chunks con control de concurrencia
        for (let i = 0; i < dataArray.length; i += concurrency) {
          const chunk = dataArray.slice(i, i + concurrency);
          
          const promises = chunk.map(async (data) => {
            const docRef = this.collectionRef.doc();
            
            // Crear documento sin timestamps automáticos
            await docRef.set(data);
            return docRef.id;
          });

          const chunkIds = await Promise.all(promises);
          ids.push(...chunkIds);

          // Reportar progreso si se proporciona callback
          if (onProgress) {
            onProgress(ids.length, dataArray.length);
          }

          if (this.enableLogging && i % 100 === 0) {
            this.logger.debug(`Progreso: ${ids.length}/${dataArray.length} documentos creados`, {
              collection: this.collectionName
            });
          }
        }

        if (this.enableLogging) {
          this.logger.info(`${dataArray.length} documentos creados individualmente`, {
            collection: this.collectionName,
            concurrency
          });
        }

        return ids;
      }, 'createIndividual');
    } catch (error) {
      this.handleError(error, 'createIndividual', { count: dataArray.length, concurrency });
    }
  }

  /**
   * Crea múltiples documentos usando batch inteligente por chunks
   * Combina la eficiencia de batch con la confiabilidad de chunks
   */
  async createBatchChunked(
    dataArray: Partial<T>[],
    options: {
      chunkSize?: number;
      onProgress?: (completed: number, total: number) => void;
    } = {}
  ): Promise<string[]> {
    if (!dataArray || dataArray.length === 0) {
      throw new ValidationError('El array de datos no puede estar vacío');
    }

    const { chunkSize = 450, onProgress } = options;

    try {
      return await this.executeWithRetry(async () => {
        const allIds: string[] = [];

        // Procesar en chunks para evitar límites de Firestore
        for (let i = 0; i < dataArray.length; i += chunkSize) {
          const chunk = dataArray.slice(i, i + chunkSize);
          const batch = this.db.batch();
          const chunkIds: string[] = [];

          chunk.forEach(data => {
            const docRef = this.collectionRef.doc();
            
            // Crear documento sin timestamps automáticos
            batch.set(docRef, data as T);
            chunkIds.push(docRef.id);
          });

          await batch.commit();
          allIds.push(...chunkIds);

          // Reportar progreso
          if (onProgress) {
            onProgress(allIds.length, dataArray.length);
          }

          if (this.enableLogging) {
            this.logger.debug(`Chunk procesado: ${allIds.length}/${dataArray.length} documentos`, {
              collection: this.collectionName,
              chunkSize: chunk.length
            });
          }

          // Pequeña pausa entre chunks para evitar throttling
          if (i + chunkSize < dataArray.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        if (this.enableLogging) {
          this.logger.info(`${dataArray.length} documentos creados en batch chunked`, {
            collection: this.collectionName,
            totalChunks: Math.ceil(dataArray.length / chunkSize)
          });
        }

        return allIds;
      }, 'createBatchChunked');
    } catch (error) {
      this.handleError(error, 'createBatchChunked', { count: dataArray.length, chunkSize });
    }
  }

  /**
   * Actualiza un documento existente (merge parcial)
   */
  async update(id: string, data: Partial<T>): Promise<void> {
    this.validateId(id, 'update');
    this.validateData(data, 'update');

    try {
      await this.executeWithRetry(async () => {
        const docRef = this.collectionRef.doc(id);

        const dataWithTimestamp = {
          ...data,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await docRef.update(dataWithTimestamp);

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
   * Actualiza o crea un documento (upsert)
   */
  async upsert(id: string, data: Partial<T>): Promise<void> {
    this.validateId(id, 'upsert');
    this.validateData(data, 'upsert');

    try {
      await this.executeWithRetry(async () => {
        const docRef = this.collectionRef.doc(id);

        const dataWithTimestamps = {
          ...data,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await docRef.set(dataWithTimestamps, { merge: true });

        if (this.enableLogging) {
          this.logger.info(`Documento actualizado/creado (upsert)`, {
            id,
            collection: this.collectionName
          });
        }
      }, 'upsert');
    } catch (error) {
      this.handleError(error, 'upsert', { id, data });
    }
  }

  /**
   * Verifica si existe un documento con un campo específico
   */
  async existsByField(field: string, value: any): Promise<boolean> {
    try {
      const snapshot = await this.collectionRef
        .where(field, '==', value)
        .limit(1)
        .get();

      return !snapshot.empty;
    } catch (error) {
      this.handleError(error, 'existsByField', { field, value });
    }
  }

  /**
   * Elimina un documento
   */
  async delete(id: string): Promise<void> {
    this.validateId(id, 'delete');

    try {
      await this.executeWithRetry(async () => {
        const docRef = this.collectionRef.doc(id);
        await docRef.delete();

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
        const batch = this.db.batch();

        ids.forEach(id => {
          this.validateId(id, 'deleteBatch');
          const docRef = this.collectionRef.doc(id);
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
   * Busca documentos por campo y valor
   */
  async findByField(field: string, value: any): Promise<T[]> {
    if (!field || field.trim() === '') {
      throw new ValidationError('El nombre del campo no puede estar vacío', 'field');
    }

    try {
      return await this.executeWithRetry(async () => {
        const snapshot = await this.collectionRef
          .where(field, '==', value)
          .get();

        if (this.enableLogging) {
          this.logger.debug(`Query por campo ejecutado: ${snapshot.docs.length} resultados`, {
            collection: this.collectionName,
            field,
            value
          });
        }

        return snapshot.docs.map(doc => this.docToObject(doc));
      }, 'findByField');
    } catch (error) {
      this.handleError(error, 'findByField', { field, value });
    }
  }

  /**
   * Busca el primer documento que coincida con el campo y valor
   */
  async findOneByField(field: string, value: any): Promise<T | null> {
    const results = await this.findByField(field, value);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Ejecuta una consulta con múltiples condiciones
   */
  async findWhere(conditions: Array<{ field: string; operator: FirebaseFirestore.WhereFilterOp; value: any }>): Promise<T[]> {
    try {
      return await this.executeWithRetry(async () => {
        let query = this.collectionRef as FirebaseFirestore.Query;

        conditions.forEach(({ field, operator, value }) => {
          query = query.where(field, operator, value);
        });

        const snapshot = await query.get();

        if (this.enableLogging) {
          this.logger.debug(`Query con múltiples condiciones: ${snapshot.docs.length} resultados`, {
            collection: this.collectionName,
            conditionsCount: conditions.length
          });
        }

        return snapshot.docs.map(doc => this.docToObject(doc));
      }, 'findWhere');
    } catch (error) {
      this.handleError(error, 'findWhere', { conditionsCount: conditions.length });
    }
  }

  /**
   * Obtiene documentos con paginación
   */
  async paginate(
    pageSize: number = 20,
    lastDocSnapshot?: QueryDocumentSnapshot,
    options?: QueryOptions
  ): Promise<PaginatedResult<T>> {
    try {
      return await this.executeWithRetry(async () => {
        let query = this.collectionRef as FirebaseFirestore.Query;

        // Ordenamiento
        if (options?.orderByField) {
          query = query.orderBy(options.orderByField, options.orderDirection || 'asc');
        }

        // Paginación
        if (lastDocSnapshot) {
          query = query.startAfter(lastDocSnapshot);
        }

        // Límite
        query = query.limit(pageSize);

        const snapshot = await query.get();
        const data = snapshot.docs.map(doc => this.docToObject(doc));
        const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

        return {
          data,
          lastDoc,
          hasMore: snapshot.docs.length === pageSize,
        };
      }, 'paginate');
    } catch (error) {
      this.handleError(error, 'paginate', { pageSize });
    }
  }

  /**
   * Verifica si existe un documento con el ID dado
   */
  async exists(id: string): Promise<boolean> {
    this.validateId(id, 'exists');

    try {
      return await this.executeWithRetry(async () => {
        const docRef = this.collectionRef.doc(id);
        const docSnap = await docRef.get();
        return docSnap.exists;
      }, 'exists');
    } catch (error) {
      this.handleError(error, 'exists', { id });
    }
  }

  /**
   * Cuenta el número total de documentos en la colección
   * ⚠️ Puede ser costoso en colecciones grandes
   */
  async count(): Promise<number> {
    try {
      return await this.executeWithRetry(async () => {
        const snapshot = await this.collectionRef.get();
        return snapshot.size;
      }, 'count');
    } catch (error) {
      this.handleError(error, 'count');
    }
  }

  /**
   * Cuenta documentos que cumplen con una condición
   */
  async countWhere(field: string, operator: FirebaseFirestore.WhereFilterOp, value: any): Promise<number> {
    try {
      return await this.executeWithRetry(async () => {
        const snapshot = await this.collectionRef
          .where(field, operator, value)
          .get();

        return snapshot.size;
      }, 'countWhere');
    } catch (error) {
      this.handleError(error, 'countWhere', { field, operator, value });
    }
  }

  /**
   * Incrementa un campo numérico
   */
  async increment(id: string, field: string, value: number = 1): Promise<void> {
    this.validateId(id, 'increment');

    try {
      await this.executeWithRetry(async () => {
        const docRef = this.collectionRef.doc(id);
        await docRef.update({
          [field]: admin.firestore.FieldValue.increment(value),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        if (this.enableLogging) {
          this.logger.debug(`Campo incrementado`, {
            id,
            field,
            value,
            collection: this.collectionName
          });
        }
      }, 'increment');
    } catch (error) {
      this.handleError(error, 'increment', { id, field, value });
    }
  }

  /**
   * Agrega un elemento a un array
   */
  async arrayUnion(id: string, field: string, values: any[]): Promise<void> {
    this.validateId(id, 'arrayUnion');

    try {
      await this.executeWithRetry(async () => {
        const docRef = this.collectionRef.doc(id);
        await docRef.update({
          [field]: admin.firestore.FieldValue.arrayUnion(...values),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        if (this.enableLogging) {
          this.logger.debug(`Elementos agregados al array`, {
            id,
            field,
            count: values.length,
            collection: this.collectionName
          });
        }
      }, 'arrayUnion');
    } catch (error) {
      this.handleError(error, 'arrayUnion', { id, field });
    }
  }

  /**
   * Elimina elementos de un array
   */
  async arrayRemove(id: string, field: string, values: any[]): Promise<void> {
    this.validateId(id, 'arrayRemove');

    try {
      await this.executeWithRetry(async () => {
        const docRef = this.collectionRef.doc(id);
        await docRef.update({
          [field]: admin.firestore.FieldValue.arrayRemove(...values),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        if (this.enableLogging) {
          this.logger.debug(`Elementos removidos del array`, {
            id,
            field,
            count: values.length,
            collection: this.collectionName
          });
        }
      }, 'arrayRemove');
    } catch (error) {
      this.handleError(error, 'arrayRemove', { id, field });
    }
  }

  /**
   * Obtiene documentos creados después de una fecha
   */
  async getCreatedAfter(date: Date, limit?: number): Promise<T[]> {
    try {
      return await this.executeWithRetry(async () => {
        let query = this.collectionRef
          .where('createdAt', '>', admin.firestore.Timestamp.fromDate(date))
          .orderBy('createdAt', 'desc') as FirebaseFirestore.Query;

        if (limit) {
          query = query.limit(limit);
        }

        const snapshot = await query.get();
        return snapshot.docs.map(doc => this.docToObject(doc));
      }, 'getCreatedAfter');
    } catch (error) {
      this.handleError(error, 'getCreatedAfter', { date });
    }
  }

  /**
   * Obtiene documentos actualizados después de una fecha
   */
  async getUpdatedAfter(date: Date, limit?: number): Promise<T[]> {
    try {
      return await this.executeWithRetry(async () => {
        let query = this.collectionRef
          .where('updatedAt', '>', admin.firestore.Timestamp.fromDate(date))
          .orderBy('updatedAt', 'desc') as FirebaseFirestore.Query;

        if (limit) {
          query = query.limit(limit);
        }

        const snapshot = await query.get();
        return snapshot.docs.map(doc => this.docToObject(doc));
      }, 'getUpdatedAfter');
    } catch (error) {
      this.handleError(error, 'getUpdatedAfter', { date });
    }
  }
}