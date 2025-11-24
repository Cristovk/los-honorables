import chalk from 'chalk';
import type { 
  IChalkConsoleLogger, 
  ChalkConsoleLoggerOptions, 
  BadgeStyle, 
  ListItem, 
  BoxOptions 
} from './logger.types';

/**
 * Logger visual con Chalk para output colorido estilo cyberpunk
 * 
 * Este logger está diseñado para crear salidas visualmente atractivas en consola
 * con una paleta de colores vibrante inspirada en la estética cyberpunk.
 * 
 * Paleta de colores:
 * - Magenta neón (#FF00FF): Para headers y elementos destacados
 * - Cyan brillante (#00FFFF): Para información y datos
 * - Verde lima neón (#7CFC00): Para éxito y confirmaciones
 * - Amarillo oro (#FFFF00): Para advertencias
 * - Rojo sangre (#FF3300): Para errores
 * - Gris oscuro (#505050): Para elementos secundarios
 * 
 * @example
 * ```typescript
 * const logger = new ChalkConsoleLogger();
 * 
 * logger.header('SISTEMA INICIADO');
 * logger.success('Conexión establecida');
 * logger.data('Puerto', 3000);
 * logger.separator();
 * ```
 * 
 * @packageDocumentation
 */
export class ChalkConsoleLogger implements IChalkConsoleLogger {
  private readonly enabled: boolean;
  private readonly defaultWidth: number;
  private readonly useCyberpunk: boolean;

  // Paleta de colores cyberpunk
  private readonly colors = {
    magenta: chalk.hex('#FF00FF'),      // Magenta neón - Headers y destacados
    cyan: chalk.hex('#00FFFF'),         // Cyan brillante - Info y datos
    yellow: chalk.hex('#FFFF00'),       // Amarillo oro - Warnings
    green: chalk.hex('#7CFC00'),        // Verde lima neón - Success
    red: chalk.hex('#FF3300'),          // Rojo sangre - Errors
    gray: chalk.hex('#505050'),         // Gris oscuro - Secundario
    white: chalk.hex('#FFFFFF'),        // Blanco - Texto principal
    pink: chalk.hex('#FF1493'),         // Rosa - Alternativo
    purple: chalk.hex('#9C27B0')        // Púrpura - Alternativo
  };

  constructor(options: ChalkConsoleLoggerOptions = {}) {
    this.enabled = options.enabled ?? true;
    this.defaultWidth = options.defaultWidth ?? 60;
    this.useCyberpunk = options.useCyberpunkTheme ?? true;
  }

  /**
   * Imprime un header grande con bordes decorativos
   * Usa magenta neón para máximo impacto visual
   */
  header(text: string): void {
    if (!this.enabled) return;
    
    const border = '═'.repeat(this.defaultWidth);
    console.log('');
    console.log(this.colors.magenta(`╔${border}╗`));
    console.log(this.colors.magenta(`║ ${text.toUpperCase().padEnd(this.defaultWidth - 2)} ║`));
    console.log(this.colors.magenta(`╚${border}╝`));
    console.log('');
  }

  /**
   * Imprime un subheader con separadores estilizados
   * Usa cyan para diferenciarlo del header principal
   */
  subheader(text: string): void {
    if (!this.enabled) return;
    
    console.log('');
    console.log(this.colors.cyan(`▸ ${text.toUpperCase()}`));
    console.log(this.colors.cyan('─'.repeat(this.defaultWidth)));
  }

  /**
   * Imprime una línea separadora personalizable
   */
  separator(length?: number, char: string = '─'): void {
    if (!this.enabled) return;
    
    const lineLength = length ?? this.defaultWidth;
    console.log(this.colors.gray(char.repeat(lineLength)));
  }

  /**
   * Mensaje de éxito con icono ✓ en verde neón
   */
  success(message: string): void {
    if (!this.enabled) return;
    
    console.log(this.colors.green(`✓ ${message}`));
  }

  /**
   * Mensaje de error con icono ✗ en rojo brillante
   */
  error(message: string): void {
    if (!this.enabled) return;
    
    console.log(this.colors.red(`✗ ${message}`));
  }

  /**
   * Mensaje de advertencia con icono ⚠ en amarillo
   */
  warning(message: string): void {
    if (!this.enabled) return;
    
    console.log(this.colors.yellow(`⚠ ${message}`));
  }

  /**
   * Mensaje informativo con icono ℹ en cyan
   */
  info(message: string): void {
    if (!this.enabled) return;
    
    console.log(this.colors.cyan(`ℹ ${message}`));
  }

  /**
   * Imprime par clave-valor en formato tabular
   * La clave en cyan y el valor en blanco para legibilidad
   */
  data(label: string, value: string | number): void {
    if (!this.enabled) return;
    
    const formattedLabel = this.colors.cyan(`${label}:`);
    const formattedValue = this.colors.white(String(value));
    console.log(`  ${formattedLabel} ${formattedValue}`);
  }

  /**
   * Imprime una lista con bullets coloridos
   * Soporta tanto arrays simples como objetos ListItem con configuración
   */
  list(items: string[] | ListItem[]): void {
    if (!this.enabled) return;
    
    items.forEach((item) => {
      if (typeof item === 'string') {
        console.log(this.colors.magenta(`  ▸ `) + this.colors.white(item));
      } else {
        const indent = '  '.repeat(item.indent || 1);
        const bullet = item.bullet || '▸';
        console.log(indent + this.colors.magenta(bullet + ' ') + this.colors.white(item.text));
      }
    });
  }

  /**
   * Imprime contenido en una caja decorativa con esquinas redondeadas
   * Perfecto para destacar información importante
   */
  box(content: string | string[], options: BoxOptions = {}): void {
    if (!this.enabled) return;
    
    const lines = Array.isArray(content) ? content : [content];
    const padding = options.padding ?? 2;
    const borderColor = this.getColorFunction(options.borderColor || 'cyan');
    const textColor = this.getColorFunction(options.textColor || 'white');
    
    // Calcular ancho máximo del contenido
    const maxWidth = Math.max(...lines.map(l => l.length)) + padding * 2;
    const horizontalBorder = '─'.repeat(maxWidth);
    
    // Imprimir caja
    console.log(borderColor(`╭${horizontalBorder}╮`));
    lines.forEach(line => {
      const paddedLine = ' '.repeat(padding) + line.padEnd(maxWidth - padding);
      console.log(borderColor('│') + textColor(paddedLine) + borderColor('│'));
    });
    console.log(borderColor(`╰${horizontalBorder}╯`));
  }

  /**
   * Imprime un badge/etiqueta con estilo y fondo de color
   * Útil para estados, categorías, etc.
   */
  badge(text: string, style: BadgeStyle = 'info'): void {
    if (!this.enabled) return;
    
    let badgeText: string;
    
    switch (style) {
      case 'success':
        badgeText = this.colors.green.bold(` ${text.toUpperCase()} `);
        break;
      case 'error':
        badgeText = this.colors.red.bold(` ${text.toUpperCase()} `);
        break;
      case 'warning':
        badgeText = this.colors.yellow.bold(` ${text.toUpperCase()} `);
        break;
      case 'info':
        badgeText = this.colors.cyan.bold(` ${text.toUpperCase()} `);
        break;
      case 'primary':
        badgeText = this.colors.magenta.bold(` ${text.toUpperCase()} `);
        break;
      case 'secondary':
        badgeText = this.colors.gray.bold(` ${text.toUpperCase()} `);
        break;
      default:
        badgeText = this.colors.white.bold(` ${text.toUpperCase()} `);
    }
    
    console.log(badgeText);
  }

  /**
   * Imprime una barra de progreso visual con porcentaje
   * Usa colores vibrantes para indicar el progreso
   */
  progress(current: number, total: number, label?: string): void {
    if (!this.enabled) return;
    
    const percentage = Math.round((current / total) * 100);
    const barLength = 30;
    const filledLength = Math.round((barLength * current) / total);
    const emptyLength = barLength - filledLength;
    
    // Colorear barra según el progreso
    let barColor = this.colors.cyan;
    if (percentage >= 100) barColor = this.colors.green;
    else if (percentage >= 75) barColor = this.colors.cyan;
    else if (percentage >= 50) barColor = this.colors.yellow;
    else barColor = this.colors.magenta;
    
    const filledBar = barColor('█'.repeat(filledLength));
    const emptyBar = this.colors.gray('░'.repeat(emptyLength));
    const percentText = this.colors.white(`${percentage}%`);
    const countText = this.colors.gray(`(${current}/${total})`);
    
    const progressBar = `${filledBar}${emptyBar} ${percentText} ${countText}`;
    
    if (label) {
      console.log(this.colors.cyan(`${label}: `) + progressBar);
    } else {
      console.log(progressBar);
    }
  }

  /**
   * Imprime un mensaje plano sin formato especial
   * Útil para texto que acompaña elementos visuales
   */
  plain(message: string): void {
    if (!this.enabled) return;
    console.log(message);
  }

  /**
   * Imprime una o más líneas en blanco
   */
  newLine(count: number = 1): void {
    if (!this.enabled) return;
    console.log('\n'.repeat(count - 1));
  }

  /**
   * Helper privado para obtener función de color según nombre
   */
  private getColorFunction(colorName: string): ReturnType<typeof chalk.hex> {
    switch (colorName) {
      case 'cyan': return this.colors.cyan;
      case 'magenta': return this.colors.magenta;
      case 'yellow': return this.colors.yellow;
      case 'green': return this.colors.green;
      case 'red': return this.colors.red;
      case 'gray': return this.colors.gray;
      case 'white': return this.colors.white;
      default: return this.colors.white;
    }
  }
}

/**
 * Factory para crear instancia de ChalkConsoleLogger
 */
export const createChalkLogger = (options?: ChalkConsoleLoggerOptions): IChalkConsoleLogger => {
  return new ChalkConsoleLogger(options);
};
