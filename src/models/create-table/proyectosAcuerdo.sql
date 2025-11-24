-- ============================================
-- MÓDULO: PROYECTOS DE ACUERDO
-- Basado en: src/interface/external/camara-diputados/proyectosAcuerdo/
-- DTO Principal: ProyectoAcuerdoResumenDto
-- ============================================

-- Tabla: proyectos_acuerdo
-- Mapea: ProyectoAcuerdoResumenDto
CREATE TABLE IF NOT EXISTS proyectos_acuerdo (
    id VARCHAR(50) PRIMARY KEY,
    numero VARCHAR(50) NOT NULL,
    materia TEXT NOT NULL,
    fecha_ingreso DATE NOT NULL,
    estado_valor VARCHAR(50),
    estado_texto VARCHAR(200),
    periodo_id VARCHAR(50),
    periodo_nombre VARCHAR(200),
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_proyectos_acuerdo_numero ON proyectos_acuerdo(numero);
CREATE INDEX IF NOT EXISTS idx_proyectos_acuerdo_fecha ON proyectos_acuerdo(fecha_ingreso);
CREATE INDEX IF NOT EXISTS idx_proyectos_acuerdo_estado ON proyectos_acuerdo(estado_valor);
CREATE INDEX IF NOT EXISTS idx_proyectos_acuerdo_periodo ON proyectos_acuerdo(periodo_id);
CREATE INDEX IF NOT EXISTS idx_proyectos_acuerdo_created ON proyectos_acuerdo(created_at);

-- Trigger
CREATE TRIGGER trg_proyectos_acuerdo_updated_at
    BEFORE UPDATE ON proyectos_acuerdo
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
