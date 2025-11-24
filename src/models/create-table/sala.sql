-- ============================================
-- MÓDULO: SALA
-- Basado en: src/interface/external/camara-diputados/sala/
-- DTOs Principales: SesionResumenDto, AsistenciaDto
-- ============================================

-- Tabla: sesiones_sala
-- Mapea: SesionResumenDto y SesionSalaDto
CREATE TABLE IF NOT EXISTS sesiones_sala (
    id VARCHAR(50) PRIMARY KEY,
    numero VARCHAR(10) NOT NULL,
    fecha_inicio TIMESTAMPTZ NOT NULL,
    fecha_termino TIMESTAMPTZ,
    tipo_valor VARCHAR(50),
    tipo_texto VARCHAR(200),
    estado_valor VARCHAR(50),
    estado_texto VARCHAR(200),
    legislatura INTEGER,
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: asistencias_sala
-- Mapea: AsistenciaDto
CREATE TABLE IF NOT EXISTS asistencias_sala (
    id SERIAL PRIMARY KEY,
    sesion_id VARCHAR(50) NOT NULL REFERENCES sesiones_sala(id) ON DELETE CASCADE,
    diputado_id VARCHAR(50) NOT NULL REFERENCES diputados(id) ON DELETE CASCADE,
    tipo_asistencia_valor VARCHAR(50),
    tipo_asistencia_texto VARCHAR(200),
    
    -- Justificación (opcional)
    justificacion_valor VARCHAR(50),
    justificacion_nombre VARCHAR(200),
    justificacion_rebaja_asistencia VARCHAR(10),
    justificacion_rebaja_quorum VARCHAR(10),
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uk_asistencia_sesion_diputado UNIQUE (sesion_id, diputado_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_sesiones_fecha ON sesiones_sala(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_sesiones_legislatura ON sesiones_sala(legislatura);
CREATE INDEX IF NOT EXISTS idx_sesiones_estado ON sesiones_sala(estado_valor);
CREATE INDEX IF NOT EXISTS idx_sesiones_created ON sesiones_sala(created_at);

CREATE INDEX IF NOT EXISTS idx_asistencias_sesion ON asistencias_sala(sesion_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_diputado ON asistencias_sala(diputado_id);
CREATE INDEX IF NOT EXISTS idx_asistencias_tipo ON asistencias_sala(tipo_asistencia_valor);
CREATE INDEX IF NOT EXISTS idx_asistencias_created ON asistencias_sala(created_at);

-- Triggers
CREATE TRIGGER trg_sesiones_sala_updated_at
    BEFORE UPDATE ON sesiones_sala
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_asistencias_sala_updated_at
    BEFORE UPDATE ON asistencias_sala
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
