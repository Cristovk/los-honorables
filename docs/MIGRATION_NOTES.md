# 🔄 Notas de Migración: Firebase → Supabase

> ⚠️ **DOCUMENTO DE TRANSICIÓN**: Este documento explica la migración estratégica de Firebase/Firestore a Supabase (PostgreSQL) y las nuevas funcionalidades implementadas.

---

## 📊 Resumen Ejecutivo

El proyecto **Los Honorables** ha migrado completamente de Firebase/Firestore a **Supabase (PostgreSQL)** por las siguientes razones estratégicas:

### 💰 Análisis de Costos

| Aspecto | Firebase (Firestore) | Supabase (PostgreSQL) | Ganancia |
|---------|----------------------|-----------------------|----------|
| **Plan Gratuito** | 50K reads/día, 20K writes/día | Sin límites de operaciones | ✅ Ilimitado |
| **Carga Inicial** | $50-100 USD (excede límites) | $0 (sin costo por operaciones) | ✅ $50-100 USD ahorrados |
| **Costo Mensual** | $10-20 USD | $0 (hasta 500MB DB) | ✅ $10-20 USD/mes ahorrados |
| **Almacenamiento** | 1GB (gratis) | 500MB DB + 5GB bandwidth | ⚖️ Suficiente |
| **Escalabilidad** | Plan Blaze (variable) | Plan Pro $25/mes (8GB) | ✅ Predecible |

**Total ahorrado anual**: ~$120-240 USD + carga inicial $50-100 USD = **$170-340 USD**

### 🎯 Ventajas Técnicas

1. **Datos Relacionales Nativos**: Los datos de asistencia son naturalmente relacionales (diputados ↔ sesiones ↔ asistencias)
2. **Queries SQL Complejas**: JOINs, agregaciones, GROUP BY sin pre-calcular
3. **Vistas Materializadas**: Estadísticas pre-calculadas actualizables
4. **Sin Límites de Operaciones**: Crítico para carga histórica de ~813K registros
5. **Backups Automáticos**: Incluidos en plan gratuito
6. **Row Level Security**: Control de acceso granular incorporado

---

## 🏗️ Arquitectura Anterior vs Nueva

### ❌ Arquitectura Anterior (Firebase)

```
APIs Externas → Backend → Firestore (NoSQL) → Cloud Functions → Frontend
```

**Problemas**:
- Costo prohibitivo para carga inicial
- Queries complejas requieren pre-cálculo
- Límites estrictos en plan gratuito
- Estructura NoSQL no optimal para datos relacionales

### ✅ Arquitectura Nueva (Supabase)

```
APIs Externas → Backend → PostgreSQL/Supabase → API REST/GraphQL → Frontend
                    ↓
              Logging Dual
         (Pino + ChalkConsole)
```

**Beneficios**:
- Costo $0 indefinidamente
- Queries SQL nativos y eficientes
- APIs auto-generadas (REST + GraphQL)
- Logging estructurado para monitoreo

---

## 📦 Nuevas Funcionalidades Implementadas

### 1. 📝 Sistema de Logging Dual

**Ubicación**: `src/services/logging/`

#### **Pino Logger** (Producción)
```typescript
import { PinoLoggerService } from '@services/logging';

const logger = new PinoLoggerService({ level: 'info' });
logger.info('Procesando sesión', { sesionId: 12345, diputadoId: 857 });
```

**Características**:
- Formato JSON estructurado
- Niveles: trace, debug, info, warn, error, fatal
- Integrable con servicios de logs (Datadog, Logtail)

#### **Chalk Console Logger** (Desarrollo/CLI)
```typescript
import { ChalkConsoleLogger } from '@services/logging';

const logger = new ChalkConsoleLogger();
logger.header('ANÁLISIS DE ASISTENCIA');
logger.success('Sesión procesada exitosamente');
logger.data('Total sesiones', 150);
logger.progress(50, 100, 'Progreso general');
```

**Características**:
- Paleta de colores cyberpunk
- Headers, badges, listas, boxes, progress bars
- Ideal para CLIs y feedback visual

### 2. 🛠️ Sistema de Funciones Manuales (CLI)

**Ubicación**: `src/functions/manual/`

**Comando**:
```bash
bun run functions
```

#### Funciones Disponibles:

##### **consultar-ministerios**
```bash
# Consulta ministerios disponibles de Chile
bun run functions → Seleccionar opción "consultar-ministerios"
```

##### **consultar-asistencia-diputado-sala**
```bash
# Obtiene asistencia histórica de un diputado específico
# Parámetros: base_url, start_year, end_year, diputado_id
bun run functions → "consultar-asistencia-diputado-sala"
```

**Features**:
- Throttling configurable (200-500ms)
- Reintentos automáticos (3 intentos con backoff exponencial)
- Sistema de caché persistente local
- Progress feedback con ChalkConsoleLogger

##### **resumen-asistencia-cache**
```bash
# Agrega y muestra estadísticas desde caché local
bun run functions → "resumen-asistencia-cache"
```

### 3. 💾 Sistema de Caché Local

**Ubicación**: `.cache/` (git-ignored)

**Formato**:
```json
{
  "diputadoId": "857",
  "runs": [
    {
      "years": {
        "start": 2022,
        "end": 2024,
        "processedYears": [2022, 2023, 2024]
      },
      "totalCelebradas": 150,
      "categorias": {
        "asiste": { "percent": 85.5, "count": 128 },
        "justificado": { "percent": 10.2, "count": 15 },
        "noAsiste": { "percent": 4.3, "count": 7 }
      },
      "timestamp": "2025-01-19T20:00:00Z"
    }
  ]
}
```

**Propósito**:
- Desarrollo y testing sin saturar API externa
- Evitar llamadas repetitivas
- Validación de lógica antes de migrar a Supabase

---

## 🗄️ Nuevo Esquema de Base de Datos (PostgreSQL)

### Modelo Relacional

```sql
-- Tabla de diputados
CREATE TABLE diputados (
    id VARCHAR PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    apellido_paterno VARCHAR NOT NULL,
    apellido_materno VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de sesiones
CREATE TABLE sesiones (
    id VARCHAR PRIMARY KEY,
    fecha DATE NOT NULL,
    tipo VARCHAR NOT NULL, -- 'Sala', 'Comision'
    numero_sesion INT,
    legislatura INT,
    estado VARCHAR NOT NULL, -- 'Celebrada', 'Programada', 'Suspendida'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla pivote de asistencias
CREATE TABLE asistencias (
    id SERIAL PRIMARY KEY,
    diputado_id VARCHAR NOT NULL REFERENCES diputados(id),
    sesion_id VARCHAR NOT NULL REFERENCES sesiones(id),
    tipo_asistencia VARCHAR NOT NULL, -- 'Asiste', 'Justificado', 'NoAsiste'
    tipo_asistencia_code INT NOT NULL, -- 1, 2, 0
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(diputado_id, sesion_id) -- Prevención de duplicados
);

-- Tabla de control de sincronización
CREATE TABLE sincronizacion (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR NOT NULL, -- 'carga_inicial', 'actualizacion_incremental'
    ultima_sesion_procesada VARCHAR,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    años_procesados JSONB,
    registros_procesados INT DEFAULT 0,
    estado VARCHAR NOT NULL -- 'en_progreso', 'completado', 'error'
);

-- Vista materializada para estadísticas agregadas
CREATE MATERIALIZED VIEW estadisticas_diputados AS
SELECT 
    d.id,
    d.nombre,
    d.apellido_paterno,
    d.apellido_materno,
    COUNT(*) as total_sesiones,
    COUNT(*) FILTER (WHERE a.tipo_asistencia_code = 1) as asiste,
    COUNT(*) FILTER (WHERE a.tipo_asistencia_code = 2) as justificado,
    COUNT(*) FILTER (WHERE a.tipo_asistencia_code = 0) as no_asiste,
    ROUND(100.0 * COUNT(*) FILTER (WHERE a.tipo_asistencia_code = 1) / NULLIF(COUNT(*), 0), 2) as porcentaje_asistencia
FROM diputados d
LEFT JOIN asistencias a ON d.id = a.diputado_id
LEFT JOIN sesiones s ON a.sesion_id = s.id
WHERE s.estado = 'Celebrada'
GROUP BY d.id, d.nombre, d.apellido_paterno, d.apellido_materno;

-- Índices para optimización
CREATE INDEX idx_asistencias_diputado ON asistencias(diputado_id);
CREATE INDEX idx_asistencias_sesion ON asistencias(sesion_id);
CREATE INDEX idx_sesiones_fecha ON sesiones(fecha);
CREATE INDEX idx_sesiones_estado ON sesiones(estado);
```

### Refrescar Vista Materializada

```sql
-- Ejecutar después de insertar nuevos registros
REFRESH MATERIALIZED VIEW estadisticas_diputados;
```

---

## 🔄 Estrategia de Migración

### Fase 1: Carga Inicial Histórica (1990-2025)

**Volumen**: ~813,000 registros (155 diputados × 150 sesiones/año × 35 años)

**Script**: `src/scripts/sync-initial-data.ts` (pendiente implementación)

**Estrategia**:
```typescript
// Pseudocódigo de carga inicial
for (let year = 1990; year <= 2025; year++) {
  const sesiones = await obtenerSesionesPorAño(year);
  
  for (const sesion of sesiones.filter(s => s.estado === 'Celebrada')) {
    // Insertar sesión (si no existe)
    await supabase.from('sesiones').upsert({ id: sesion.id, ... });
    
    // Obtener asistencia de todos los diputados
    const asistencias = await obtenerAsistenciaSesion(sesion.id);
    
    for (const diputado of diputados) {
      const asistencia = asistencias.find(a => a.diputadoId === diputado.id);
      
      // Insertar asistencia (ignora duplicados por UNIQUE constraint)
      await supabase.from('asistencias').upsert({
        diputado_id: diputado.id,
        sesion_id: sesion.id,
        tipo_asistencia_code: asistencia.codigo
      });
    }
    
    // Throttling: 500ms entre sesiones
    await sleep(500);
    
    // Checkpoint cada 10 sesiones
    if (sesion.numero % 10 === 0) {
      await guardarCheckpoint(year, sesion.numero);
    }
  }
}

// Refrescar estadísticas al final
await supabase.rpc('refresh_materialized_view', { view_name: 'estadisticas_diputados' });
```

**Estimado de tiempo**: ~35 horas continuas con throttling de 500ms

### Fase 2: Actualización Incremental (Semanal)

**Volumen**: ~500-800 registros/semana (3-5 sesiones × 155 diputados)

**Script**: `src/scripts/sync-weekly-data.ts` (pendiente implementación)

**Estrategia**:
```typescript
// Pseudocódigo de actualización semanal
const ultimaSesion = await supabase
  .from('sincronizacion')
  .select('ultima_sesion_procesada')
  .order('ultima_actualizacion', { ascending: false })
  .limit(1);

const sesionesNuevas = await obtenerSesionesSinceFecha(ultimaSesion.fecha);

for (const sesion of sesionesNuevas) {
  // Mismo proceso que carga inicial pero solo para sesiones nuevas
  // Throttling: 200ms (menos agresivo)
}

// Refrescar estadísticas
await supabase.rpc('refresh_materialized_view', { view_name: 'estadisticas_diputados' });
```

---

## 🚀 Roadmap de Migración

### ✅ Completado

- [x] Sistema de logging dual (Pino + ChalkConsole)
- [x] Funciones manuales CLI
- [x] Sistema de caché local persistente
- [x] Agregación de estadísticas
- [x] Throttling y rate limiting
- [x] Análisis estratégico y decisión de migración

### 🔄 En Progreso

- [ ] Diseño completo de esquema PostgreSQL
- [ ] Scripts de migración SQL
- [ ] Configuración de Supabase

### 📋 Pendiente

- [ ] Implementación de `sync-initial-data.ts`
- [ ] Implementación de `sync-weekly-data.ts`
- [ ] Integración de Supabase client en backend
- [ ] Actualización de API endpoints para usar PostgreSQL
- [ ] Testing end-to-end de flujo completo
- [ ] Eliminación de código legacy Firebase

---

## 📚 Referencias

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Análisis estratégico completo](../CONTEXT.md#análisis-de-costos-y-decisión-estratégica)
- [Sistema de logging](../CONTEXT.md#sistema-de-logging)
- [Funciones manuales](src/functions/manual/README.md)

---

**Autor**: Winnie Cofre  
**Fecha de Migración**: Enero 2025  
**Versión**: 2.0.0
