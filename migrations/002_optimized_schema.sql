-- ============================================================================
-- Migration 002: Optimized Schema for Political Analytics
-- ============================================================================
-- Proyecto: Los Honorables - Optimized Version
-- Descripción: Esquema mejorado para análisis políticos avanzados
-- Autor: Winnie Cofre (Optimización basada en análisis de rendimiento)
-- Fecha: 2025-01-20
-- ============================================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsquedas fuzzy

-- ============================================================================
-- TABLA: regiones
-- ============================================================================
-- Normalización de regiones de Chile para análisis geográficos
CREATE TABLE IF NOT EXISTS regiones (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    ordinal VARCHAR(40) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE regiones IS 'Regiones de Chile para análisis geográfico de diputados';
COMMENT ON COLUMN regiones.codigo IS 'Código oficial de la región (ej: RM, V, XIV)';
COMMENT ON COLUMN regiones.ordinal IS 'Número ordinal de la región (ej: Primera, Segunda)';

-- ============================================================================
-- TABLA: provincias
-- ============================================================================
CREATE TABLE IF NOT EXISTS provincias (
    id SERIAL PRIMARY KEY,
    region_id INTEGER NOT NULL REFERENCES regiones(id) ON DELETE CASCADE,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE provincias IS 'Provincias de Chile';

-- ============================================================================
-- TABLA: comunas
-- ============================================================================
CREATE TABLE IF NOT EXISTS comunas (
    id SERIAL PRIMARY KEY,
    provincia_id INTEGER NOT NULL REFERENCES provincias(id) ON DELETE CASCADE,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE comunas IS 'Comunas de Chile';

-- ============================================================================
-- TABLA: partidos_politicos
-- ============================================================================
-- Normalización crítica para análisis políticos por partido
CREATE TABLE IF NOT EXISTS partidos_politicos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    alias VARCHAR(100),
    color_hex VARCHAR(7), -- Color representativo del partido
    fecha_fundacion DATE,
    fecha_disolucion DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE partidos_politicos IS 'Partidos políticos de Chile';
COMMENT ON COLUMN partidos_politicos.color_hex IS 'Color oficial del partido en formato hex (#RRGGBB)';

-- ============================================================================
-- TABLA: periodos_legislativos
-- ============================================================================
-- Gestión de legislaturas para análisis temporales
CREATE TABLE IF NOT EXISTS periodos_legislativos (
    id SERIAL PRIMARY KEY,
    numero INTEGER UNIQUE NOT NULL, -- Número de legislatura (371, 372, etc.)
    fecha_inicio DATE NOT NULL,
    fecha_termino DATE,
    descripcion VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint para evitar superposición de períodos
    CONSTRAINT no_overlap_periodos EXCLUDE USING gist (
        daterange(fecha_inicio, fecha_termino) WITH &&
    )
);

COMMENT ON TABLE periodos_legislativos IS 'Períodos legislativos del Congreso Nacional';

-- ============================================================================
-- TABLA: distritos_electorales
-- ============================================================================
CREATE TABLE IF NOT EXISTS distritos_electorales (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL,
    region_id INTEGER NOT NULL REFERENCES regiones(id),
    circunscripcion INTEGER NOT NULL,
    nombre VARCHAR(200),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(numero, region_id)
);

COMMENT ON TABLE distritos_electorales IS 'Distritos electorales de Chile';

-- ============================================================================
-- TABLA: diputados - EXPANDIDA
-- ============================================================================
-- Información completa de diputados con datos demográficos
CREATE TABLE IF NOT EXISTS diputados (
    id VARCHAR(50) PRIMARY KEY,
    rut VARCHAR(12) UNIQUE NOT NULL,
    rut_dv VARCHAR(1) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    nombre_completo VARCHAR(300),
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    sexo VARCHAR(1) CHECK (sexo IN ('M', 'F')),
    email_institucional VARCHAR(200),
    telefono_oficina VARCHAR(50),
    foto_url TEXT,
    biografia TEXT,
    
    -- Datos geográficos
    region_id INTEGER REFERENCES regiones(id),
    provincia_id INTEGER REFERENCES provincias(id),
    comuna_id INTEGER REFERENCES comunas(id),
    distrito_id INTEGER REFERENCES distritos_electorales(id),
    
    -- Estado y control
    is_active BOOLEAN DEFAULT true,
    fecha_ingreso DATE,
    fecha_retiro DATE,
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

COMMENT ON TABLE diputados IS 'Información completa de diputados de Chile';
COMMENT ON COLUMN diputados.rut IS 'RUT sin dígito verificador (ej: 12345678)';
COMMENT ON COLUMN diputados.rut_dv IS 'Dígito verificador del RUT (ej: 9)';
COMMENT ON COLUMN diputados.foto_url IS 'URL de la fotografía oficial del diputado';

-- Índices para búsquedas
CREATE INDEX IF NOT EXISTS idx_diputados_rut ON diputados(rut);
CREATE INDEX IF NOT EXISTS idx_diputados_nombre_completo ON diputados(nombre_completo);
CREATE INDEX IF NOT EXISTS idx_diputados_apellidos ON diputados(apellido_paterno, apellido_materno);
CREATE INDEX IF NOT EXISTS idx_diputados_region ON diputados(region_id);
CREATE INDEX IF NOT EXISTS idx_diputados_distrito ON diputados(distrito_id);
CREATE INDEX IF NOT EXISTS idx_diputados_activos ON diputados(is_active) WHERE is_active = true;

-- Índice GIN para búsquedas de texto completo
CREATE INDEX IF NOT EXISTS idx_diputados_search ON diputados USING gin(to_tsvector('spanish', nombre_completo));

-- ============================================================================
-- TABLA: diputado_militancias
-- ============================================================================
-- Historial de militancias políticas de diputados
CREATE TABLE IF NOT EXISTS diputado_militancias (
    id SERIAL PRIMARY KEY,
    diputado_id VARCHAR(50) NOT NULL REFERENCES diputados(id) ON DELETE CASCADE,
    partido_id INTEGER NOT NULL REFERENCES partidos_politicos(id) ON DELETE CASCADE,
    fecha_inicio DATE NOT NULL,
    fecha_termino DATE,
    cargo_interno VARCHAR(200),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Evitar superposición de militancias del mismo diputado
    CONSTRAINT no_overlap_militancias EXCLUDE USING gist (
        diputado_id WITH =,
        daterange(fecha_inicio, fecha_termino) WITH &&
    ) WHERE (is_active = true)
);

COMMENT ON TABLE diputado_militancias IS 'Historial de militancias políticas de diputados';

-- Índices para análisis políticos
CREATE INDEX IF NOT EXISTS idx_diputado_militancias_diputado ON diputado_militancias(diputado_id);
CREATE INDEX IF NOT EXISTS idx_diputado_militancias_partido ON diputado_militancias(partido_id);
CREATE INDEX IF NOT EXISTS idx_diputado_militancias_periodo ON diputado_militancias(fecha_inicio, fecha_termino);

-- ============================================================================
-- TABLA: diputado_periodos
-- ============================================================================
-- Relación entre diputados y períodos legislativos
CREATE TABLE IF NOT EXISTS diputado_periodos (
    id SERIAL PRIMARY KEY,
    diputado_id VARCHAR(50) NOT NULL REFERENCES diputados(id) ON DELETE CASCADE,
    periodo_id INTEGER NOT NULL REFERENCES periodos_legislativos(id) ON DELETE CASCADE,
    distrito_id INTEGER NOT NULL REFERENCES distritos_electorales(id),
    partido_id INTEGER REFERENCES partidos_politicos(id),
    fecha_inicio DATE NOT NULL,
    fecha_termino DATE,
    votos_obtenidos INTEGER,
    porcentaje_votos DECIMAL(5,2),
    is_representative BOOLEAN DEFAULT false, -- Si es diputado titular o suplente
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(diputado_id, periodo_id, distrito_id)
);

COMMENT ON TABLE diputado_periodos IS 'Relación entre diputados y períodos legislativos';

CREATE INDEX IF NOT EXISTS idx_diputado_periodos_diputado ON diputado_periodos(diputado_id);
CREATE INDEX IF NOT EXISTS idx_diputado_periodos_periodo ON diputado_periodos(periodo_id);
CREATE INDEX IF NOT EXISTS idx_diputado_periodos_distrito ON diputado_periodos(distrito_id);
CREATE INDEX IF NOT EXISTS idx_diputado_periodos_partido ON diputado_periodos(partido_id);

-- ============================================================================
-- TABLA: sesiones - EXPANDIDA
-- ============================================================================
CREATE TABLE IF NOT EXISTS sesiones (
    id VARCHAR(50) PRIMARY KEY,
    periodo_id INTEGER NOT NULL REFERENCES periodos_legislativos(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_inicio TIME,
    hora_termino TIME,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Sala', 'Comision')),
    numero_sesion INTEGER,
    legislatura INTEGER,
    
    -- Información detallada
    titulo VARCHAR(500),
    descripcion TEXT,
    quorum_inicial INTEGER,
    quorum_final INTEGER,
    duracion_minutos INTEGER,
    
    -- Estado y control
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('Celebrada', 'Programada', 'Suspendida', 'Cancelada')),
    motivo_suspension TEXT,
    
    -- URLs y documentos
    acta_url TEXT,
    video_url TEXT,
    transmision_url TEXT,
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

COMMENT ON TABLE sesiones IS 'Sesiones legislativas expandidas con información detallada';
COMMENT ON COLUMN sesiones.quorum_inicial IS 'Número de diputados presentes al inicio';
COMMENT ON COLUMN sesiones.quorum_final IS 'Número de diputados presentes al término';

-- Índices optimizados
CREATE INDEX IF NOT EXISTS idx_sesiones_periodo_fecha ON sesiones(periodo_id, fecha DESC);
CREATE INDEX IF NOT EXISTS idx_sesiones_fecha_tipo ON sesiones(fecha, tipo);
CREATE INDEX IF NOT EXISTS idx_sesiones_estado_fecha ON sesiones(estado, fecha DESC);
CREATE INDEX IF NOT EXISTS idx_sesiones_legislatura ON sesiones(legislatura);
CREATE INDEX IF NOT EXISTS idx_sesiones_quorum ON sesiones(quorum_inicial, quorum_final);

-- Particionamiento por año (requiere PostgreSQL 12+)
-- CREATE TABLE sesiones_2024 PARTITION OF sesiones FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- ============================================================================
-- TABLA: asistencias - OPTIMIZADA
-- ============================================================================
CREATE TABLE IF NOT EXISTS asistencias (
    id BIGSERIAL PRIMARY KEY,
    diputado_id VARCHAR(50) NOT NULL REFERENCES diputados(id) ON DELETE CASCADE,
    sesion_id VARCHAR(50) NOT NULL REFERENCES sesiones(id) ON DELETE CASCADE,
    periodo_id INTEGER NOT NULL REFERENCES periodos_legislativos(id) ON DELETE CASCADE,
    
    -- Tipo de asistencia (normalizada)
    tipo_asistencia_id INTEGER NOT NULL,
    
    -- Timestamps detallados
    hora_entrada TIME,
    hora_salida TIME,
    duracion_minutos INTEGER,
    
    -- Justificación para inasistencias
    justificacion_id INTEGER,
    justificacion_detalle TEXT,
    archivo_justificacion_url TEXT,
    
    -- Validación y control
    validado_por VARCHAR(100),
    fecha_validacion TIMESTAMP WITH TIME ZONE,
    observaciones TEXT,
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Constraint único para evitar duplicados
    UNIQUE(diputado_id, sesion_id, periodo_id)
);

COMMENT ON TABLE asistencias IS 'Asistencias optimizadas con información detallada';
COMMENT ON COLUMN asistencias.validado_por IS 'Usuario que validó la asistencia';

-- Índices optimizados para queries frecuentes
CREATE INDEX IF NOT EXISTS idx_asistencias_composite ON asistencias(diputado_id, sesion_id, periodo_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_sesion ON asistencias(sesion_id, tipo_asistencia_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_periodo ON asistencias(periodo_id, diputado_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_fecha ON asistencias(created_at);
CREATE INDEX IF NOT EXISTS idx_asistencias_tipo ON asistencias(tipo_asistencia_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_justificacion ON asistencias(justificacion_id);

-- Índice para análisis de tendencias
CREATE INDEX IF NOT EXISTS idx_asistencias_diputado_periodo ON asistencias(diputado_id, periodo_id, tipo_asistencia_id);

-- Particionamiento por período legislativo
-- CREATE TABLE asistencias_periodo_371 PARTITION OF asistencias FOR VALUES FROM (371) TO (372);

-- ============================================================================
-- TABLA: tipos_asistencia
-- ============================================================================
CREATE TABLE IF NOT EXISTS tipos_asistencia (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    es_presencial BOOLEAN DEFAULT true,
    considera_quorum BOOLEAN DEFAULT true,
    color_hex VARCHAR(7) DEFAULT '#000000',
    orden_visual INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE tipos_asistencia IS 'Catálogo de tipos de asistencia';

-- Insertar tipos básicos
INSERT INTO tipos_asistencia (codigo, nombre, descripcion, es_presencial, considera_quorum, color_hex, orden_visual) VALUES
('ASISTE', 'Asiste', 'Diputado presente en la sesión', true, true, '#28a745', 1),
('JUSTIFICADO', 'Justificado', 'Inasistencia justificada', false, true, '#ffc107', 2),
('NO_ASISTE', 'No Asiste', 'Inasistencia sin justificar', false, false, '#dc3545', 3),
('LICENCIA', 'Con Licencia', 'Licencia médica o personal', false, false, '#6c757d', 4),
('COMISION', 'En Comisión', 'Participando en comisión paralela', false, true, '#17a2b8', 5)
ON CONFLICT (codigo) DO NOTHING;

-- Agregar FKs después de crear catálogos
ALTER TABLE asistencias
    ADD CONSTRAINT fk_asistencias_tipo_asistencia
    FOREIGN KEY (tipo_asistencia_id) REFERENCES tipos_asistencia(id);

-- ============================================================================
-- TABLA: tipos_justificacion
-- ============================================================================
CREATE TABLE IF NOT EXISTS tipos_justificacion (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    requiere_archivo BOOLEAN DEFAULT false,
    max_dias INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE tipos_justificacion IS 'Catálogo de tipos de justificación de inasistencia';

-- Insertar justificaciones comunes
INSERT INTO tipos_justificacion (codigo, nombre, descripcion, requiere_archivo, max_dias) VALUES
('MEDICA', 'Licencia Médica', 'Problemas de salud certificados', true, 30),
('FAMILIAR', 'Motivos Familiares', 'Fallecimiento o emergencia familiar', false, 7),
('OFICIAL', 'Misión Oficial', 'Viaje oficial o representación del país', false, 15),
('PARTICULAR', 'Motivos Particulares', 'Asuntos personales justificados', false, 3),
('COMISION', 'Trabajo en Comisión', 'Participación en comisión parlamentaria', false, 1)
ON CONFLICT (codigo) DO NOTHING;

ALTER TABLE asistencias
    ADD CONSTRAINT fk_asistencias_justificacion
    FOREIGN KEY (justificacion_id) REFERENCES tipos_justificacion(id);

-- ============================================================================
-- TABLA: votaciones
-- ============================================================================
-- Registro de votaciones individuales (nuevo)
CREATE TABLE IF NOT EXISTS votaciones (
    id BIGSERIAL PRIMARY KEY,
    sesion_id VARCHAR(50) NOT NULL REFERENCES sesiones(id) ON DELETE CASCADE,
    diputado_id VARCHAR(50) NOT NULL REFERENCES diputados(id) ON DELETE CASCADE,
    periodo_id INTEGER NOT NULL REFERENCES periodos_legislativos(id) ON DELETE CASCADE,
    
    -- Información de la votación
    numero_votacion INTEGER NOT NULL,
    tipo_votacion VARCHAR(100), -- 'nominal', 'electronica', 'simbolica'
    resultado VARCHAR(50) NOT NULL CHECK (resultado IN ('AFIRMATIVO', 'NEGATIVO', 'ABSTENCION', 'PAREO')),
    
    -- Detalles adicionales
    mocion VARCHAR(500),
    articulo VARCHAR(200),
    inciso VARCHAR(100),
    
    -- Control y auditoría
    es_voto_decisivo BOOLEAN DEFAULT false,
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(sesion_id, diputado_id, numero_votacion)
);

COMMENT ON TABLE votaciones IS 'Registro de votaciones individuales de diputados';

CREATE INDEX IF NOT EXISTS idx_votaciones_sesion ON votaciones(sesion_id, numero_votacion);
CREATE INDEX IF NOT EXISTS idx_votaciones_diputado ON votaciones(diputado_id, periodo_id);
CREATE INDEX IF NOT EXISTS idx_votaciones_resultado ON votaciones(resultado);
CREATE INDEX IF NOT EXISTS idx_votaciones_tipo ON votaciones(tipo_votacion);

-- ============================================================================
-- TABLA: comisiones
-- ============================================================================
CREATE TABLE IF NOT EXISTS comisiones (
    id VARCHAR(50) PRIMARY KEY,
    periodo_id INTEGER NOT NULL REFERENCES periodos_legislativos(id) ON DELETE CASCADE,
    nombre VARCHAR(300) NOT NULL,
    tipo VARCHAR(100) NOT NULL CHECK (tipo IN ('PERMANENTE', 'ESPECIAL', 'INVESTIGADORA')),
    descripcion TEXT,
    
    -- Miembros
    presidente_id VARCHAR(50) REFERENCES diputados(id),
    vicepresidente_id VARCHAR(50) REFERENCES diputados(id),
    secretario_id VARCHAR(50) REFERENCES diputados(id),
    
    -- Estado y control
    fecha_creacion DATE NOT NULL,
    fecha_disolucion DATE,
    is_active BOOLEAN DEFAULT true,
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

COMMENT ON TABLE comisiones IS 'Comisiones parlamentarias';

CREATE INDEX IF NOT EXISTS idx_comisiones_periodo ON comisiones(periodo_id);
CREATE INDEX IF NOT EXISTS idx_comisiones_tipo ON comisiones(tipo);
CREATE INDEX IF NOT EXISTS idx_comisiones_presidente ON comisiones(presidente_id);

-- ============================================================================
-- TABLA: comision_miembros
-- ============================================================================
CREATE TABLE IF NOT EXISTS comision_miembros (
    id BIGSERIAL PRIMARY KEY,
    comision_id VARCHAR(50) NOT NULL REFERENCES comisiones(id) ON DELETE CASCADE,
    diputado_id VARCHAR(50) NOT NULL REFERENCES diputados(id) ON DELETE CASCADE,
    periodo_id INTEGER NOT NULL REFERENCES periodos_legislativos(id) ON DELETE CASCADE,
    
    -- Rol en la comisión
    cargo VARCHAR(100) NOT NULL CHECK (cargo IN ('MIEMBRO', 'PRESIDENTE', 'VICEPRESIDENTE', 'SECRETARIO')),
    fecha_inicio DATE NOT NULL,
    fecha_termino DATE,
    
    -- Estado
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(comision_id, diputado_id, periodo_id, cargo)
);

COMMENT ON TABLE comision_miembros IS 'Miembros de comisiones parlamentarias';

CREATE INDEX IF NOT EXISTS idx_comision_miembros_comision ON comision_miembros(comision_id);
CREATE INDEX IF NOT EXISTS idx_comision_miembros_diputado ON comision_miembros(diputado_id);
CREATE INDEX IF NOT EXISTS idx_comision_miembros_periodo ON comision_miembros(periodo_id);

-- ============================================================================
-- TABLA: sincronizacion - MEJORADA
-- ============================================================================
CREATE TABLE IF NOT EXISTS sincronizacion (
    id BIGSERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('carga_inicial', 'actualizacion_incremental', 'manual', 'correccion')),
    
    -- Control de progreso
    periodo_id INTEGER REFERENCES periodos_legislativos(id),
    fecha_inicio DATE,
    fecha_termino DATE,
    ultima_sesion_procesada VARCHAR(50),
    ultimo_diputado_procesado VARCHAR(50),
    
    -- Estadísticas detalladas
    total_sesiones_procesadas INTEGER DEFAULT 0,
    total_diputados_procesados INTEGER DEFAULT 0,
    total_asistencias_procesadas INTEGER DEFAULT 0,
    total_votaciones_procesadas INTEGER DEFAULT 0,
    
    -- Métricas de rendimiento
    duracion_segundos INTEGER,
    memoria_uso_mb INTEGER,
    api_llamadas_realizadas INTEGER DEFAULT 0,
    api_llamadas_fallidas INTEGER DEFAULT 0,
    api_rate_limit_alcanzado INTEGER DEFAULT 0,
    
    -- Años y períodos procesados
    años_procesados JSONB DEFAULT '[]'::jsonb,
    periodos_procesados JSONB DEFAULT '[]'::jsonb,
    
    -- Estado y errores
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('en_progreso', 'completado', 'error', 'cancelado', 'pausado')),
    error_message TEXT,
    error_stack TEXT,
    error_code VARCHAR(50),
    
    -- Metadata adicional
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

COMMENT ON TABLE sincronizacion IS 'Registro detallado de sincronizaciones con API externa';
COMMENT ON COLUMN sincronizacion.api_rate_limit_alcanzado IS 'Número de veces que se alcanzó el límite de rate de la API';

CREATE INDEX IF NOT EXISTS idx_sincronizacion_tipo_estado ON sincronizacion(tipo, estado);
CREATE INDEX IF NOT EXISTS idx_sincronizacion_periodo ON sincronizacion(periodo_id);
CREATE INDEX IF NOT EXISTS idx_sincronizacion_fecha ON sincronizacion(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sincronizacion_estado_fecha ON sincronizacion(estado, created_at DESC);

-- ============================================================================
-- VISTAS MATERIALIZADAS OPTIMIZADAS
-- ============================================================================

-- Vista 1: Estadísticas globales por diputado
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_diputado_estadisticas AS
SELECT 
    d.id,
    d.nombre_completo,
    d.rut,
    d.rut_dv,
    d.fecha_nacimiento,
    d.sexo,
    d.region_id,
    r.nombre as region_nombre,
    d.distrito_id,
    de.numero as distrito_numero,
    
    -- Estadísticas totales
    COUNT(a.id) as total_sesiones_asistidas,
    COUNT(a.id) FILTER (WHERE ta.codigo = 'ASISTE') as total_asiste,
    COUNT(a.id) FILTER (WHERE ta.codigo = 'JUSTIFICADO') as total_justificado,
    COUNT(a.id) FILTER (WHERE ta.codigo = 'NO_ASISTE') as total_no_asiste,
    COUNT(a.id) FILTER (WHERE ta.codigo = 'LICENCIA') as total_licencia,
    COUNT(a.id) FILTER (WHERE ta.codigo = 'COMISION') as total_comision,
    
    -- Porcentajes
    ROUND(
        100.0 * COUNT(a.id) FILTER (WHERE ta.codigo = 'ASISTE') / 
        NULLIF(COUNT(a.id), 0), 2
    ) as porcentaje_asistencia,
    ROUND(
        100.0 * COUNT(a.id) FILTER (WHERE ta.es_presencial = true) / 
        NULLIF(COUNT(a.id), 0), 2
    ) as porcentaje_presencial,
    
    -- Promedios
    AVG(a.duracion_minutos) FILTER (WHERE a.duracion_minutos IS NOT NULL) as promedio_duracion_sesion,
    
    -- Rangos de fechas
    MIN(s.fecha) as primera_sesion,
    MAX(s.fecha) as ultima_sesion,
    
    -- Última actualización
    MAX(a.created_at) as ultima_actualizacion
    
FROM diputados d
LEFT JOIN regiones r ON d.region_id = r.id
LEFT JOIN distritos_electorales de ON d.distrito_id = de.id
LEFT JOIN asistencias a ON d.id = a.diputado_id
LEFT JOIN sesiones s ON a.sesion_id = s.id
LEFT JOIN tipos_asistencia ta ON a.tipo_asistencia_id = ta.id
WHERE d.is_active = true
AND (s.estado = 'Celebrada' OR s.estado IS NULL)
GROUP BY d.id, d.nombre_completo, d.rut, d.rut_dv, d.fecha_nacimiento, d.sexo, 
         d.region_id, r.nombre, d.distrito_id, de.numero;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_diputado_estadisticas_id ON mv_diputado_estadisticas(id);
CREATE INDEX IF NOT EXISTS idx_mv_diputado_estadisticas_asistencia ON mv_diputado_estadisticas(porcentaje_asistencia DESC);
CREATE INDEX IF NOT EXISTS mv_diputado_estadisticas_region ON mv_diputado_estadisticas(region_id);

-- Vista 2: Estadísticas por período legislativo
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_diputado_periodo_estadisticas AS
SELECT 
    d.id as diputado_id,
    d.nombre_completo,
    p.id as periodo_id,
    p.numero as periodo_numero,
    p.fecha_inicio as periodo_inicio,
    p.fecha_termino as periodo_termino,
    dp.distrito_id,
    dp.partido_id,
    pp.nombre as partido_nombre,
    pp.alias as partido_alias,
    
    -- Estadísticas del período
    COUNT(a.id) as total_sesiones_periodo,
    COUNT(a.id) FILTER (WHERE ta.codigo = 'ASISTE') as asiste_periodo,
    COUNT(a.id) FILTER (WHERE ta.codigo = 'JUSTIFICADO') as justificado_periodo,
    COUNT(a.id) FILTER (WHERE ta.codigo = 'NO_ASISTE') as no_asiste_periodo,
    
    -- Porcentajes del período
    ROUND(
        100.0 * COUNT(a.id) FILTER (WHERE ta.codigo = 'ASISTE') / 
        NULLIF(COUNT(a.id), 0), 2
    ) as porcentaje_asistencia_periodo,
    
    -- Ranking relativo
    RANK() OVER (PARTITION BY p.id ORDER BY COUNT(a.id) FILTER (WHERE ta.codigo = 'ASISTE') DESC) as ranking_asistencia_periodo,
    
    -- Fechas del período
    MIN(s.fecha) as primera_sesion_periodo,
    MAX(s.fecha) as ultima_sesion_periodo,
    
    -- Datos de votación
    COUNT(v.id) as total_votaciones_periodo,
    COUNT(v.id) FILTER (WHERE v.resultado = 'AFIRMATIVO') as votos_afirmativos,
    COUNT(v.id) FILTER (WHERE v.resultado = 'NEGATIVO') as votos_negativos,
    COUNT(v.id) FILTER (WHERE v.resultado = 'ABSTENCION') as abstenciones,
    
    -- Actualización
    MAX(a.created_at) as ultima_actualizacion
    
FROM diputados d
JOIN diputado_periodos dp ON d.id = dp.diputado_id
JOIN periodos_legislativos p ON dp.periodo_id = p.id
LEFT JOIN partidos_politicos pp ON dp.partido_id = pp.id
LEFT JOIN asistencias a ON d.id = a.diputado_id AND p.id = a.periodo_id
LEFT JOIN sesiones s ON a.sesion_id = s.id
LEFT JOIN tipos_asistencia ta ON a.tipo_asistencia_id = ta.id
LEFT JOIN votaciones v ON d.id = v.diputado_id AND p.id = v.periodo_id
WHERE dp.is_active = true
AND (s.estado = 'Celebrada' OR s.estado IS NULL)
GROUP BY d.id, d.nombre_completo, p.id, p.numero, p.fecha_inicio, p.fecha_termino,
         dp.distrito_id, dp.partido_id, pp.nombre, pp.alias;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_diputado_periodo_estadisticas ON mv_diputado_periodo_estadisticas(diputado_id, periodo_id);
CREATE INDEX IF NOT EXISTS idx_mv_diputado_periodo_asistencia ON mv_diputado_periodo_estadisticas(porcentaje_asistencia_periodo DESC);
CREATE INDEX IF NOT EXISTS idx_mv_diputado_periodo_partido ON mv_diputado_periodo_estadisticas(partido_id);

-- Vista 3: Estadísticas por partido político
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_partido_estadisticas AS
SELECT 
    pp.id as partido_id,
    pp.nombre as partido_nombre,
    pp.alias as partido_alias,
    pp.color_hex as partido_color,
    p.id as periodo_id,
    p.numero as periodo_numero,
    
    -- Miembros del partido en el período
    COUNT(DISTINCT dp.diputado_id) as total_diputados_partido,
    
    -- Asistencia promedio del partido
    AVG(
        CASE 
            WHEN total_asistencias.total > 0 THEN
                100.0 * total_asistencias.asiste / total_asistencias.total
            ELSE 0
        END
    ) as promedio_asistencia_partido,
    
    -- Distribución de asistencias
    SUM(total_asistencias.asiste) as total_asiste_partido,
    SUM(total_asistencias.justificado) as total_justificado_partido,
    SUM(total_asistencias.no_asiste) as total_no_asiste_partido,
    
    -- Ranking del partido
    RANK() OVER (PARTITION BY p.id ORDER BY AVG(
        CASE 
            WHEN total_asistencias.total > 0 THEN
                100.0 * total_asistencias.asiste / total_asistencias.total
            ELSE 0
        END
    ) DESC) as ranking_asistencia_partido,
    
    -- Actualización
    MAX(total_asistencias.ultima_actualizacion) as ultima_actualizacion
    
FROM partidos_politicos pp
JOIN diputado_periodos dp ON pp.id = dp.partido_id
JOIN periodos_legislativos p ON dp.periodo_id = p.id
LEFT JOIN (
    SELECT 
        diputado_id,
        periodo_id,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE tipo_asistencia_id = 1) as asiste, -- ASISTE
        COUNT(*) FILTER (WHERE tipo_asistencia_id = 2) as justificado, -- JUSTIFICADO
        COUNT(*) FILTER (WHERE tipo_asistencia_id = 3) as no_asiste, -- NO_ASISTE
        MAX(created_at) as ultima_actualizacion
    FROM asistencias
    GROUP BY diputado_id, periodo_id
) total_asistencias ON dp.diputado_id = total_asistencias.diputado_id AND dp.periodo_id = total_asistencias.periodo_id
WHERE dp.is_active = true
GROUP BY pp.id, pp.nombre, pp.alias, pp.color_hex, p.id, p.numero;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_partido_estadisticas ON mv_partido_estadisticas(partido_id, periodo_id);
CREATE INDEX IF NOT EXISTS idx_mv_partido_estadisticas_periodo ON mv_partido_estadisticas(periodo_id);
CREATE INDEX IF NOT EXISTS idx_mv_partido_estadisticas_asistencia ON mv_partido_estadisticas(promedio_asistencia_partido DESC);

-- ============================================================================
-- FUNCIONES PL/pgSQL PARA MANTENIMIENTO
-- ============================================================================

-- Función para refrescar todas las vistas materializadas
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS TABLE(view_name TEXT, status TEXT, execution_time INTERVAL) AS $$
DECLARE
    v_record RECORD;
    v_start_time TIMESTAMP;
    v_end_time TIMESTAMP;
    v_status TEXT;
    v_error_message TEXT;
BEGIN
    FOR v_record IN 
        SELECT schemaname, matviewname 
        FROM pg_matviews 
        WHERE schemaname = 'public' 
        AND matviewname LIKE 'mv_%'
        ORDER BY matviewname
    LOOP
        v_start_time := clock_timestamp();
        
        BEGIN
            EXECUTE format('REFRESH MATERIALIZED VIEW CONCURRENTLY %I.%I', 
                          v_record.schemaname, v_record.matviewname);
            v_end_time := clock_timestamp();
            v_status := 'SUCCESS';
            
            RETURN QUERY SELECT 
                v_record.matviewname::TEXT,
                v_status,
                v_end_time - v_start_time;
                
        EXCEPTION WHEN OTHERS THEN
            v_end_time := clock_timestamp();
            v_status := 'ERROR';
            v_error_message := SQLERRM;
            
            RETURN QUERY SELECT 
                v_record.matviewname::TEXT,
                v_status || ': ' || v_error_message,
                v_end_time - v_start_time;
        END;
        
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION refresh_all_materialized_views IS 'Refresca todas las vistas materializadas del sistema';

-- Función para obtener estadísticas de un diputado específico
CREATE OR REPLACE FUNCTION get_diputado_full_stats(diputado_id_param VARCHAR, periodo_id_param INTEGER DEFAULT NULL)
RETURNS TABLE (
    -- Información básica
    diputado_id VARCHAR,
    nombre_completo TEXT,
    rut VARCHAR,
    rut_dv VARCHAR,
    
    -- Estadísticas generales
    total_sesiones BIGINT,
    total_asiste BIGINT,
    total_justificado BIGINT,
    total_no_asiste BIGINT,
    porcentaje_asistencia NUMERIC,
    porcentaje_presencial NUMERIC,
    
    -- Por período (si se especifica)
    periodo_numero INTEGER,
    periodo_asistencia NUMERIC,
    periodo_ranking INTEGER,
    
    -- Datos de votación
    total_votaciones BIGINT,
    votos_afirmativos BIGINT,
    votos_negativos BIGINT,
    abstenciones BIGINT,
    
    -- Información de partido
    partido_actual VARCHAR,
    partido_color VARCHAR,
    distrito_actual INTEGER,
    
    -- Tendencias
    tendencia_asistencia VARCHAR, -- 'MEJORANDO', 'ESTABLE', 'EMPEORANDO'
    asistencia_ultimo_mes NUMERIC,
    asistencia_ultimo_anio NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.nombre_completo,
        d.rut,
        d.rut_dv,
        COALESCE(mde.total_sesiones_asistidas, 0),
        COALESCE(mde.total_asiste, 0),
        COALESCE(mde.total_justificado, 0),
        COALESCE(mde.total_no_asiste, 0),
        COALESCE(mde.porcentaje_asistencia, 0),
        COALESCE(mde.porcentaje_presencial, 0),
        
        -- Por período
        mdpe.periodo_numero,
        COALESCE(mdpe.porcentaje_asistencia_periodo, 0),
        mdpe.ranking_asistencia_periodo,
        
        -- Votaciones
        COALESCE(v_stats.total_votaciones, 0),
        COALESCE(v_stats.votos_afirmativos, 0),
        COALESCE(v_stats.votos_negativos, 0),
        COALESCE(v_stats.abstenciones, 0),
        
        -- Partido y distrito
        pp.nombre,
        pp.color_hex,
        de.numero,
        
        -- Tendencias (placeholder - requiere cálculo adicional)
        'ESTABLE'::VARCHAR,
        COALESCE(recent_stats.asistencia_mes, 0),
        COALESCE(recent_stats.asistencia_anio, 0)
        
    FROM diputados d
    LEFT JOIN mv_diputado_estadisticas mde ON d.id = mde.id
    LEFT JOIN mv_diputado_periodo_estadisticas mdpe ON d.id = mdpe.diputado_id 
        AND (periodo_id_param IS NULL OR mdpe.periodo_id = periodo_id_param)
    LEFT JOIN partidos_politicos pp ON mdpe.partido_id = pp.id
    LEFT JOIN distritos_electorales de ON mdpe.distrito_id = de.id
    LEFT JOIN (
        SELECT 
            diputado_id,
            COUNT(*) as total_votaciones,
            COUNT(*) FILTER (WHERE resultado = 'AFIRMATIVO') as votos_afirmativos,
            COUNT(*) FILTER (WHERE resultado = 'NEGATIVO') as votos_negativos,
            COUNT(*) FILTER (WHERE resultado = 'ABSTENCION') as abstenciones
        FROM votaciones
        GROUP BY diputado_id
    ) v_stats ON d.id = v_stats.diputado_id
    LEFT JOIN (
        SELECT 
            diputado_id,
            AVG(CASE WHEN fecha >= CURRENT_DATE - INTERVAL '30 days' THEN 100.0 ELSE 0 END) as asistencia_mes,
            AVG(CASE WHEN fecha >= CURRENT_DATE - INTERVAL '1 year' THEN 100.0 ELSE 0 END) as asistencia_anio
        FROM asistencias a
        JOIN sesiones s ON a.sesion_id = s.id
        WHERE s.fecha >= CURRENT_DATE - INTERVAL '1 year'
        GROUP BY diputado_id
    ) recent_stats ON d.id = recent_stats.diputado_id
    WHERE d.id = diputado_id_param;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_diputado_full_stats IS 'Obtiene estadísticas completas de un diputado específico';

-- ============================================================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ============================================================================

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas
CREATE TRIGGER update_diputados_updated_at 
    BEFORE UPDATE ON diputados 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partidos_updated_at 
    BEFORE UPDATE ON partidos_politicos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_periodos_updated_at 
    BEFORE UPDATE ON periodos_legislativos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sesiones_updated_at 
    BEFORE UPDATE ON sesiones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asistencias_updated_at 
    BEFORE UPDATE ON asistencias 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Compute nombre_completo en diputados
CREATE OR REPLACE FUNCTION diputados_compute_nombre_completo()
RETURNS TRIGGER AS $$
BEGIN
    NEW.nombre_completo := COALESCE(NEW.nombre, '') || ' ' || COALESCE(NEW.apellido_paterno, '') || ' ' || COALESCE(NEW.apellido_materno, '');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER diputados_set_nombre_completo
    BEFORE INSERT OR UPDATE ON diputados
    FOR EACH ROW EXECUTE FUNCTION diputados_compute_nombre_completo();

-- Compute duracion_minutos en sesiones
CREATE OR REPLACE FUNCTION sesiones_compute_duracion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.hora_inicio IS NOT NULL AND NEW.hora_termino IS NOT NULL THEN
        NEW.duracion_minutos := EXTRACT(EPOCH FROM (NEW.hora_termino - NEW.hora_inicio)) / 60;
    ELSE
        NEW.duracion_minutos := NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sesiones_set_duracion
    BEFORE INSERT OR UPDATE ON sesiones
    FOR EACH ROW EXECUTE FUNCTION sesiones_compute_duracion();

-- Compute duracion_minutos en asistencias
CREATE OR REPLACE FUNCTION asistencias_compute_duracion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.hora_entrada IS NOT NULL AND NEW.hora_salida IS NOT NULL THEN
        NEW.duracion_minutos := EXTRACT(EPOCH FROM (NEW.hora_salida - NEW.hora_entrada)) / 60;
    ELSE
        NEW.duracion_minutos := NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER asistencias_set_duracion
    BEFORE INSERT OR UPDATE ON asistencias
    FOR EACH ROW EXECUTE FUNCTION asistencias_compute_duracion();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - POLÍTICAS MEJORADAS
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE regiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE provincias ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunas ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidos_politicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE periodos_legislativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE distritos_electorales ENABLE ROW LEVEL SECURITY;
ALTER TABLE diputados ENABLE ROW LEVEL SECURITY;
ALTER TABLE diputado_militancias ENABLE ROW LEVEL SECURITY;
ALTER TABLE diputado_periodos ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE votaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE comisiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE comision_miembros ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_asistencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_justificacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE sincronizacion ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (lectura para todos)
CREATE POLICY "Permitir lectura pública de regiones" ON regiones FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de provincias" ON provincias FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de comunas" ON comunas FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de partidos" ON partidos_politicos FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir lectura pública de períodos" ON periodos_legislativos FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de distritos" ON distritos_electorales FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de diputados" ON diputados FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir lectura pública de tipos asistencia" ON tipos_asistencia FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir lectura pública de tipos justificación" ON tipos_justificacion FOR SELECT USING (is_active = true);

-- Políticas para datos sensibles (solo lectura de activos)
CREATE POLICY "Permitir lectura pública de militancias activas" ON diputado_militancias FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir lectura pública de períodos activos" ON diputado_periodos FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir lectura pública de sesiones" ON sesiones FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de asistencias" ON asistencias FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de votaciones" ON votaciones FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de comisiones" ON comisiones FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir lectura pública de miembros comisión" ON comision_miembros FOR SELECT USING (is_active = true);
CREATE POLICY "Permitir lectura pública de sincronización" ON sincronizacion FOR SELECT USING (true);

-- Políticas de escritura (solo service_role)
-- Nota: Estas políticas no se definen aquí porque solo el backend con service_role_key debe escribir

-- ============================================================================
-- DATOS INICIALES DE REFERENCIA
-- ============================================================================

-- Regiones de Chile
INSERT INTO regiones (codigo, nombre, ordinal, is_active) VALUES
('XV', 'Arica y Parinacota', 'Quincuagésimo Primera', true),
('I', 'Tarapacá', 'Primera', true),
('II', 'Antofagasta', 'Segunda', true),
('III', 'Atacama', 'Tercera', true),
('IV', 'Coquimbo', 'Cuarta', true),
('V', 'Valparaíso', 'Quinta', true),
('RM', 'Metropolitana', 'Metropolitana', true),
('VI', 'O''Higgins', 'Sexta', true),
('VII', 'Maule', 'Séptima', true),
('XVI', 'Ñuble', 'Décimo Sexta', true),
('VIII', 'Biobío', 'Octava', true),
('IX', 'Araucanía', 'Novena', true),
('XIV', 'Los Ríos', 'Décimo Cuarta', true),
('X', 'Los Lagos', 'Décima', true),
('XI', 'Aysén', 'Undécima', true),
('XII', 'Magallanes', 'Duodécima', true)
ON CONFLICT (codigo) DO NOTHING;

-- Partidos políticos comunes (actualizar según período actual)
INSERT INTO partidos_politicos (codigo, nombre, alias, color_hex, is_active) VALUES
('RN', 'Renovación Nacional', 'RN', '#0000FF', true),
('UDI', 'Unión Demócrata Independiente', 'UDI', '#000080', true),
('EVO', 'Evópoli', 'EVO', '#800080', true),
('DC', 'Democracia Cristiana', 'DC', '#008000', true),
('PS', 'Partido Socialista', 'PS', '#FF0000', true),
('PPD', 'Partido Por la Democracia', 'PPD', '#FF69B4', true),
('PR', 'Partido Radical', 'PR', '#FF4500', true),
('IND', 'Independiente', 'IND', '#808080', true)
ON CONFLICT (codigo) DO NOTHING;

-- Períodos legislativos recientes
-- IMPORTANTE: fecha_termino debe ser explícita para evitar conflictos con constraint no_overlap_periodos
INSERT INTO periodos_legislativos (numero, fecha_inicio, fecha_termino, descripcion, is_active) VALUES
(371, '2010-03-11', '2014-03-10', 'Período Legislativo 2010-2014', false),
(372, '2014-03-11', '2018-03-10', 'Período Legislativo 2014-2018', false),
(373, '2018-03-11', '2022-03-10', 'Período Legislativo 2018-2022', false),
(374, '2022-03-11', '2026-03-10', 'Período Legislativo 2022-2026', true)
ON CONFLICT (numero) DO UPDATE SET
    fecha_termino = EXCLUDED.fecha_termino,
    descripcion = EXCLUDED.descripcion,
    is_active = EXCLUDED.is_active;

-- ============================================================================
-- FUNCIONES DE MANTENIMIENTO Y MONITOREO
-- ============================================================================

-- Función para verificar integridad de datos
CREATE OR REPLACE FUNCTION verificar_integridad_datos()
RETURNS TABLE (tipo_error TEXT, tabla_error TEXT, detalle TEXT, cantidad BIGINT) AS $$
BEGIN
    -- Diputados sin asistencias
    RETURN QUERY
    SELECT 
        'DIPUTADO_SIN_ASISTENCIAS'::TEXT,
        'diputados'::TEXT,
        'Diputados activos sin registros de asistencia'::TEXT,
        COUNT(*)
    FROM diputados d
    WHERE d.is_active = true
    AND NOT EXISTS (
        SELECT 1 FROM asistencias a WHERE a.diputado_id = d.id
    );
    
    -- Asistencias sin sesiones
    RETURN QUERY
    SELECT 
        'ASISTENCIA_SIN_SESION'::TEXT,
        'asistencias'::TEXT,
        'Asistencias que referencian sesiones inexistentes'::TEXT,
        COUNT(*)
    FROM asistencias a
    WHERE NOT EXISTS (
        SELECT 1 FROM sesiones s WHERE s.id = a.sesion_id
    );
    
    -- Sesiones sin asistencias
    RETURN QUERY
    SELECT 
        'SESION_SIN_ASISTENCIAS'::TEXT,
        'sesiones'::TEXT,
        'Sesiones celebradas sin asistencias registradas'::TEXT,
        COUNT(*)
    FROM sesiones s
    WHERE s.estado = 'Celebrada'
    AND NOT EXISTS (
        SELECT 1 FROM asistencias a WHERE a.sesion_id = s.id
    );
    
    -- Diputados en múltiples partidos simultáneamente
    RETURN QUERY
    SELECT 
        'MILITANCIA_SIMULTANEA'::TEXT,
        'diputado_militancias'::TEXT,
        'Diputados con militancias simultáneas activas'::TEXT,
        COUNT(DISTINCT diputado_id)
    FROM diputado_militancias dm1
    WHERE EXISTS (
        SELECT 1 
        FROM diputado_militancias dm2
        WHERE dm1.diputado_id = dm2.diputado_id
        AND dm1.id != dm2.id
        AND dm1.is_active = true
        AND dm2.is_active = true
        AND daterange(dm1.fecha_inicio, dm1.fecha_termino) && daterange(dm2.fecha_inicio, dm2.fecha_termino)
    );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION verificar_integridad_datos IS 'Verifica la integridad de los datos en el sistema';

-- ============================================================================
-- FIN DE MIGRATION 002
-- ============================================================================

-- Para verificar la instalación:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- SELECT matviewname FROM pg_matviews WHERE schemaname = 'public' ORDER BY matviewname;
-- SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION' ORDER BY routine_name;