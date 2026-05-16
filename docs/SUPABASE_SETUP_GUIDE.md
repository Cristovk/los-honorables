# 🚀 Guía Completa de Configuración de Supabase

## 📋 Resumen

Has completado:
- ✅ Instalación de `@supabase/supabase-js`
- ✅ Creación de cuenta y proyecto en Supabase
- ✅ Configuración de cliente TypeScript (`src/config/supabase.config.ts`)
- ✅ Script SQL de migración inicial (`migrations/001_initial_schema.sql`)
- ✅ Variables de entorno en `.env`

**Siguiente paso**: Configurar tu base de datos en Supabase Dashboard

---

## 🎯 Paso 6: Configurar Credenciales en .env

### 6.1. Obtener las Credenciales

1. Ve a tu dashboard de Supabase: https://app.supabase.com
2. Selecciona tu proyecto "los-honorables" (o el nombre que le hayas puesto)
3. En el menú lateral izquierdo, haz clic en **⚙️ Settings** → **API**
4. Verás tres secciones importantes:

#### **Project URL**
```
https://xxxxxxxxxxxxxx.supabase.co
```
Copia este URL completo

#### **API Keys**

**anon public** (safe to use in browser):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZi...
```
Esta clave es segura para usar en el frontend

**service_role secret** (⚠️ NEVER expose in browser):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZi...
```
**¡IMPORTANTE!** Esta clave es SECRETA y solo debe usarse en el backend

### 6.2. Actualizar tu archivo .env

Abre el archivo `.env` en la raíz de tu proyecto y reemplaza los valores:

```env
# 🗄️ Supabase Configuration (PostgreSQL)
SUPABASE_URL=https://[tu-proyecto-id].supabase.co
SUPABASE_ANON_KEY=[tu-anon-key-completa]
SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key-completa]
```

**Ejemplo real** (con datos ficticios):
```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwNjcyNDAwMCwiZXhwIjoyMDIyMzAwMDAwfQ.abcdefghijklmnopqrstuvwxyz1234567890ABCDEF
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzA2NzI0MDAwLCJleHAiOjIwMjIzMDAwMDB9.XYZabcdefghijklmnopqrstuvwxyz1234567890ABC
```

⚠️ **IMPORTANTE**: 
- NO subas este archivo a GitHub (ya está en `.gitignore`)
- NUNCA expongas `SUPABASE_SERVICE_ROLE_KEY` en el frontend

---

## 🎯 Paso 7: Ejecutar la Migración SQL en Supabase

### 7.1. Método 1: Usando el SQL Editor (RECOMENDADO)

1. En el dashboard de Supabase, ve a **SQL Editor** en el menú lateral
2. Haz clic en **+ New query**
3. Abre el archivo `migrations/001_initial_schema.sql` de tu proyecto
4. **Copia TODO el contenido** del archivo SQL
5. **Pégalo** en el editor SQL de Supabase
6. Haz clic en **▶ Run** (esquina inferior derecha)
7. Espera ~30 segundos mientras se ejecuta el script
8. Deberías ver el mensaje: **"Success. No rows returned"** ✅

### 7.2. Verificar que las Tablas se Crearon

Después de ejecutar el script, verifica que todo se creó correctamente.

#### **Verificar tablas desde SQL Editor**

Ejecuta esta query:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Deberías ver las siguientes tablas (schema completo en `src/models/create-table/structure-table.sql`):

| Tabla | Descripción |
|-------|-------------|
| `asistencias_sala` | Asistencia de diputados por sesión |
| `diputados` | Datos personales de todos los diputados |
| `legislaturas` | Legislaturas dentro de cada período |
| `militancias` | Historial de partidos de cada diputado |
| `ministerios` | Ministerios del gobierno |
| `partidos` | Partidos políticos |
| `periodos_legislativos` | Períodos legislativos (4 años) |
| `porcentaje_asistencia` | Estadísticas anuales de asistencia |
| `proyecto_autores` | Autores de proyectos de ley |
| `proyecto_materias` | Materias de proyectos de ley |
| `proyectos_acuerdo` | Proyectos de acuerdo |
| `proyectos_ley` | Proyectos de ley |
| `proyectos_resolucion` | Proyectos de resolución |
| `regiones` | Regiones de Chile |
| `sesiones_sala` | Sesiones celebradas en sala |
| `votaciones_proyecto_ley` | Votaciones asociadas a proyectos |

---

## 🎯 Paso 8: Probar la Conexión desde tu Proyecto

### 8.1. Usando el CLI del proyecto (forma rápida)

El proyecto incluye una función manual para verificar la conexión con Supabase. Solo necesitas tener las variables de entorno configuradas y ejecutar:

```bash
bun run functions
# Selecciona: "Verificar Conexión Supabase"
```

Esto verificará la conexión y mostrará el conteo de registros en cada tabla.

### 8.2. Script manual de prueba

```typescript
import { supabase, testSupabaseConnection } from './src/config/supabase.config';

async function main() {
  const connected = await testSupabaseConnection();
  if (!connected) { process.exit(1); }

  const { data, error } = await supabase.from('diputados').select('*').limit(5);
  if (error) console.error('Error:', error.message);
  else console.log(`Diputados en DB: ${data?.length || 0}`);
}

main();
```

```bash
bun tsx test-supabase-connection.ts
```

**Resultado esperado**:
```
🔌 Probando conexión con Supabase...

✅ Conexión exitosa con Supabase

📊 Consultando tabla diputados...
✅ Consulta exitosa - Total diputados: 0
Datos: []

📈 Consultando estadísticas...
✅ Vista materializada funciona - Registros: 0

🎉 Todas las pruebas completadas!
```

---

## 🎯 Paso 9: Insertar Datos de Prueba (Opcional)

Para verificar que todo funciona, puedes insertar un diputado de prueba:

### 9.1. Desde SQL Editor en Supabase

```sql
-- Insertar diputado de prueba
INSERT INTO diputados (id, nombre, apellido_paterno, apellido_materno) VALUES
('857', 'Nombre', 'Apellido', 'Materno');

-- Insertar sesión de prueba
INSERT INTO sesiones (id, fecha, tipo, numero_sesion, legislatura, estado) VALUES
('12345', '2024-01-15', 'Sala', 1, 371, 'Celebrada');

-- Insertar asistencia de prueba
INSERT INTO asistencias (diputado_id, sesion_id, tipo_asistencia, tipo_asistencia_code) VALUES
('857', '12345', 'Asiste', 1);

-- Refrescar estadísticas
REFRESH MATERIALIZED VIEW estadisticas_diputados;

-- Verificar estadísticas
SELECT * FROM estadisticas_diputados WHERE id = '857';
```

### 9.2. Desde tu Código TypeScript

Crea `test-insert.ts`:

```typescript
import { supabaseAdmin } from './src/config/supabase.config';

async function insertTestData() {
  console.log('📝 Insertando datos de prueba...\n');
  
  // Insertar diputado
  const { data: diputado, error: errorDip } = await supabaseAdmin
    .from('diputados')
    .insert({
      id: '857',
      nombre: 'Nombre',
      apellido_paterno: 'Apellido',
      apellido_materno: 'Materno'
    })
    .select();
  
  if (errorDip) {
    console.error('❌ Error insertando diputado:', errorDip.message);
    return;
  }
  
  console.log('✅ Diputado insertado:', diputado);
  
  // Insertar sesión
  const { data: sesion, error: errorSes } = await supabaseAdmin
    .from('sesiones')
    .insert({
      id: '12345',
      fecha: '2024-01-15',
      tipo: 'Sala',
      numero_sesion: 1,
      legislatura: 371,
      estado: 'Celebrada'
    })
    .select();
  
  if (errorSes) {
    console.error('❌ Error insertando sesión:', errorSes.message);
    return;
  }
  
  console.log('✅ Sesión insertada:', sesion);
  
  // Insertar asistencia
  const { data: asistencia, error: errorAsis } = await supabaseAdmin
    .from('asistencias')
    .insert({
      diputado_id: '857',
      sesion_id: '12345',
      tipo_asistencia: 'Asiste',
      tipo_asistencia_code: 1
    })
    .select();
  
  if (errorAsis) {
    console.error('❌ Error insertando asistencia:', errorAsis.message);
    return;
  }
  
  console.log('✅ Asistencia insertada:', asistencia);
  
  console.log('\n🎉 Datos de prueba insertados correctamente!');
}

insertTestData();
```

Ejecutar:
```bash
npx tsx test-insert.ts
```

---

## 🎯 Paso 10: Configurar Row Level Security (RLS)

### 10.1. ¿Qué es RLS?

Row Level Security (RLS) permite controlar quién puede acceder a qué filas en tus tablas.

**En este proyecto**:
- ✅ Lectura pública: Cualquiera puede leer datos (para el frontend)
- ❌ Escritura restringida: Solo el backend con `service_role_key` puede escribir

### 10.2. Verificar Políticas

Ejecuta en SQL Editor:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Deberías ver 4 políticas (una por tabla) que permiten SELECT público.

### 10.3. (Opcional) Deshabilitar RLS durante Desarrollo

Si quieres facilitar el desarrollo inicial, puedes deshabilitar temporalmente RLS:

```sql
ALTER TABLE diputados DISABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones DISABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias DISABLE ROW LEVEL SECURITY;
ALTER TABLE sincronizacion DISABLE ROW LEVEL SECURITY;
```

⚠️ **NO OLVIDES RE-HABILITARLO ANTES DE PRODUCCIÓN**

---

## 🎯 Paso 11: Integrar con tu Sistema de Funciones Manuales

### 11.1. Crear Función Manual para Probar Supabase

Crea: `src/functions/manual/call-routes-diputados/test-supabase.ts`

```typescript
import { ManualFunction } from '../types';
import { supabase, testSupabaseConnection } from '@config/supabase.config';
import { ChalkConsoleLogger } from '@services/logging';

const logger = new ChalkConsoleLogger();

export const testSupabase: ManualFunction = {
  id: 'test-supabase',
  name: 'Test Conexión Supabase',
  description: 'Prueba la conexión con Supabase y muestra estadísticas de la base de datos',
  category: 'diputados',
  inputs: [],
  execute: async () => {
    logger.header('TEST DE CONEXIÓN SUPABASE');
    
    // Test de conexión
    const connected = await testSupabaseConnection();
    
    if (!connected) {
      logger.error('No se pudo conectar a Supabase');
      return;
    }
    
    logger.success('Conexión exitosa con Supabase');
    logger.separator();
    
    // Contar registros por tabla
    const tables = ['diputados', 'sesiones', 'asistencias', 'sincronizacion'];
    
    logger.subheader('ESTADÍSTICAS DE TABLAS');
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        logger.error(`Error en tabla ${table}: ${error.message}`);
      } else {
        logger.data(table, `${count} registros`);
      }
    }
    
    logger.separator();
    logger.success('Test completado');
  },
};
```

### 11.2. Registrar la Función

Agrega en `src/functions/manual/function-registry.ts`:

```typescript
import { testSupabase } from './call-routes-diputados/test-supabase';

export const AVAILABLE_FUNCTIONS: ManualFunction[] = [
  // ... tus funciones existentes
  testSupabase,
];
```

### 11.3. Ejecutar

```bash
bun run functions
# Selecciona: "Test Conexión Supabase"
```

---

## 🎯 Próximos Pasos

Una vez que hayas completado estos pasos:

1. ✅ **Migrar funcionalidad existente**: Adaptar las funciones manuales actuales para guardar en Supabase en lugar de caché local

2. ✅ **Implementar sincronización inicial**: Crear script para la carga histórica 1990-2025

3. ✅ **Implementar sincronización semanal**: Crear cron job o función manual

4. ✅ **API REST endpoints**: Crear endpoints Express que consulten Supabase

5. ✅ **Testing**: Escribir tests unitarios e integración

---

## 📚 Recursos Útiles

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Supabase JS Client Reference](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🆘 Solución de Problemas

### Error: "relation 'public.diputados' does not exist"

**Solución**: No ejecutaste el script de migración. Ve al Paso 7.

### Error: "Missing Supabase environment variables"

**Solución**: No configuraste las variables en `.env`. Ve al Paso 6.

### Error: "Invalid API key"

**Solución**: Verifica que copiaste las claves correctamente (incluyendo todo el JWT).

### No puedo insertar datos

**Posibles causas**:
1. Estás usando `supabase` en lugar de `supabaseAdmin`
2. RLS está habilitado pero no tienes permisos (usa `supabaseAdmin` para escritura)

---

**¿Listo para continuar?** Una vez completados estos pasos, tendrás Supabase completamente configurado y listo para comenzar a migrar la funcionalidad existente.

**Siguiente documento**: `docs/MIGRATION_IMPLEMENTATION.md` (próximamente)
