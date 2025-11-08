import { ILogger, LoggerOptions } from '../../interface/logging.interface';

/**
 * Implementación de logger usando console con opciones configurables
 * 
 * @packageDocumentation
 */
export class ConsoleLoggerService implements ILogger {
  private readonly enabled: boolean;
  private readonly level: string;
  private readonly includeTimestamp: boolean;
  private readonly serviceName: string;
  private readonly timers: Map<string, number>;

  constructor(options: LoggerOptions = {}) {
    this.enabled = options.enabled ?? true;
    this.level = options.level ?? 'info';
    this.includeTimestamp = options.includeTimestamp ?? true;
    this.serviceName = options.serviceName ?? 'firestore-repository';
    this.timers = new Map();
  }

  private shouldLog(level: string): boolean {
    if (!this.enabled) return false;
    
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.level);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex <= currentLevelIndex;
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = this.includeTimestamp ? `[${new Date().toISOString()}] ` : '';
    const service = this.serviceName ? `[${this.serviceName}] ` : '';
    return `${timestamp}${service}[${level.toUpperCase()}] ${message}`;
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (!this.shouldLog('error')) return;
    
    const formattedMessage = this.formatMessage('error', message);
    
    if (error) {
      console.error(formattedMessage, { error, ...context });
    } else {
      console.error(formattedMessage, context);
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog('warn')) return;
    
    const formattedMessage = this.formatMessage('warn', message);
    console.warn(formattedMessage, context);
  }

  info(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog('info')) return;
    
    const formattedMessage = this.formatMessage('info', message);
    console.info(formattedMessage, context);
  }

  debug(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog('debug')) return;
    
    const formattedMessage = this.formatMessage('debug', message);
    console.debug(formattedMessage, context);
  }

  log(level: 'error' | 'warn' | 'info' | 'debug', message: string, context?: Record<string, any>): void {
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

  time(label: string): void {
    if (!this.shouldLog('debug')) return;
    
    this.timers.set(label, performance.now());
  }

  timeEnd(label: string, context?: Record<string, any>): void {
    if (!this.shouldLog('debug')) return;
    
    const startTime = this.timers.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.debug(`Timer '${label}' completed in ${duration.toFixed(2)}ms`, 
        { duration, ...context });
      this.timers.delete(label);
    }
  }
}

/**
 * Factory para crear instancias de logger configuradas
 */
export const createLogger = (options?: LoggerOptions): ILogger => {
  return new ConsoleLoggerService(options);
};