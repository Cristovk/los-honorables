-- ============================================
-- MÓDULO: VOTACIONES
-- Basado en: src/interface/external/camara-diputados/votaciones/
-- DTOs Principales: VotacionDetalleDto, VotoDto
-- ============================================

-- Tabla: votaciones
-- Mapea: VotacionDetalleDto
CREATE TABLE IF NOT EXISTS votaciones (
    id VARCHAR(50) PRIMARY KEY,
    descripcion TEXT NOT NULL,
    fecha TIMESTAMPTZ NOT NULL,
    total_si INTEGER DEFAULT 0,
    total_no INTEGER DEFAULT 0,
    total_abstencion INTEGER DEFAULT 0,
    total_dispensado INTEGER DEFAULT 0,
    quorum_valor VARCHAR(50),
    quorum_texto VARCHAR(200),
    resultado_valor VARCHAR(50),
    resultado_texto VARCHAR(200),
    tipo_valor VARCHAR(50),
    tipo_texto VARCHAR(200),
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: votos_diputados
-- Mapea: VotoDto (votos individuales)
CREATE TABLE IF NOT EXISTS votos_diputados (
    id SERIAL PRIMARY KEY,
    votacion_id VARCHAR(50) NOT NULL REFERENCES votaciones(id) ON DELETE CASCADE,
    diputado_id VARCHAR(50) NOT NULL REFERENCES diputados(id) ON DELETE CASCADE,
    opcion_voto_valor VARCHAR(50),
    opcion_voto_texto VARCHAR(200),
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uk_voto_votacion_diputado UNIQUE (votacion_id, diputado_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_votaciones_fecha ON votaciones(fecha);
CREATE INDEX IF NOT EXISTS idx_votaciones_resultado ON votaciones(resultado_valor);
CREATE INDEX IF NOT EXISTS idx_votaciones_tipo ON votaciones(tipo_valor);
CREATE INDEX IF NOT EXISTS idx_votaciones_created ON votaciones(created_at);

CREATE INDEX IF NOT EXISTS idx_votos_votacion ON votos_diputados(votacion_id);
CREATE INDEX IF NOT EXISTS idx_votos_diputado ON votos_diputados(diputado_id);
CREATE INDEX IF NOT EXISTS idx_votos_opcion ON votos_diputados(opcion_voto_valor);
CREATE INDEX IF NOT EXISTS idx_votos_created ON votos_diputados(created_at);

-- Triggers
CREATE TRIGGER trg_votaciones_updated_at
    BEFORE UPDATE ON votaciones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_votos_diputados_updated_at
    BEFORE UPDATE ON votos_diputados
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
