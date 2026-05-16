/**
 * Barrel export para servicios de logging
 * 
 * Este módulo exporta dos tipos de loggers:
 * 
 * 1. **PinoLoggerService**: Logger estructurado para rastreo, debugging y monitoreo
 *    - Usa Pino para logs estructurados en JSON
 *    - Ideal para aplicaciones en producción
 *    - Soporta niveles de log, metadata estructurada y performance tracking
 * 
 * 2. **ChalkConsoleLogger**: Logger visual para output colorido en consola
 *    - Usa Chalk con paleta de colores cyberpunk
 *    - Ideal para CLIs, scripts y outputs visuales para usuarios
 *    - Provee headers, separadores, badges, progress bars, etc.
 * 
 * @packageDocumentation
 */

// Exportar PinoLoggerService (logger estructurado)
export { 
  PinoLoggerService, 
  createLogger, 
  createPrettyLogger 
} from './pino-logger.service';

// Exportar ChalkConsoleLogger (logger visual)
export { 
  ChalkConsoleLogger, 
  createChalkLogger 
} from './chalk-console-logger.service';

// Exportar todos los tipos e interfaces
export type {
  PinoLoggerOptions,
  IPinoLogger,
  BadgeStyle,
  ChalkConsoleLoggerOptions,
  ListItem,
  BoxOptions,
  IChalkConsoleLogger,
  CyberpunkColorPalette
} from './logger.types';

// Re-exportar interfaces base del módulo de interfaces
export type { ILogger, LoggerOptions } from '@interface/logging.interface';
