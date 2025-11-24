import { ILogger, LoggerOptions } from '@interface/logging.interface';

/**
 * Opciones de configuración para PinoLoggerService
 */
export interface PinoLoggerOptions extends LoggerOptions {
  /** Usar formato pretty (desarrollo) o JSON (producción) */
  prettyPrint?: boolean;
  /** Nivel de log base */
  base?: Record<string, any>;
  /** Nombre del archivo de log (opcional) */
  logFile?: string;
}

/**
 * Interfaz extendida para PinoLogger
 */
export interface IPinoLogger extends ILogger {
  /** Obtiene el logger Pino subyacente para acceso directo */
  getPinoInstance(): any;
}

/**
 * Estilos de badge disponibles para ChalkConsoleLogger
 */
export type BadgeStyle = 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary';

/**
 * Opciones para personalizar el logger visual Chalk
 */
export interface ChalkConsoleLoggerOptions {
  /** Habilitar o deshabilitar output colorido */
  enabled?: boolean;
  /** Ancho predeterminado para separadores */
  defaultWidth?: number;
  /** Usar paleta de colores cyberpunk */
  useCyberpunkTheme?: boolean;
}

/**
 * Item para listas con bullets personalizados
 */
export interface ListItem {
  text: string;
  indent?: number;
  bullet?: string;
}

/**
 * Opciones para el método box()
 */
export interface BoxOptions {
  padding?: number;
  borderColor?: 'cyan' | 'magenta' | 'yellow' | 'green' | 'red' | 'gray';
  textColor?: 'cyan' | 'magenta' | 'yellow' | 'green' | 'red' | 'white' | 'gray';
}

/**
 * Interfaz para el logger visual con Chalk
 */
export interface IChalkConsoleLogger {
  /** Imprime un header grande con bordes decorativos */
  header(text: string): void;
  
  /** Imprime un subheader con separadores */
  subheader(text: string): void;
  
  /** Imprime una línea separadora */
  separator(length?: number, char?: string): void;
  
  /** Mensaje de éxito con icono ✓ en verde neón */
  success(message: string): void;
  
  /** Mensaje de error con icono ✗ en rojo/magenta */
  error(message: string): void;
  
  /** Mensaje de advertencia con icono ⚠ en amarillo */
  warning(message: string): void;
  
  /** Mensaje informativo con icono ℹ en cyan */
  info(message: string): void;
  
  /** Imprime par clave-valor en formato tabular */
  data(label: string, value: string | number): void;
  
  /** Imprime una lista con bullets coloridos */
  list(items: string[] | ListItem[]): void;
  
  /** Imprime contenido en una caja decorativa */
  box(content: string | string[], options?: BoxOptions): void;
  
  /** Imprime un badge/etiqueta con estilo */
  badge(text: string, style?: BadgeStyle): void;
  
  /** Imprime una barra de progreso visual */
  progress(current: number, total: number, label?: string): void;
  
  /** Imprime un mensaje plano sin formato especial */
  plain(message: string): void;
  
  /** Imprime una nueva línea en blanco */
  newLine(count?: number): void;
}

/**
 * Paleta de colores cyberpunk para uso interno
 */
export interface CyberpunkColorPalette {
  magenta: string;    // #FF00FF - Magenta Neón
  cyan: string;       // #00FFFF - Cyan Brillante
  yellow: string;     // #FFFF00 - Amarillo Neón
  green: string;      // #7CFC00 - Verde Lima Neón
  red: string;        // #FF3300 - Rojo Sangre
  gray: string;       // #505050 - Gris Oscuro
  white: string;      // #FFFFFF - Blanco
}
