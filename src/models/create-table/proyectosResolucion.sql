-- ============================================
-- MÓDULO: PROYECTOS DE RESOLUCIÓN
-- Basado en: src/interface/external/camara-diputados/proyectosResolucion/
-- DTO Principal: ProyectoResolucionResumenDto
-- ============================================

-- Tabla: proyectos_resolucion
-- Mapea: ProyectoResolucionResumenDto
CREATE TABLE IF NOT EXISTS proyectos_resolucion (
    id VARCHAR(50) PRIMARY KEY,
    numero VARCHAR(50) NOT NULL,
    materia TEXT NOT NULL,
    fecha_ingreso DATE NOT NULL,
    estado_valor VARCHAR(50),
    estado_texto VARCHAR(200),
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_proyectos_resolucion_numero ON proyectos_resolucion(numero);
CREATE INDEX IF NOT EXISTS idx_proyectos_resolucion_fecha ON proyectos_resolucion(fecha_ingreso);
CREATE INDEX IF NOT EXISTS idx_proyectos_resolucion_estado ON proyectos_resolucion(estado_valor);
CREATE INDEX IF NOT EXISTS idx_proyectos_resolucion_created ON proyectos_resolucion(created_at);

-- Trigger
CREATE TRIGGER trg_proyectos_resolucion_updated_at
    BEFORE UPDATE ON proyectos_resolucion
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
