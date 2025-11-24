# 🚀 Plan de Migración Paso a Paso: Firestore → Supabase (Versión Optimizada)

## 📋 Resumen Ejecutivo

Este documento detalla el plan completo para migrar el proyecto **Los Honorables** desde Firestore/Firebase a Supabase PostgreSQL con el esquema optimizado. Incluye la transformación de funciones manuales, adaptación de rutas, y estrategias de migración de datos.

---

## 🎯 Fase 1: Preparación y Configuración (Semana 1)

### 1.1 Configuración del Entorno Supabase
```bash
# Verificar conexión actual
pnpm run functions → Seleccionar "test-supabase"

# Crear proyecto Supabase (si no existe)
# Ir a: https://app.supabase.com → New Project
# Nombre: los-honorables-prod
# Contraseña: [generar contraseña segura]
# Región: us-east-1 (o la más cercana)
```

### 1.2 Variables de Entorno
```bash
# Actualizar .env con credenciales reales
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```

### 1.3 Ejecutar Esquema Optimizado
```sql
-- Conectar a Supabase SQL Editor
-- Ejecutar migrations/002_optimized_schema.sql completo
-- Verificar tablas creadas
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

---

## 🔄 Fase 2: Migración de Funciones Manuales (Semana 2)

### 2.1 Transformación de Funciones Clave

#### **consultar-ministerios.ts** → **sync-ministerios-supabase.ts**
```typescript
// NUEVA VERSIÓN OPTIMIZADA
import { supabaseAdmin } from '@config/supabase.config';
import { ChalkConsoleLogger } from '@services/logging';

export const syncMinisteriosSupabase: ManualFunction = {
    id: 'sync-ministerios-supabase',
    name: 'Sincronizar Ministerios a Supabase',
    description: 'Sincroniza ministerios desde API externa a Supabase con validación',
    category: 'sync',
    inputs: [
        {
            name: 'validate_only',
            type: 'boolean',
            description: 'Solo validar sin insertar datos',
            required: false
        }
    ],
    execute: async (inputs) => {
        const logger = new ChalkConsoleLogger();
        logger.header('SINCRONIZACIÓN DE MINISTERIOS');
        
        try {
            // 1. Obtener de API externa
            const response = await fetch(`${baseUrl}/ministerios`);
            const data = await response.json();
            
            // 2. Validar y transformar datos
            const ministerios = data.MinisteriosColeccion.Ministerio.map((m: any) => ({
                id: m.Id,
                nombre: m.Nombre.trim(),
                codigo: m.Alias?.trim() || m.Nombre.substring(0, 10).toUpperCase(),
                is_active: true,
                created_at: new Date().toISOString()
            }));
            
            // 3. Validar duplicados
            const { data: existing } = await supabaseAdmin
                .from('ministerios')
                .select('id, nombre');
            
            const existingIds = new Set(existing?.map(m => m.id) || []);
            const newMinisterios = ministerios.filter(m => !existingIds.has(m.id));
            
            logger.info(`Encontrados ${ministerios.length} ministerios, ${newMinisterios.length} nuevos`);
            
            // 4. Insertar en Supabase (si no es validación)
            if (!inputs.validate_only && newMinisterios.length > 0) {
                const { error } = await supabaseAdmin
                    .from('ministerios')
                    .upsert(newMinisterios, { onConflict: 'id' });
                
                if (error) {
                    logger.error('Error insertando ministerios:', error.message);
                    return;
                }
                
                logger.success(`Insertados ${newMinisterios.length} ministerios`);
            }
            
            // 5. Registrar en log de sincronización
            await supabaseAdmin.from('sincronizacion').insert({
                tipo: 'actualizacion_incremental',
                registros_procesados: newMinisterios.length,
                estado: 'completado',
                metadata: {
                    tipo_dato: 'ministerios',
                    total_encontrados: ministerios.length,
                    total_nuevos: newMinisterios.length,
                    validate_only: inputs.validate_only
                }
            });
            
        } catch (error) {
            logger.error('Error en sincronización:', error);
            throw error;
        }
    }
};
```

#### **consultar-asistencia-diputado-sala.ts** → **sync-asistencia-supabase.ts**
```typescript
// NUEVA VERSIÓN CON MANEJO DE ERRORES Y BATCH PROCESSING
export const syncAsistenciaSupabase: ManualFunction = {
    id: 'sync-asistencia-supabase',
    name: 'Sincronizar Asistencia Histórica a Supabase',
    description: 'Sincroniza asistencia de diputados con manejo de errores y batch processing',
    category: 'sync',
    inputs: [
        { name: 'diputado_id', type: 'string', description: 'ID del diputado (ej: 857)', required: true },
        { name: 'start_year', type: 'number', description: 'Año inicial (1990-2025)', required: true },
        { name: 'end_year', type: 'number', description: 'Año final (1990-2025)', required: true },
        { name: 'batch_size', type: 'number', description: 'Tamaño del batch', default: 50 },
        { name: 'throttle_ms', type: 'number', description: 'Throttle entre llamadas', default: 500 }
    ],
    execute: async (inputs) => {
        const logger = new ChalkConsoleLogger();
        logger.header('SINCRONIZACIÓN DE ASISTENCIA');
        
        const { diputado_id, start_year, end_year, batch_size, throttle_ms } = inputs;
        
        try {
            // 1. Validar diputado existe
            const { data: diputado, error: diputadoError } = await supabaseAdmin
                .from('diputados')
                .select('id, nombre_completo')
                .eq('id', diputado_id)
                .single();
            
            if (diputadoError || !diputado) {
                logger.error('Diputado no encontrado:', diputado_id);
                return;
            }
            
            logger.info(`Sincronizando asistencia para: ${diputado.nombre_completo}`);
            
            // 2. Obtener períodos legislativos relevantes
            const { data: periodos } = await supabaseAdmin
                .from('periodos_legislativos')
                .select('id, numero, fecha_inicio, fecha_termino')
                .gte('fecha_inicio', `${start_year}-01-01`)
                .lte('fecha_inicio', `${end_year}-12-31`)
                .order('numero', { ascending: true });
            
            let totalProcesadas = 0;
            let totalErrores = 0;
            
            // 3. Procesar por período
            for (const periodo of periodos || []) {
                logger.subheader(`Período ${periodo.numero} (${periodo.fecha_inicio} - ${periodo.fecha_termino})`);
                
                // Obtener sesiones del período
                const { data: sesiones } = await supabaseAdmin
                    .from('sesiones')
                    .select('id, fecha, tipo, numero_sesion')
                    .eq('periodo_id', periodo.id)
                    .eq('estado', 'Celebrada')
                    .order('fecha', { ascending: true });
                
                if (!sesiones || sesiones.length === 0) {
                    logger.warning(`No hay sesiones celebradas en período ${periodo.numero}`);
                    continue;
                }
                
                logger.info(`Procesando ${sesiones.length} sesiones`);
                
                // Procesar en batches
                for (let i = 0; i < sesiones.length; i += batch_size) {
                    const batch = sesiones.slice(i, i + batch_size);
                    
                    logger.progress(i + batch.length, sesiones.length, `Batch ${Math.floor(i/batch_size) + 1}`);
                    
                    // Procesar cada sesión del batch
                    for (const sesion of batch) {
                        try {
                            // Obtener asistencia de la sesión
                            const asistenciaData = await obtenerAsistenciaSesion(sesion.id, diputado_id);
                            
                            if (asistenciaData) {
                                // Transformar y guardar
                                const asistenciaRecord = {
                                    diputado_id: diputado_id,
                                    sesion_id: sesion.id,
                                    periodo_id: periodo.id,
                                    tipo_asistencia_id: mapearTipoAsistencia(asistenciaData.tipo),
                                    hora_entrada: asistenciaData.hora_entrada,
                                    hora_salida: asistenciaData.hora_salida,
                                    justificacion_id: asistenciaData.justificacion_id,
                                    justificacion_detalle: asistenciaData.justificacion_detalle,
                                    created_at: new Date().toISOString()
                                };
                                
                                // Upsert con manejo de conflictos
                                const { error: upsertError } = await supabaseAdmin
                                    .from('asistencias')
                                    .upsert(asistenciaRecord, {
                                        onConflict: 'diputado_id, sesion_id, periodo_id',
                                        ignoreDuplicates: false
                                    });
                                
                                if (upsertError) {
                                    logger.warning(`Error guardando asistencia: ${upsertError.message}`);
                                    totalErrores++;
                                } else {
                                    totalProcesadas++;
                                }
                            }
                            
                            // Throttle entre llamadas
                            await sleep(throttle_ms);
                            
                        } catch (error) {
                            logger.error(`Error procesando sesión ${sesion.id}:`, error);
                            totalErrores++;
                        }
                    }
                    
                    // Pequeña pausa entre batches
                    await sleep(1000);
                }
            }
            
            // 4. Refrescar vistas materializadas
            logger.info('Refrescando estadísticas...');
            await supabaseAdmin.rpc('refresh_all_materialized_views');
            
            // 5. Registrar resultado en log de sincronización
            await supabaseAdmin.from('sincronizacion').insert({
                tipo: 'actualizacion_incremental',
                diputado_id: diputado_id,
                fecha_inicio: `${start_year}-01-01`,
                fecha_termino: `${end_year}-12-31`,
                registros_procesados: totalProcesadas,
                estado: totalErrores > 0 ? 'completado_con_errores' : 'completado',
                error_message: totalErrores > 0 ? `${totalErrores} errores durante procesamiento` : null,
                metadata: {
                    tipo_dato: 'asistencia_diputado',
                    total_errores: totalErrores,
                    batch_size: batch_size,
                    throttle_ms: throttle_ms,
                    periodos_procesados: periodos?.length || 0
                }
            });
            
            logger.success(`Sincronización completada: ${totalProcesadas} registros procesados, ${totalErrores} errores`);
            
        } catch (error) {
            logger.error('Error crítico en sincronización:', error);
            
            // Registrar error en log
            await supabaseAdmin.from('sincronizacion').insert({
                tipo: 'actualizacion_incremental',
                diputado_id: diputado_id,
                estado: 'error',
                error_message: error.message,
                error_stack: error.stack,
                metadata: {
                    tipo_dato: 'asistencia_diputado',
                    start_year: start_year,
                    end_year: end_year
                }
            });
            
            throw error;
        }
    }
};
```

---

## 🏗️ Fase 3: Adaptación de Rutas y DTOs (Semana 3)

### 3.1 Nuevas Rutas de API para Supabase

#### **Nuevo archivo: src/routes/SupabaseRoutes/diputados-supabase.router.ts**
```typescript
import { Router, Request, Response } from "express";
import { supabase } from "@config/supabase.config";
import { cacheMiddleware } from "@middleware/cache.middleware";

const router = Router();

// GET /api/supabase/diputados - Listar diputados con filtros
router.get("/diputados", cacheMiddleware(300), async (req: Request, res: Response) => {
    try {
        const { 
            region_id, 
            distrito_id, 
            partido_id, 
            periodo_id, 
            is_active = true,
            limit = 50,
            offset = 0,
            search 
        } = req.query;
        
        let query = supabase
            .from('diputados')
            .select(`
                *,
                regiones(nombre),
                distritos_electorales(numero, nombre),
                diputado_periodos(
                    periodo_id,
                    partido_id,
                    periodos_legislativos(numero, fecha_inicio, fecha_termino),
                    partidos_politicos(nombre, alias, color_hex)
                )
            `)
            .eq('is_active', is_active)
            .order('apellido_paterno', { ascending: true })
            .range(Number(offset), Number(offset) + Number(limit) - 1);
        
        // Aplicar filtros
        if (region_id) query = query.eq('region_id', region_id);
        if (distrito_id) query = query.eq('distrito_id', distrito_id);
        if (partido_id) query = query.eq('diputado_periodos.partido_id', partido_id);
        if (periodo_id) query = query.eq('diputado_periodos.periodo_id', periodo_id);
        
        // Búsqueda por texto
        if (search) {
            query = query.or(`nombre_completo.ilike.%${search}%,rut.ilike.%${search}%`);
        }
        
        const { data, error, count } = await query;
        
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        
        res.json({
            data,
            pagination: {
                limit: Number(limit),
                offset: Number(offset),
                total: count
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/supabase/diputados/:id/estadisticas - Estadísticas detalladas
router.get("/diputados/:id/estadisticas", cacheMiddleware(300), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { periodo_id } = req.query;
        
        // Obtener estadísticas usando función PL/pgSQL
        const { data, error } = await supabase
            .rpc('get_diputado_full_stats', { 
                diputado_id_param: id,
                periodo_id_param: periodo_id 
            });
        
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Diputado no encontrado' });
        }
        
        res.json({ data: data[0] });
        
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/supabase/diputados/:id/asistencia - Asistencia detallada
router.get("/diputados/:id/asistencia", cacheMiddleware(300), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { 
            periodo_id, 
            start_date, 
            end_date, 
            tipo_sesion,
            limit = 100,
            offset = 0 
        } = req.query;
        
        let query = supabase
            .from('asistencias')
            .select(`
                *,
                sesiones(
                    id,
                    fecha,
                    tipo,
                    numero_sesion,
                    titulo,
                    estado,
                    periodos_legislativos(numero, fecha_inicio, fecha_termino)
                ),
                tipos_asistencia(codigo, nombre, color_hex, es_presencial)
            `)
            .eq('diputado_id', id)
            .order('created_at', { ascending: false })
            .range(Number(offset), Number(offset) + Number(limit) - 1);
        
        // Filtros
        if (periodo_id) query = query.eq('periodo_id', periodo_id);
        if (start_date) query = query.gte('sesiones.fecha', start_date);
        if (end_date) query = query.lte('sesiones.fecha', end_date);
        if (tipo_sesion) query = query.eq('sesiones.tipo', tipo_sesion);
        
        const { data, error, count } = await query;
        
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        
        // Calcular estadísticas del período
        const asistenciaStats = calcularEstadisticasAsistencia(data || []);
        
        res.json({
            data,
            stats: asistenciaStats,
            pagination: {
                limit: Number(limit),
                offset: Number(offset),
                total: count
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
```

#### **Nuevo archivo: src/routes/SupabaseRoutes/estadisticas-supabase.router.ts**
```typescript
import { Router, Request, Response } from "express";
import { supabase } from "@config/supabase.config";
import { cacheMiddleware } from "@middleware/cache.middleware";

const router = Router();

// GET /api/supabase/estadisticas/ranking-asistencia - Ranking global
router.get("/estadisticas/ranking-asistencia", cacheMiddleware(300), async (req: Request, res: Response) => {
    try {
        const { 
            periodo_id, 
            partido_id, 
            region_id,
            limit = 50,
            offset = 0 
        } = req.query;
        
        let query = supabase
            .from('mv_diputado_periodo_estadisticas')
            .select('*')
            .order('porcentaje_asistencia_periodo', { ascending: false })
            .range(Number(offset), Number(offset) + Number(limit) - 1);
        
        if (periodo_id) query = query.eq('periodo_id', periodo_id);
        if (partido_id) query = query.eq('partido_id', partido_id);
        if (region_id) query = query.eq('region_id', region_id);
        
        const { data, error, count } = await query;
        
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        
        res.json({
            data,
            pagination: {
                limit: Number(limit),
                offset: Number(offset),
                total: count
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/supabase/estadisticas/partidos - Estadísticas por partido
router.get("/estadisticas/partidos", cacheMiddleware(300), async (req: Request, res: Response) => {
    try {
        const { periodo_id, limit = 20 } = req.query;
        
        let query = supabase
            .from('mv_partido_estadisticas')
            .select('*')
            .order('promedio_asistencia_partido', { ascending: false })
            .limit(Number(limit));
        
        if (periodo_id) query = query.eq('periodo_id', periodo_id);
        
        const { data, error } = await query;
        
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        
        res.json({ data });
        
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/supabase/estadisticas/tendencias - Tendencias temporales
router.get("/estadisticas/tendencias", cacheMiddleware(300), async (req: Request, res: Response) => {
    try {
        const { 
            diputado_id, 
            partido_id, 
            periodo_id,
            granularity = 'month' // 'day', 'week', 'month', 'year'
        } = req.query;
        
        // Construir query dinámica según granularidad
        let timeFormat: string;
        switch (granularity) {
            case 'day':
                timeFormat = 'YYYY-MM-DD';
                break;
            case 'week':
                timeFormat = 'IYYY-IW';
                break;
            case 'month':
                timeFormat = 'YYYY-MM';
                break;
            case 'year':
                timeFormat = 'YYYY';
                break;
            default:
                timeFormat = 'YYYY-MM';
        }
        
        const { data, error } = await supabase
            .rpc('get_tendencias_asistencia', {
                diputado_id_param: diputado_id,
                partido_id_param: partido_id,
                periodo_id_param: periodo_id,
                time_format_param: timeFormat
            });
        
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        
        res.json({ 
            data,
            metadata: {
                granularity,
                time_format: timeFormat
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
```

---

## 📊 Fase 4: Migración de Datos (Semana 4)

### 4.1 Estrategia de Migración por Etapas

#### **Etapa 1: Datos Maestros (Regiones, Partidos, Períodos)**
```typescript
// src/scripts/migrate-master-data.ts
import { supabaseAdmin } from '@config/supabase.config';

async function migrateMasterData() {
    console.log('🔄 Migrando datos maestros...');
    
    try {
        // 1. Regiones, Provincias, Comunas
        await migrateGeographicData();
        
        // 2. Partidos Políticos
        await migratePoliticalParties();
        
        // 3. Períodos Legislativos
        await migrateLegislativePeriods();
        
        // 4. Distritos Electorales
        await migrateElectoralDistricts();
        
        console.log('✅ Datos maestros migrados exitosamente');
        
    } catch (error) {
        console.error('❌ Error migrando datos maestros:', error);
        throw error;
    }
}

async function migrateGeographicData() {
    // Obtener de API externa y migrar
    const response = await fetch(`${API_BASE}/regiones`);
    const regiones = await response.json();
    
    for (const region of regiones) {
        await supabaseAdmin.from('regiones').upsert({
            id: region.id,
            codigo: region.codigo,
            nombre: region.nombre,
            ordinal: region.ordinal
        });
    }
}

migrateMasterData();
```

#### **Etapa 2: Diputados y Relaciones**
```typescript
// src/scripts/migrate-diputados.ts
async function migrateDiputados() {
    console.log('🔄 Migrando diputados...');
    
    // Obtener lista de diputados vigentes
    const response = await fetch(`${API_BASE}/diputados/vigentes`);
    const diputados = await response.json();
    
    for (const diputado of diputados) {
        // 1. Insertar datos básicos
        await supabaseAdmin.from('diputados').upsert({
            id: diputado.Id,
            rut: diputado.RUT,
            rut_dv: diputado.RUTDV,
            nombre: diputado.Nombre,
            apellido_paterno: diputado.ApellidoPaterno,
            apellido_materno: diputado.ApellidoMaterno,
            fecha_nacimiento: diputado.FechaNacimiento,
            sexo: diputado.Sexo.Valor === 'Masculino' ? 'M' : 'F',
            email_institucional: diputado.Email,
            region_id: diputado.Region?.Id,
            distrito_id: diputado.Distrito?.Id,
            is_active: true
        });
        
        // 2. Insertar militancias
        if (diputado.Militancias?.Militancia) {
            for (const militancia of toArray(diputado.Militancias.Militancia)) {
                await supabaseAdmin.from('diputado_militancias').upsert({
                    diputado_id: diputado.Id,
                    partido_id: militancia.Partido.Id,
                    fecha_inicio: militancia.FechaInicio,
                    fecha_termino: militancia.FechaTermino
                });
            }
        }
        
        // 3. Insertar períodos
        for (const periodo of diputado.Periodos || []) {
            await supabaseAdmin.from('diputado_periodos').upsert({
                diputado_id: diputado.Id,
                periodo_id: periodo.Id,
                distrito_id: periodo.Distrito?.Id,
                partido_id: periodo.Partido?.Id,
                fecha_inicio: periodo.FechaInicio,
                fecha_termino: periodo.FechaTermino,
                is_active: !periodo.FechaTermino || new Date(periodo.FechaTermino) > new Date()
            });
        }
    }
}
```

#### **Etapa 3: Asistencia Histórica (Proceso Batch)**
```typescript
// src/scripts/migrate-asistencia-batch.ts
async function migrateAsistenciaBatch() {
    console.log('🔄 Migrando asistencia histórica...');
    
    const BATCH_SIZE = 100;
    const THROTTLE_MS = 500;
    
    // Obtener todas las sesiones celebradas
    const { data: sesiones } = await supabaseAdmin
        .from('sesiones')
        .select('id, fecha, periodo_id, tipo')
        .eq('estado', 'Celebrada')
        .order('fecha', { ascending: true });
    
    console.log(`Procesando ${sesiones.length} sesiones`);
    
    for (let i = 0; i < sesiones.length; i += BATCH_SIZE) {
        const batch = sesiones.slice(i, i + BATCH_SIZE);
        
        console.log(`Procesando batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(sesiones.length/BATCH_SIZE)}`);
        
        // Procesar cada sesión del batch
        for (const sesion of batch) {
            try {
                // Obtener asistencia de la sesión
                const asistenciaData = await obtenerAsistenciaCompleta(sesion.id);
                
                if (asistenciaData && asistenciaData.length > 0) {
                    // Transformar y preparar para bulk insert
                    const asistencias = asistenciaData.map(asist => ({
                        diputado_id: asist.Diputado.Id,
                        sesion_id: sesion.id,
                        periodo_id: sesion.periodo_id,
                        tipo_asistencia_id: mapearTipoAsistencia(asist.TipoAsistencia),
                        hora_entrada: asist.HoraEntrada,
                        hora_salida: asist.HoraSalida,
                        justificacion_id: asist.Justificacion?.Id,
                        justificacion_detalle: asist.Justificacion?.Nombre,
                        created_at: new Date().toISOString()
                    }));
                    
                    // Bulk insert con manejo de conflictos
                    const { error } = await supabaseAdmin
                        .from('asistencias')
                        .upsert(asistencias, {
                            onConflict: 'diputado_id, sesion_id, periodo_id',
                            ignoreDuplicates: true
                        });
                    
                    if (error) {
                        console.error(`Error en sesión ${sesion.id}:`, error.message);
                    }
                }
                
                // Throttle para no saturar la API
                await sleep(THROTTLE_MS);
                
            } catch (error) {
                console.error(`Error procesando sesión ${sesion.id}:`, error);
            }
        }
        
        // Pausa entre batches
        await sleep(2000);
        
        // Actualizar progreso
        await actualizarProgresoMigracion('asistencia', i + batch.length, sesiones.length);
    }
    
    console.log('✅ Migración de asistencia completada');
}
```

---

## 🧪 Fase 5: Testing y Validación (Semana 5)

### 5.1 Tests de Integración
```typescript
// tests/integration/supabase-migration.test.ts
describe('Migración Supabase - Tests de Integración', () => {
    
    beforeAll(async () => {
        // Conectar a Supabase test
        await setupTestDatabase();
    });
    
    afterAll(async () => {
        await cleanupTestDatabase();
    });
    
    describe('Datos Maestros', () => {
        test('debe tener regiones cargadas', async () => {
            const { data, error } = await supabase
                .from('regiones')
                .select('count()');
            
            expect(error).toBeNull();
            expect(data[0].count).toBeGreaterThan(0);
        });
        
        test('debe tener partidos políticos', async () => {
            const { data, error } = await supabase
                .from('partidos_politicos')
                .select('count()');
            
            expect(error).toBeNull();
            expect(data[0].count).toBeGreaterThan(0);
        });
    });
    
    describe('Diputados', () => {
        test('debe poder obtener diputado por ID', async () => {
            const diputadoId = '857';
            
            const { data, error } = await supabase
                .from('diputados')
                .select('*, regiones(nombre), diputado_periodos(*)')
                .eq('id', diputadoId)
                .single();
            
            expect(error).toBeNull();
            expect(data).toBeDefined();
            expect(data.id).toBe(diputadoId);
        });
        
        test('debe poder buscar diputados por nombre', async () => {
            const searchTerm = 'Juan';
            
            const { data, error } = await supabase
                .from('diputados')
                .select('id, nombre_completo')
                .ilike('nombre_completo', `%${searchTerm}%`)
                .limit(10);
            
            expect(error).toBeNull();
            expect(data.length).toBeGreaterThan(0);
            expect(data[0].nombre_completo).toContain(searchTerm);
        });
    });
    
    describe('Asistencia', () => {
        test('debe poder obtener asistencia de diputado', async () => {
            const diputadoId = '857';
            
            const { data, error } = await supabase
                .from('asistencias')
                .select(`
                    *,
                    sesiones(fecha, tipo, numero_sesion),
                    tipos_asistencia(codigo, nombre, color_hex)
                `)
                .eq('diputado_id', diputadoId)
                .order('created_at', { ascending: false })
                .limit(10);
            
            expect(error).toBeNull();
            expect(data.length).toBeGreaterThan(0);
            expect(data[0].diputado_id).toBe(diputadoId);
        });
        
        test('debe calcular estadísticas correctamente', async () => {
            const diputadoId = '857';
            
            const { data, error } = await supabase
                .rpc('get_diputado_full_stats', { 
                    diputado_id_param: diputadoId 
                });
            
            expect(error).toBeNull();
            expect(data).toBeDefined();
            expect(data[0].total_sesiones).toBeGreaterThan(0);
            expect(data[0].porcentaje_asistencia).toBeGreaterThanOrEqual(0);
            expect(data[0].porcentaje_asistencia).toBeLessThanOrEqual(100);
        });
    });
    
    describe('Rendimiento', () => {
        test('debe responder en menos de 1 segundo', async () => {
            const startTime = Date.now();
            
            const { data, error } = await supabase
                .from('mv_diputado_estadisticas')
                .select('*')
                .order('porcentaje_asistencia', { ascending: false })
                .limit(50);
            
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            expect(error).toBeNull();
            expect(responseTime).toBeLessThan(1000); // 1 segundo
            expect(data.length).toBe(50);
        });
        
        test('debe manejar búsquedas complejas eficientemente', async () => {
            const startTime = Date.now();
            
            const { data, error } = await supabase
                .from('diputados')
                .select(`
                    *,
                    regiones(nombre),
                    diputado_periodos(
                        periodo_id,
                        partido_id,
                        partidos_politicos(nombre, color_hex)
                    )
                `)
                .eq('region_id', 1)
                .eq('diputado_periodos.periodo_id', 374)
                .order('apellido_paterno')
                .limit(20);
            
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            expect(error).toBeNull();
            expect(responseTime).toBeLessThan(500); // 500ms
            expect(data.length).toBeGreaterThan(0);
        });
    });
});
```

### 5.2 Validación de Integridad de Datos
```typescript
// scripts/validate-data-integrity.ts
async function validateDataIntegrity() {
    console.log('🔍 Validando integridad de datos...');
    
    const { data: integrityIssues, error } = await supabaseAdmin
        .rpc('verificar_integridad_datos');
    
    if (error) {
        console.error('Error verificando integridad:', error);
        return;
    }
    
    let hasCriticalIssues = false;
    
    for (const issue of integrityIssues) {
        console.log(`⚠️  ${issue.tipo_error}: ${issue.cantidad} registros`);
        console.log(`   Detalle: ${issue.detalle}`);
        
        if (issue.cantidad > 100) {
            hasCriticalIssues = true;
        }
    }
    
    if (hasCriticalIssues) {
        console.error('❌ Se encontraron problemas críticos de integridad');
        process.exit(1);
    } else {
        console.log('✅ Validación de integridad completada sin problemas críticos');
    }
}

validateDataIntegrity();
```

---

## 🚀 Fase 6: Go-Live y Monitoreo (Semana 6)

### 6.1 Estrategia de Go-Live

#### **Opción A: Switch Completo (Recomendado)**
```typescript
// src/config/feature-flags.ts
export const FEATURE_FLAGS = {
    USE_SUPABASE: process.env.USE_SUPABASE === 'true',
    ENABLE_CACHE: process.env.ENABLE_CACHE === 'true',
    LOG_QUERIES: process.env.LOG_QUERIES === 'true'
};

// src/routes/index.ts
if (FEATURE_FLAGS.USE_SUPABASE) {
    app.use('/api/supabase', supabaseRoutes);
    console.log('✅ Usando rutas de Supabase');
} else {
    app.use('/api/diputados', diputadosRoutes);
    console.log('🔥 Usando rutas legacy');
}
```

#### **Opción B: Migración Gradual por Endpoints**
```typescript
// Migrar endpoints uno por uno
const ROUTE_MIGRATION = {
    '/api/diputados/vigentes': '/api/supabase/diputados',
    '/api/diputados/detalle': '/api/supabase/diputados/:id',
    '/api/sala/sesionAsistencia': '/api/supabase/asistencia',
    // ... migrar progresivamente
};
```

### 6.2 Monitoreo Post-Migración

#### **Dashboard de Monitoreo**
```typescript
// src/monitoring/migration-monitor.ts
export class MigrationMonitor {
    private logger: PinoLoggerService;
    
    constructor() {
        this.logger = new PinoLoggerService({ level: 'info' });
    }
    
    async monitorMigrationHealth() {
        // 1. Verificar conectividad
        const connectionStatus = await this.checkSupabaseConnection();
        
        // 2. Verificar rendimiento de queries
        const queryPerformance = await this.checkQueryPerformance();
        
        // 3. Verificar errores recientes
        const recentErrors = await this.checkRecentErrors();
        
        // 4. Verificar integridad de datos
        const dataIntegrity = await this.checkDataIntegrity();
        
        // 5. Generar reporte
        const healthReport = {
            timestamp: new Date().toISOString(),
            connection: connectionStatus,
            performance: queryPerformance,
            errors: recentErrors,
            integrity: dataIntegrity,
            overall_health: this.calculateOverallHealth()
        };
        
        // Enviar alertas si hay problemas
        if (healthReport.overall_health < 0.8) {
            await this.sendAlert(healthReport);
        }
        
        return healthReport;
    }
    
    private async checkSupabaseConnection(): Promise<boolean> {
        try {
            const { error } = await supabaseAdmin
                .from('diputados')
                .select('count()')
                .limit(1);
            
            return !error;
        } catch (error) {
            this.logger.error('Error checking connection:', error);
            return false;
        }
    }
    
    private async checkQueryPerformance(): Promise<any> {
        // Implementar monitoreo de tiempos de respuesta
        const slowQueries = await supabaseAdmin
            .from('sincronizacion')
            .select('metadata')
            .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .contains('metadata', { slow_query: true });
        
        return {
            slow_queries_count: slowQueries.data?.length || 0,
            average_response_time: this.calculateAverageResponseTime()
        };
    }
}
```

### 6.3 Plan de Rollback

#### **Rollback Inmediato**
```bash
# Si hay problemas críticos, volver a Firestore
export USE_SUPABASE=false
npm restart

# Verificar que todo funciona con Firestore
curl -X GET http://localhost:3000/api/diputados/vigentes
```

#### **Rollback Parcial**
```typescript
// Desactivar solo las rutas problemáticas
const PROBLEMATIC_ROUTES = ['/api/supabase/estadisticas'];

app.use('/api/supabase', (req, res, next) => {
    if (PROBLEMATIC_ROUTES.includes(req.path)) {
        // Redirigir a versión legacy
        return res.redirect(307, req.path.replace('/supabase', '/diputados'));
    }
    next();
});
```

---

## 📋 Checklist Final de Migración

### ✅ Pre-Migración
- [ ] Backup completo de Firestore
- [ ] Variables de entorno configuradas
- [ ] Esquema optimizado ejecutado en Supabase
- [ ] Tests de integración pasando
- [ ] Validación de integridad de datos completada
- [ ] Plan de rollback documentado

### ✅ Durante Migración
- [ ] Monitoreo activo de errores
- [ ] Verificación de tiempos de respuesta
- [ ] Validación de datos críticos
- [ ] Comunicación con stakeholders

### ✅ Post-Migración
- [ ] Todas las funciones manuales funcionando
- [ ] APIs respondiendo correctamente
- [ ] Estadísticas calculándose correctamente
- [ ] Sistema de caché operativo
- [ ] Monitoreo establecido
- [ ] Documentación actualizada

---

## 🎯 Métricas de Éxito

| Métrica | Objetivo | Actual | Estado |
|---------|----------|---------|---------|
| Tiempo de respuesta promedio | < 500ms | Firestore: ~800ms | 🔄 |
| Disponibilidad del sistema | > 99.5% | Firestore: ~99% | 🔄 |
| Costo mensual | $0 | Firestore: $10-20 | ✅ |
| Integridad de datos | 100% | Firestore: ~95% | 🔄 |
| Tiempo de recuperación | < 1 hora | Firestore: Variable | 🔄 |

---

## 🚀 Conclusión

Este plan de migración transforma el proyecto **Los Honorables** de un sistema costoso y limitado (Firestore) a una solución escalable y económica (Supabase PostgreSQL). La implementación del esquema optimizado permitirá:

1. **Análisis políticos avanzados** con datos normalizados
2. **Consultas complejas eficientes** mediante SQL nativo
3. **Costo operativo cero** con plan gratuito de Supabase
4. **Escalabilidad ilimitada** para crecimiento futuro
5. **Flexibilidad total** para nuevas funcionalidades

La migración está diseñada para ser **segura, reversible y monitoreada**, minimizando el riesgo de interrupción del servicio.

**Próximo paso**: Ejecutar la Fase 1 de preparación y configuración.