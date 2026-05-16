/**
 * Interfaz para servicios de logging
 * 
 * @packageDocumentation
 */

export interface ILogger {
  error(message: string, error?: Error, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  info(message: string, context?: Record<string, any>): void;
  debug(message: string, context?: Record<string, any>): void;
  
  // Métodos para logging estructurado
  log(level: 'error' | 'warn' | 'info' | 'debug', message: string, context?: Record<string, any>): void;
  
  // Métodos para métricas y performance
  time(label: string): void;
  timeEnd(label: string, context?: Record<string, any>): void;
}

export interface LoggerOptions {
  enabled?: boolean;
  level?: 'error' | 'warn' | 'info' | 'debug';
  includeTimestamp?: boolean;
  serviceName?: string;
}