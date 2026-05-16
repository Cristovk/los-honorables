# 📊 Scripts SQL para Tablas de la API de Diputados

## 📋 Descripción

Este directorio contiene scripts SQL para crear tablas en Supabase (PostgreSQL) basadas en las estructuras de los DTOs (`Data Transfer Objects`) que vienen desde la API externa de la Cámara de Diputados de Chile.

**Origen**: `src/interface/external/camara-diputados/`

---

## 📁 Archivos Disponibles

| Archivo | Módulo | Descripción |
|---------|--------|-------------|
| **`diputados.sql`** | Diputados | Diputados, partidos y militancias |
| **`sala.sql`** | Sala | Sesiones de sala y asistencias |
| **`comisiones.sql`** | Comisiones | Comisiones y sesiones de comisión |
| **`votaciones.sql`** | Votaciones | Votaciones y votos individuales |
| **`periodosLegislativos.sql`** | Períodos | Períodos legislativos y legislaturas |
| **`legislativo.sql`** | Legislativo | Proyectos de ley, autores y materias |
| **`proyectos.sql`** | Proyectos | Votaciones específicas por proyecto |
| **`proyectosAcuerdo.sql`** | Acuerdos | Proyectos de acuerdo |
| **`proyectosResolucion.sql`** | Resoluciones | Proyectos de resolución |
| **`comunes.sql`** | Comunes | Ministerios y catálogos |

---

## 🎯 Filosofía de Diseño

### **Prefijo `api_`**
Todas las tablas tienen el prefijo `api_` para indicar que son **snapshots directos de la API externa**. Esto permite:

1. **Separación clara** entre datos crudos de la API y datos normalizados
2. **Auditoría completa** con columna `raw_data JSONB` conteniendo el JSON original
3. **Flexibilidad** para mapear a tablas normalizadas sin perder el dato original

### **Metadatos automáticos**
Todas las tablas incluyen:
- `raw_data JSONB` - JSON completo de la API
- `created_at TIMESTAMPTZ` - Fecha de inserción
- `updated_at TIMESTAMPTZ` - Fecha de última actualización (actualizado automáticamente con triggers)

### **Estructura de campos `valor` y `texto`**

Los DTOs de la API a menudo entregan campos como `Record<string, string>` (por ejemplo, `Tipo`, `Estado`). Esto se mapea como:

```typescript
// En DTO
Tipo: {
  Valor: "1",
  _text: "Ordinaria"
}

// En PostgreSQL
tipo_valor VARCHAR(50),  -- "1"
tipo_texto VARCHAR(200)  -- "Ordinaria"
```

---

## 🚀 Orden de Ejecución

### **Prerequisitos** (ejecutar primero):
1. `migrations/001_initial_schema.sql` - Tablas base (diputados, sesiones, asistencias)
2. `migrations/002_optimized_schema.sql` - Esquema optimizado
3. `migrations/003_seed_data_chile.sql` - Datos de Chile (regiones, etc.)

### **Luego ejecutar estos scripts en orden**:

```sql
-- Paso 1: Crear función helper de triggers (diputados.sql la crea)
-- Paso 2: Módulos principales
\i src/models/create-table/diputados.sql
\i src/models/create-table/comunes.sql
\i src/models/create-table/periodosLegislativos.sql

-- Paso 3: Módulos dependientes
\i src/models/create-table/sala.sql
\i src/models/create-table/comisiones.sql
\i src/models/create-table/legislativo.sql

-- Paso 4: Módulos de votaciones y proyectos especiales
\i src/models/create-table/votaciones.sql
\i src/models/create-table/proyectos.sql
\i src/models/create-table/proyectosAcuerdo.sql
\i src/models/create-table/proyectosResolucion.sql
```

---

## 📊 Tablas Creadas por Módulo

### **diputados.sql**
- `api_diputados` - Información personal de diputados
- `api_partidos` - Partidos políticos
- `api_militancias` - Historial de militancias por diputado

### **sala.sql**
- `api_sesiones_sala` - Sesiones de sala (plenarias)
- `api_asistencias_sala` - Asistencias por sesión/diputado

### **comisiones.sql**
- `api_comisiones` - Comisiones parlamentarias
- `api_sesiones_comision` - Sesiones de comisión

### **votaciones.sql**
- `api_votaciones` - Votaciones generales
- `api_votos_diputados` - Votos individuales

### **periodosLegislativos.sql**
- `api_periodos_legislativos` - Períodos legislativos
- `api_legislaturas` - Legislaturas dentro de cada período

### **legislativo.sql**
- `api_proyectos_ley` - Proyectos de ley (boletines)
- `api_proyecto_materias` - Materias asociadas a proyectos
- `api_proyecto_autores` - Autores de proyectos

### **proyectos.sql**
- `api_votaciones_proyecto_ley` - Votaciones específicas por proyecto

### **proyectosAcuerdo.sql**
- `api_proyectos_acuerdo` - Proyectos de acuerdo

### **proyectosResolucion.sql**
- `api_proyectos_resolucion` - Proyectos de resolución

### **comunes.sql**
- `api_ministerios` - Ministerios de Chile

---

## 🔗 Relaciones entre Tablas

### **Flujo de datos típico**:

```
API Externa
    ↓
api_diputados → api_militancias → api_partidos
    ↓
api_sesiones_sala → api_asistencias_sala
    ↓
api_proyectos_ley → api_votaciones → api_votos_diputados
```

### **Foreign Keys Principales**:

- `api_militancias.diputado_id` → `diputados.id`
- `api_asistencias_sala.diputado_id` → `diputados.id`
- `api_asistencias_sala.sesion_sala_id` → `api_sesiones_sala.id`
- `api_votaciones.proyecto_id` → `api_proyectos_ley.id`
- `api_votos_diputados.diputado_id` → `diputados.id`

---

## 💾 Columnas Especiales

### **`raw_data JSONB`**
Todas las tablas incluyen esta columna para almacenar el JSON original completo de la API:

```sql
-- Consultar datos del JSON
SELECT raw_data->>'Nombre' FROM api_diputados WHERE id = '857';

-- Buscar en el JSON
SELECT * FROM api_sesiones_sala 
WHERE raw_data->>'Estado' = 'Celebrada';
```

### **`created_at` y `updated_at`**
Todas las tablas incluyen timestamps automáticos:

```sql
-- Ver registros recientes
SELECT * FROM api_diputados 
WHERE created_at > NOW() - INTERVAL '7 days';

-- Ver registros actualizados hoy
SELECT * FROM api_sesiones_sala 
WHERE updated_at::date = CURRENT_DATE;
```


---

## 📈 Queries de Ejemplo

### **Ver todas las tablas API creadas**:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'api_%' 
ORDER BY table_name;
```

### **Estadísticas de asistencia de un diputado**:
```sql
SELECT * FROM v_asistencia_diputado_por_anno 
WHERE diputado_id = '857'
ORDER BY anno DESC;
```

### **Top 10 proyectos con más votaciones**:
```sql
SELECT 
    p.id,
    p.titulo,
    COUNT(v.id) as total_votaciones
FROM api_proyectos_ley p
LEFT JOIN api_votaciones v ON p.id = v.proyecto_id
GROUP BY p.id, p.titulo
ORDER BY total_votaciones DESC
LIMIT 10;
```

### **Votos de un diputado en un proyecto específico**:
```sql
SELECT 
    v.fecha,
    v.descripcion,
    vd.voto
FROM api_votaciones v
JOIN api_votos_diputados vd ON v.id = vd.votacion_id
WHERE v.proyecto_id = '12345-07' 
  AND vd.diputado_id = '857'
ORDER BY v.fecha;
```

---

## ⚠️ Notas Importantes

### **1. Idempotencia**
Todos los scripts usan `CREATE TABLE IF NOT EXISTS` y `ON CONFLICT DO UPDATE/NOTHING`, por lo que son seguros de ejecutar múltiples veces.

### **2. Dependencias**
Los scripts asumen que ya existen:
- Tabla `diputados` (de migrations previas)
- Tabla `sesiones` (de migrations previas)
- Tabla `asistencias` (de migrations previas)

### **3. Foreign Keys a tablas normalizadas**
Varias tablas `api_*` incluyen columnas FK opcionales para mapear a tablas normalizadas:
- `partido_normalizado_id` en `api_partidos` → `partidos_politicos.id`
- `sesion_normalizada_id` en `api_sesiones_sala` → `sesiones.id`

Estas son NULL por defecto y se pueden poblar después con lógica de mapeo.

---

## 🔄 Sincronización con la API

### **Flujo recomendado**:

1. **Consultar API externa** usando los endpoints documentados
2. **Parsear respuesta** con los DTOs en `src/interface/external/camara-diputados/`
3. **Insertar/actualizar** directamente en las tablas con `INSERT ... ON CONFLICT`
4. **Guardar `raw_data`** con el JSON completo para auditoría

### **Ejemplo con TypeScript (Supabase Client)**:

```typescript
import { supabaseAdmin } from '@config/supabase.config';
import { DiputadoBaseDto } from '@interface/external/camara-diputados/diputados/diputados.dto';

async function syncDiputado(dto: DiputadoBaseDto) {
  const { data, error } = await supabaseAdmin
    .from('api_diputados')
    .upsert({
      id: dto.Id,
      nombre: dto.Nombre,
      nombre2: dto.Nombre2,
      apellido_paterno: dto.ApellidoPaterno,
      apellido_materno: dto.ApellidoMaterno,
      fecha_nacimiento: dto.FechaNacimiento,
      rut: dto.RUT,
      rut_dv: dto.RUTDV,
      sexo_valor: dto.Sexo.Valor,
      sexo_texto: dto.Sexo._text,
      raw_data: dto // Guardar el DTO completo
    }, {
      onConflict: 'id'
    });
  
  if (error) throw error;
  return data;
}
```

### **Ejemplo directo con SQL**:

```sql
INSERT INTO api_diputados (
    id, nombre, nombre2, apellido_paterno, apellido_materno,
    fecha_nacimiento, rut, rut_dv, sexo_valor, sexo_texto, raw_data
) VALUES (
    '857', 'Juan', 'Carlos', 'Pérez', 'González',
    '1980-01-15', '12345678', '9', 'M', 'Masculino',
    '{"Id": "857", "Nombre": "Juan", ...}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    updated_at = NOW();
```

---

## 📚 Referencias

- **DTOs Origen**: `src/interface/external/camara-diputados/`
- **Migraciones Base**: `migrations/001_initial_schema.sql`, `002_optimized_schema.sql`
- **Config Supabase**: `src/config/supabase.config.ts`
- **Documentación API Externa**: https://opendata.camara.cl/

---

## ✅ Verificación Post-Instalación

Después de ejecutar los scripts, verifica con:

```sql
-- Contar tablas API creadas
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'api_%';
-- Debería retornar: 17 tablas

-- Ver todas las tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'api_%'
ORDER BY table_name;

-- Verificar que los triggers estén creados
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND trigger_name LIKE 'trg_api_%'
ORDER BY event_object_table;
```

---

**Autor**: Generado automáticamente desde DTOs  
**Fecha**: 2025-01-24  
**Versión**: 1.0.0
