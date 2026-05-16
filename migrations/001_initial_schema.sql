-- ============================================================================
-- Migration 001: Initial Schema
-- ============================================================================
-- Proyecto: Los Honorables
-- Descripción: Creación de tablas base para almacenar datos de asistencia
--              de diputados a sesiones legislativas
-- Autor: Winnie Cofre
-- Fecha: 2025-01-20
-- ============================================================================

-- Habilitar extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLA: diputados
-- ============================================================================
-- Almacena información básica de los diputados
CREATE TABLE IF NOT EXISTS diputados (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE diputados IS 'Información básica de diputados de Chile';
COMMENT ON COLUMN diputados.id IS 'ID único del diputado (proviene de API externa)';
COMMENT ON COLUMN diputados.nombre IS 'Nombre(s) del diputado';
COMMENT ON COLUMN diputados.apellido_paterno IS 'Apellido paterno del diputado';
COMMENT ON COLUMN diputados.apellido_materno IS 'Apellido materno del diputado';

-- ============================================================================
-- TABLA: sesiones
-- ============================================================================
-- Almacena información de las sesiones legislativas (Sala o Comisión)
CREATE TABLE IF NOT EXISTS sesiones (
    id VARCHAR(50) PRIMARY KEY,
    fecha DATE NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Sala', 'Comision')),
    numero_sesion INT,
    legislatura INT,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('Celebrada', 'Programada', 'Suspendida', 'Cancelada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE sesiones IS 'Sesiones legislativas (Sala y Comisiones)';
COMMENT ON COLUMN sesiones.id IS 'ID único de la sesión (proviene de API externa)';
COMMENT ON COLUMN sesiones.fecha IS 'Fecha en que se realizó o realizará la sesión';
COMMENT ON COLUMN sesiones.tipo IS 'Tipo de sesión: Sala o Comision';
COMMENT ON COLUMN sesiones.numero_sesion IS 'Número correlativo de la sesión';
COMMENT ON COLUMN sesiones.legislatura IS 'Número de legislatura';
COMMENT ON COLUMN sesiones.estado IS 'Estado actual de la sesión';

-- ============================================================================
-- TABLA: asistencias
-- ============================================================================
-- Tabla pivote que relaciona diputados con sesiones y su tipo de asistencia
CREATE TABLE IF NOT EXISTS asistencias (
    id SERIAL PRIMARY KEY,
    diputado_id VARCHAR(50) NOT NULL REFERENCES diputados(id) ON DELETE CASCADE,
    sesion_id VARCHAR(50) NOT NULL REFERENCES sesiones(id) ON DELETE CASCADE,
    tipo_asistencia VARCHAR(50) NOT NULL CHECK (tipo_asistencia IN ('Asiste', 'Justificado', 'NoAsiste')),
    tipo_asistencia_code INT NOT NULL CHECK (tipo_asistencia_code IN (0, 1, 2)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint único para evitar registros duplicados
    UNIQUE(diputado_id, sesion_id)
);

COMMENT ON TABLE asistencias IS 'Registro de asistencia de diputados a sesiones';
COMMENT ON COLUMN asistencias.diputado_id IS 'FK: ID del diputado';
COMMENT ON COLUMN asistencias.sesion_id IS 'FK: ID de la sesión';
COMMENT ON COLUMN asistencias.tipo_asistencia IS 'Tipo textual: Asiste, Justificado, NoAsiste';
COMMENT ON COLUMN asistencias.tipo_asistencia_code IS 'Código numérico: 1=Asiste, 2=Justificado, 0=NoAsiste';

-- ============================================================================
-- TABLA: sincronizacion
-- ============================================================================
-- Registro de sincronizaciones realizadas con la API externa
CREATE TABLE IF NOT EXISTS sincronizacion (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('carga_inicial', 'actualizacion_incremental', 'manual')),
    ultima_sesion_procesada VARCHAR(50),
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    años_procesados JSONB DEFAULT '[]'::jsonb,
    registros_procesados INT DEFAULT 0,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('en_progreso', 'completado', 'error', 'cancelado')),
    error_message TEXT,
    duracion_segundos INT,
    
    -- Metadata adicional
    metadata JSONB DEFAULT '{}'::jsonb
);

COMMENT ON TABLE sincronizacion IS 'Registro histórico de sincronizaciones con API externa';
COMMENT ON COLUMN sincronizacion.tipo IS 'Tipo de sincronización ejecutada';
COMMENT ON COLUMN sincronizacion.ultima_sesion_procesada IS 'ID de la última sesión procesada en esta sync';
COMMENT ON COLUMN sincronizacion.años_procesados IS 'Array JSON con años procesados [2020, 2021, ...]';
COMMENT ON COLUMN sincronizacion.registros_procesados IS 'Cantidad total de registros procesados';
COMMENT ON COLUMN sincronizacion.estado IS 'Estado final de la sincronización';
COMMENT ON COLUMN sincronizacion.error_message IS 'Mensaje de error si falló';
COMMENT ON COLUMN sincronizacion.duracion_segundos IS 'Tiempo total en segundos';

-- ============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

-- Índices en tabla asistencias (queries más frecuentes)
CREATE INDEX IF NOT EXISTS idx_asistencias_diputado_id ON asistencias(diputado_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_sesion_id ON asistencias(sesion_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_tipo_code ON asistencias(tipo_asistencia_code);
CREATE INDEX IF NOT EXISTS idx_asistencias_created_at ON asistencias(created_at);

-- Índices en tabla sesiones
CREATE INDEX IF NOT EXISTS idx_sesiones_fecha ON sesiones(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_sesiones_estado ON sesiones(estado);
CREATE INDEX IF NOT EXISTS idx_sesiones_tipo ON sesiones(tipo);
CREATE INDEX IF NOT EXISTS idx_sesiones_legislatura ON sesiones(legislatura);

-- Índices en tabla diputados
CREATE INDEX IF NOT EXISTS idx_diputados_nombre_completo ON diputados(apellido_paterno, apellido_materno, nombre);

-- Índices en tabla sincronizacion
CREATE INDEX IF NOT EXISTS idx_sincronizacion_tipo ON sincronizacion(tipo);
CREATE INDEX IF NOT EXISTS idx_sincronizacion_estado ON sincronizacion(estado);
CREATE INDEX IF NOT EXISTS idx_sincronizacion_fecha ON sincronizacion(ultima_actualizacion DESC);

-- ============================================================================
-- TRIGGER: Actualizar updated_at automáticamente
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_diputados_updated_at 
    BEFORE UPDATE ON diputados 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VISTA MATERIALIZADA: estadisticas_diputados
-- ============================================================================
-- Vista pre-calculada con estadísticas de asistencia por diputado
-- IMPORTANTE: Debe refrescarse con REFRESH MATERIALIZED VIEW después de cada sync

CREATE MATERIALIZED VIEW IF NOT EXISTS estadisticas_diputados AS
SELECT 
    d.id,
    d.nombre,
    d.apellido_paterno,
    d.apellido_materno,
    CONCAT(d.nombre, ' ', d.apellido_paterno, ' ', d.apellido_materno) as nombre_completo,
    COUNT(a.id) as total_sesiones,
    COUNT(a.id) FILTER (WHERE a.tipo_asistencia_code = 1) as asiste,
    COUNT(a.id) FILTER (WHERE a.tipo_asistencia_code = 2) as justificado,
    COUNT(a.id) FILTER (WHERE a.tipo_asistencia_code = 0) as no_asiste,
    ROUND(
        100.0 * COUNT(a.id) FILTER (WHERE a.tipo_asistencia_code = 1) / 
        NULLIF(COUNT(a.id), 0), 
        2
    ) as porcentaje_asistencia,
    ROUND(
        100.0 * COUNT(a.id) FILTER (WHERE a.tipo_asistencia_code = 2) / 
        NULLIF(COUNT(a.id), 0), 
        2
    ) as porcentaje_justificado,
    ROUND(
        100.0 * COUNT(a.id) FILTER (WHERE a.tipo_asistencia_code = 0) / 
        NULLIF(COUNT(a.id), 0), 
        2
    ) as porcentaje_no_asiste
FROM diputados d
LEFT JOIN asistencias a ON d.id = a.diputado_id
LEFT JOIN sesiones s ON a.sesion_id = s.id
WHERE s.estado = 'Celebrada'
GROUP BY d.id, d.nombre, d.apellido_paterno, d.apellido_materno;

-- Crear índice en la vista materializada
CREATE UNIQUE INDEX IF NOT EXISTS idx_estadisticas_diputados_id ON estadisticas_diputados(id);
CREATE INDEX IF NOT EXISTS idx_estadisticas_porcentaje_asistencia ON estadisticas_diputados(porcentaje_asistencia DESC);

COMMENT ON MATERIALIZED VIEW estadisticas_diputados IS 'Estadísticas agregadas de asistencia por diputado';

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Configuración de seguridad a nivel de fila para acceso público controlado

-- Habilitar RLS en todas las tablas
ALTER TABLE diputados ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE sincronizacion ENABLE ROW LEVEL SECURITY;

-- Políticas: Lectura pública, escritura solo con service_role
CREATE POLICY "Permitir lectura pública de diputados" 
    ON diputados FOR SELECT 
    USING (true);

CREATE POLICY "Permitir lectura pública de sesiones" 
    ON sesiones FOR SELECT 
    USING (true);

CREATE POLICY "Permitir lectura pública de asistencias" 
    ON asistencias FOR SELECT 
    USING (true);

CREATE POLICY "Permitir lectura pública de sincronizacion" 
    ON sincronizacion FOR SELECT 
    USING (true);

-- Políticas de escritura (solo service_role puede escribir)
-- Nota: Las políticas de INSERT/UPDATE/DELETE no se definen aquí porque
-- solo el backend con service_role_key debe poder escribir

-- ============================================================================
-- FUNCIONES ÚTILES
-- ============================================================================

-- Función para refrescar la vista materializada
CREATE OR REPLACE FUNCTION refresh_estadisticas_diputados()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY estadisticas_diputados;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION refresh_estadisticas_diputados IS 'Refresca la vista materializada de estadísticas de diputados';

-- Función para obtener estadísticas de un diputado específico
CREATE OR REPLACE FUNCTION get_estadisticas_diputado(diputado_id_param VARCHAR)
RETURNS TABLE (
    nombre_completo TEXT,
    total_sesiones BIGINT,
    asiste BIGINT,
    justificado BIGINT,
    no_asiste BIGINT,
    porcentaje_asistencia NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ed.nombre_completo::TEXT,
        ed.total_sesiones,
        ed.asiste,
        ed.justificado,
        ed.no_asiste,
        ed.porcentaje_asistencia
    FROM estadisticas_diputados ed
    WHERE ed.id = diputado_id_param;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_estadisticas_diputado IS 'Obtiene estadísticas de asistencia de un diputado específico';

-- ============================================================================
-- DATOS INICIALES (SEED DATA) - OPCIONAL
-- ============================================================================

-- Puedes descomentar esto si quieres insertar datos de prueba
-- INSERT INTO diputados (id, nombre, apellido_paterno, apellido_materno) VALUES
-- ('1', 'Juan', 'Pérez', 'González'),
-- ('2', 'María', 'López', 'Fernández');

-- ============================================================================
-- FIN DE MIGRATION 001
-- ============================================================================

-- Para verificar que todo se creó correctamente:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT matviewname FROM pg_matviews WHERE schemaname = 'public';
