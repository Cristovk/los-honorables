-- ============================================
-- MÓDULO: PROYECTOS (Relación Proyectos-Votaciones)
-- Basado en: src/interface/external/camara-diputados/proyectos/
-- DTO Principal: VotacionProyectoLeyDto (desde proyecto-ley-votaciones.dto.ts)
-- ============================================

-- Tabla: votaciones_proyecto_ley
-- Mapea: VotacionProyectoLeyDto (votaciones específicas de un proyecto)
CREATE TABLE IF NOT EXISTS votaciones_proyecto_ley (
    id VARCHAR(50) PRIMARY KEY,
    proyecto_id VARCHAR(50) NOT NULL REFERENCES proyectos_ley(id) ON DELETE CASCADE,
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
    tipo_votacion_proyecto_ley_valor VARCHAR(50),
    tipo_votacion_proyecto_ley_texto VARCHAR(200),
    articulo VARCHAR(200),
    tramite_constitucional_id VARCHAR(50),
    tramite_constitucional_nombre VARCHAR(200),
    tramite_reglamentario_id VARCHAR(50),
    tramite_reglamentario_nombre VARCHAR(200),
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_votaciones_proyecto_proyecto ON votaciones_proyecto_ley(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_votaciones_proyecto_fecha ON votaciones_proyecto_ley(fecha);
CREATE INDEX IF NOT EXISTS idx_votaciones_proyecto_resultado ON votaciones_proyecto_ley(resultado_valor);
CREATE INDEX IF NOT EXISTS idx_votaciones_proyecto_tipo ON votaciones_proyecto_ley(tipo_valor);
CREATE INDEX IF NOT EXISTS idx_votaciones_proyecto_created ON votaciones_proyecto_ley(created_at);

-- Trigger
CREATE TRIGGER trg_votaciones_proyecto_ley_updated_at
    BEFORE UPDATE ON votaciones_proyecto_ley
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
