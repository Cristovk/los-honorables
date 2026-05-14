# Sistema de Logging

El proyecto utiliza **dos sistemas de logging separados** con propósitos distintos:

1. **PinoLoggerService**: Logger estructurado para rastreo de aplicación, debugging y monitoreo
2. **ChalkConsoleLogger**: Logger visual para outputs coloridos en consola con estética cyberpunk

---

## 📊 PinoLoggerService

### Propósito

Logger de alto rendimiento basado en [Pino](https://getpino.io/) que genera logs estructurados en formato JSON. Ideal para:

- Rastrear el flujo de ejecución de la aplicación
- Registrar errores con contexto detallado
- Monitoreo y debugging en producción
- Métricas de performance
- Integración con sistemas de agregación de logs

### Instalación

```bash
bun add pino@10.1.0
bun add -d pino-pretty
```

### Uso Básico

```typescript
import { createLogger } from '@services/logging';

const logger = createLogger({
  serviceName: 'mi-servicio',
  level: 'info',
  prettyPrint: true // Solo en desarrollo
});

// Logs informativos
logger.info('Servidor iniciado', { port: 3000, env: 'development' });

// Logs de error con contexto
logger.error('Error al conectar a la base de datos', 
  new Error('Connection timeout'), 
  { host: 'db.example.com', retries: 3 }
);

// Logs de advertencia
logger.warn('Configuración no encontrada, usando valores por defecto', {
  config: 'api.timeout'
});

// Logs de debug (solo visibles en nivel debug)
logger.debug('Cache hit', { key: 'user:123', ttl: 3600 });
```

### Métricas de Performance

```typescript
// Iniciar un timer
logger.time('proceso-complejo');

// ... ejecutar operación ...

// Terminar timer y registrar duración
logger.timeEnd('proceso-complejo', { records: 1000 });
// Output: "Timer completado: proceso-complejo" { duration: "123.45ms", durationMs: 123.45, records: 1000 }
```

### Configuración Avanzada

```typescript
import { PinoLoggerService } from '@services/logging';

const logger = new PinoLoggerService({
  serviceName: 'api-gateway',
  level: 'debug',
  prettyPrint: false, // JSON puro en producción
  includeTimestamp: true,
  base: {
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  }
});
```

### Niveles de Log

- **error**: Errores críticos que requieren atención inmediata
- **warn**: Advertencias que no detienen la ejecución
- **info**: Información general del flujo de la aplicación (por defecto)
- **debug**: Información detallada para debugging

### Formato de Output

**Modo desarrollo (prettyPrint: true):**
```
[2025-11-19 16:30:45] INFO  (sync-comunes-data): Iniciando sincronización de comunas
[2025-11-19 16:30:46] DEBUG (sync-comunes-data): Obtenidos 346 documentos { collection: "comunas" }
```

**Modo producción (JSON):**
```json
{"level":"info","time":"2025-11-19T19:30:45.123Z","service":"sync-comunes-data","msg":"Iniciando sincronización de comunas"}
{"level":"debug","time":"2025-11-19T19:30:46.456Z","service":"sync-comunes-data","collection":"comunas","msg":"Obtenidos 346 documentos"}
```

---

## 🎨 ChalkConsoleLogger

### Propósito

Logger visual que utiliza [Chalk](https://github.com/chalk/chalk) para crear outputs coloridos y estilizados en consola. Ideal para:

- CLIs y herramientas de línea de comandos
- Scripts que interactúan con usuarios
- Reportes visuales y resúmenes
- Outputs de desarrollo con formato atractivo

### Paleta de Colores Cyberpunk

El logger utiliza una paleta vibrante inspirada en la estética cyberpunk:

| Color | Hex | Uso |
|-------|-----|-----|
| **Magenta Neón** | `#FF00FF` | Headers, badges primarios, bullets |
| **Cyan Brillante** | `#00FFFF` | Información, datos, labels |
| **Verde Lima Neón** | `#7CFC00` | Mensajes de éxito, confirmaciones |
| **Amarillo Oro** | `#FFFF00` | Advertencias |
| **Rojo Sangre** | `#FF3300` | Errores |
| **Gris Oscuro** | `#505050` | Separadores, elementos secundarios |
| **Rosa** | `#FF1493` | Alternativo |
| **Púrpura** | `#9C27B0` | Alternativo |

### Instalación

```bash
bun add chalk@5.6.2
```

> **Nota**: Chalk 5.x es ESM-only. El proyecto debe estar configurado para soportar módulos ESM.

### Uso Básico

```typescript
import { ChalkConsoleLogger } from '@services/logging';

const logger = new ChalkConsoleLogger();

// Header principal
logger.header('SISTEMA INICIADO');

// Información general
logger.info('Servidor escuchando en puerto 3000');

// Éxito
logger.success('Conexión establecida correctamente');

// Advertencia
logger.warning('Configuración no encontrada, usando valores por defecto');

// Error
logger.error('No se pudo conectar a la base de datos');
```

### Métodos Disponibles

#### `header(text: string)`

Header grande con bordes decorativos en magenta neón.

```typescript
logger.header('RESUMEN DE OPERACIÓN');
```

Output:
```
╔════════════════════════════════════════════════════════════╗
║ RESUMEN DE OPERACIÓN                                       ║
╚════════════════════════════════════════════════════════════╝
```

#### `subheader(text: string)`

Subheader con separador en cyan.

```typescript
logger.subheader('DETALLE DE CORRIDAS');
```

Output:
```
▸ DETALLE DE CORRIDAS
────────────────────────────────────────────────────────────
```

#### `separator(length?: number, char?: string)`

Línea separadora personalizable.

```typescript
logger.separator();           // Separador por defecto
logger.separator(40, '═');    // Separador personalizado
```

#### `success(message: string)`

Mensaje de éxito con icono ✓ en verde neón.

```typescript
logger.success('Operación completada exitosamente');
// Output: ✓ Operación completada exitosamente
```

#### `error(message: string)`

Mensaje de error con icono ✗ en rojo.

```typescript
logger.error('Error al procesar la solicitud');
// Output: ✗ Error al procesar la solicitud
```

#### `warning(message: string)`

Mensaje de advertencia con icono ⚠ en amarillo.

```typescript
logger.warning('El archivo de configuración no existe');
// Output: ⚠ El archivo de configuración no existe
```

#### `info(message: string)`

Mensaje informativo con icono ℹ en cyan.

```typescript
logger.info('Procesando 100 registros...');
// Output: ℹ Procesando 100 registros...
```

#### `data(label: string, value: string | number)`

Par clave-valor en formato tabular (label en cyan, valor en blanco).

```typescript
logger.data('Diputado', '12345');
logger.data('Total sesiones', 150);
logger.data('Años consultados', '2020, 2021, 2022');
```

Output:
```
  Diputado: 12345
  Total sesiones: 150
  Años consultados: 2020, 2021, 2022
```

#### `list(items: string[] | ListItem[])`

Lista con bullets coloridos.

```typescript
// Lista simple
logger.list([
  'Asiste: 85% (128)',
  'Justificado: 10% (15)',
  'No Asiste: 5% (7)'
]);

// Lista con configuración personalizada
logger.list([
  { text: 'Item principal', bullet: '●' },
  { text: 'Sub-item 1', indent: 2, bullet: '◦' },
  { text: 'Sub-item 2', indent: 2, bullet: '◦' }
]);
```

#### `box(content: string | string[], options?: BoxOptions)`

Contenido en caja decorativa.

```typescript
logger.box('¡ATENCIÓN! Este es un mensaje importante', {
  borderColor: 'yellow',
  textColor: 'white',
  padding: 3
});

logger.box([
  'Línea 1',
  'Línea 2',
  'Línea 3'
], {
  borderColor: 'cyan'
});
```

Output:
```
╭─────────────────────────────────────────────╮
│   ¡ATENCIÓN! Este es un mensaje importante   │
╰─────────────────────────────────────────────╯
```

#### `badge(text: string, style?: BadgeStyle)`

Badge/etiqueta con estilo.

```typescript
logger.badge('Success', 'success');  // Verde
logger.badge('Error', 'error');      // Rojo
logger.badge('Warning', 'warning');  // Amarillo
logger.badge('Info', 'info');        // Cyan
logger.badge('Primary', 'primary');  // Magenta
logger.badge('Beta', 'secondary');   // Gris
```

#### `progress(current: number, total: number, label?: string)`

Barra de progreso visual con colores dinámicos.

```typescript
logger.progress(45, 100, 'Procesando registros');
logger.progress(100, 100);  // Sin label
```

Output:
```
Procesando registros: █████████████░░░░░░░░░░░░░░░░░ 45% (45/100)
```

#### `plain(message: string)`

Mensaje sin formato especial.

```typescript
logger.plain('Texto sin formato');
```

#### `newLine(count?: number)`

Imprime líneas en blanco.

```typescript
logger.newLine();    // 1 línea
logger.newLine(3);   // 3 líneas
```

### Ejemplo Completo

```typescript
import { ChalkConsoleLogger } from '@services/logging';

const logger = new ChalkConsoleLogger();

// Header principal
logger.header('RESUMEN DE ASISTENCIA');

// Información general
logger.data('Diputado', '12345');
logger.data('Período', '2020-2024');
logger.data('Total sesiones', 150);
logger.separator();

// Estadísticas
logger.list([
  'Asiste: 85% (128)',
  'Justificado: 10% (15)',
  'No Asiste: 5% (7)'
]);

logger.newLine();

// Detalle por año
logger.subheader('DETALLE POR AÑO');

logger.badge('2024', 'primary');
logger.progress(28, 30, 'Asistencia');
logger.separator();

// Mensaje final
logger.success('Reporte generado exitosamente');
```

---

## 🎯 ¿Cuándo usar cada logger?

### Usar **PinoLoggerService** para:

✅ Logging en la capa de aplicación (repositorios, servicios, middleware)  
✅ Rastreo de errores con stack traces  
✅ Métricas y performance tracking  
✅ Logs que serán parseados por sistemas de monitoreo  
✅ Debugging de problemas en producción  

**Ejemplo:**
```typescript
// En un repositorio o servicio
const logger = createLogger({ serviceName: 'user-service' });

logger.info('Iniciando autenticación', { userId: 123 });
logger.time('db-query');
// ... query ...
logger.timeEnd('db-query', { records: 50 });
```

### Usar **ChalkConsoleLogger** para:

✅ CLIs y comandos interactivos  
✅ Scripts manuales que muestran resultados al usuario  
✅ Reportes visuales y resúmenes  
✅ Outputs de desarrollo con formato legible  
✅ Herramientas de administración

**Ejemplo:**
```typescript
// En un script CLI o función manual
const logger = new ChalkConsoleLogger();

logger.header('SINCRONIZACIÓN DE DATOS');
logger.info('Conectando a la API...');
logger.success('Conexión establecida');
logger.progress(100, 346, 'Comunas sincronizadas');
```

---

## 🔧 Configuración del Proyecto

### TypeScript

Ambos loggers están completamente tipados con TypeScript:

```typescript
import type { 
  PinoLoggerOptions,
  ChalkConsoleLoggerOptions,
  ILogger,
  IChalkConsoleLogger 
} from '@services/logging';
```

### Importación

```typescript
// Importar desde el barrel export
import { 
  createLogger,           // Factory de PinoLogger
  createPrettyLogger,     // Factory con pretty-print
  ChalkConsoleLogger,     // Clase del logger visual
  createChalkLogger       // Factory de ChalkLogger
} from '@services/logging';
```

### Path Aliases

El proyecto usa path aliases configurados en `tsconfig.json`:

```typescript
import { createLogger } from '@services/logging';  // ✅ Correcto
```

---

## 📚 Best Practices

### 1. No usar `console.log()` en código de producción

```typescript
// ❌ Evitar
console.log('Usuario autenticado:', userId);

// ✅ Usar PinoLogger
logger.info('Usuario autenticado', { userId });
```

### 2. Incluir contexto estructurado

```typescript
// ❌ Pobre contexto
logger.error('Error al guardar');

// ✅ Rico en contexto
logger.error('Error al guardar usuario', 
  error, 
  { 
    userId: 123, 
    operation: 'save',
    collection: 'users',
    timestamp: Date.now()
  }
);
```

### 3. Usar niveles apropiados

```typescript
logger.error()   // Solo para errores críticos
logger.warn()    // Para situaciones anormales pero no críticas
logger.info()    // Para flujo normal de la aplicación
logger.debug()   // Para debugging detallado
```

### 4. Instanciar loggers con `serviceName`

```typescript
// ✅ Ayuda a identificar el origen de los logs
const logger = createLogger({ 
  serviceName: 'comunas-repository'
});
```

### 5. En desarrollo, usar pretty-print

```typescript
const logger = createLogger({
  serviceName: 'api',
  prettyPrint: process.env.NODE_ENV === 'development'
});
```

---

## 🚀 Migración desde Winston

Si estás migrando código que usa Winston:

```typescript
// Antes (Winston)
import winston from 'winston';
const logger = winston.createLogger({ ... });
logger.info('mensaje');

// Después (Pino)
import { createLogger } from '@services/logging';
const logger = createLogger({ serviceName: 'mi-servicio' });
logger.info('mensaje');
```

---

## 📖 Referencias

- [Documentación de Pino](https://getpino.io/)
- [Documentación de Chalk](https://github.com/chalk/chalk)
- [Best Practices de Logging](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/)
