import pino from 'pino';
import type { Logger as PinoLogger } from 'pino';
import { ILogger } from '@interface/logging.interface';
import { PinoLoggerOptions, IPinoLogger } from './logger.types';

/**
 * Implementación de logger usando Pino para logging estructurado
 * 
 * Pino es un logger de alto rendimiento para Node.js que genera logs en formato JSON.
 * Es ideal para rastrear el flujo de la aplicación, errores y debugging.
 * 
 * @example
 * ```typescript
 * const logger = new PinoLoggerService({
 *   serviceName: 'mi-servicio',
 *   level: 'info',
 *   prettyPrint: true // Solo en desarrollo
 * });
 * 
 * logger.info('Usuario autenticado', { userId: 123 });
 * logger.error('Error al conectar', new Error('Connection timeout'), { host: 'db.example.com' });
 * ```
 * 
 * @packageDocumentation
 */
export class PinoLoggerService implements IPinoLogger {
  private readonly logger: PinoLogger;
  private readonly enabled: boolean;
  private readonly timers: Map<string, number>;

  constructor(options: PinoLoggerOptions = {}) {
    this.enabled = options.enabled ?? true;
    this.timers = new Map();

    // Configuración base de Pino
    const pinoConfig: pino.LoggerOptions = {
      level: options.level || 'info',
      
      // Base objeto que se incluye en todos los logs
      base: {
        service: options.serviceName || 'app',
        ...(options.base || {})
      },
      
      // Incluir timestamp si está habilitado (por defecto true)
      timestamp: options.includeTimestamp !== false ? pino.stdTimeFunctions.isoTime : false,
      
      // Formatear errores automáticamente
      formatters: {
        level: (label) => {
          return { level: label };
        },
        bindings: (bindings) => {
          return {
            pid: bindings.pid,
            hostname: bindings.hostname,
            service: bindings.service
          };
        }
      }
    };

    // Configurar transport para pretty-printing en desarrollo
    if (options.prettyPrint) {
      this.logger = pino({
        ...pinoConfig,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
            singleLine: false
          }
        }
      });
    } else {
      // En producción, usar JSON puro para mejor parseo
      this.logger = pino(pinoConfig);
    }
  }

  /**
   * Obtiene la instancia de Pino subyacente para acceso directo
   */
  getPinoInstance(): PinoLogger {
    return this.logger;
  }

  /**
   * Log de error con contexto estructurado
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (!this.enabled) return;
    
    if (error) {
      // Pino maneja errores de forma especial con el campo 'err'
      this.logger.error({ err: error, ...context }, message);
    } else {
      this.logger.error(context || {}, message);
    }
  }

  /**
   * Log de advertencia
   */
  warn(message: string, context?: Record<string, any>): void {
    if (!this.enabled) return;
    this.logger.warn(context || {}, message);
  }

  /**
   * Log informativo
   */
  info(message: string, context?: Record<string, any>): void {
    if (!this.enabled) return;
    this.logger.info(context || {}, message);
  }

  /**
   * Log de debug para desarrollo
   */
  debug(message: string, context?: Record<string, any>): void {
    if (!this.enabled) return;
    this.logger.debug(context || {}, message);
  }

  /**
   * Log genérico con nivel especificado
   */
  log(level: 'error' | 'warn' | 'info' | 'debug', message: string, context?: Record<string, any>): void {
    if (!this.enabled) return;
    
    switch (level) {
      case 'error':
        this.error(message, undefined, context);
        break;
      case 'warn':
        this.warn(message, context);
        break;
      case 'info':
        this.info(message, context);
        break;
      case 'debug':
        this.debug(message, context);
        break;
    }
  }

  /**
   * Inicia un timer para medir performance
   */
  time(label: string): void {
    if (!this.enabled) return;
    this.timers.set(label, performance.now());
    this.debug(`Timer iniciado: ${label}`);
  }

  /**
   * Termina un timer y registra el tiempo transcurrido
   */
  timeEnd(label: string, context?: Record<string, any>): void {
    if (!this.enabled) return;
    
    const startTime = this.timers.get(label);
    if (startTime !== undefined) {
      const duration = performance.now() - startTime;
      this.info(`Timer completado: ${label}`, { 
        duration: `${duration.toFixed(2)}ms`,
        durationMs: duration,
        ...context 
      });
      this.timers.delete(label);
    } else {
      this.warn(`Timer no encontrado: ${label}`);
    }
  }
}

/**
 * Factory para crear instancias de PinoLogger configuradas
 * Mantiene compatibilidad con código existente
 * 
 * @example
 * ```typescript
 * const logger = createLogger({ serviceName: 'api', level: 'debug' });
 * ```
 */
export const createLogger = (options?: PinoLoggerOptions): ILogger => {
  return new PinoLoggerService(options);
};

/**
 * Factory para crear logger con pretty-print habilitado (útil en desarrollo)
 */
export const createPrettyLogger = (options?: PinoLoggerOptions): ILogger => {
  return new PinoLoggerService({
    ...options,
    prettyPrint: true
  });
};
