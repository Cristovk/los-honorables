-- ============================================
-- MÓDULO: COMISIONES
-- Basado en: src/interface/external/camara-diputados/comisiones/
-- DTO Principal: ComisionResumenDto
-- ============================================

-- Tabla: comisiones
-- Mapea: ComisionResumenDto
CREATE TABLE IF NOT EXISTS comisiones (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(300) NOT NULL,
    nombre_web VARCHAR(300),
    alias VARCHAR(100),
    tipo_valor VARCHAR(50),
    tipo_texto VARCHAR(200),
    fecha_inicio DATE,
    fecha_constitucion DATE,
    fecha_termino DATE,
    correo VARCHAR(200),
    telefono VARCHAR(50),
    fax VARCHAR(50),
    numero VARCHAR(50),
    presidente_id VARCHAR(50) REFERENCES diputados(id),
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: sesiones_comision
-- Para almacenar sesiones de comisiones por año
CREATE TABLE IF NOT EXISTS sesiones_comision (
    id SERIAL PRIMARY KEY,
    comision_id VARCHAR(50) NOT NULL REFERENCES comisiones(id) ON DELETE CASCADE,
    anno INTEGER NOT NULL,
    numero VARCHAR(10),
    fecha TIMESTAMPTZ,
    tipo_valor VARCHAR(50),
    tipo_texto VARCHAR(200),
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uk_sesion_comision UNIQUE (comision_id, anno, numero)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_comisiones_nombre ON comisiones(nombre);
CREATE INDEX IF NOT EXISTS idx_comisiones_tipo ON comisiones(tipo_valor);
CREATE INDEX IF NOT EXISTS idx_comisiones_presidente ON comisiones(presidente_id);
CREATE INDEX IF NOT EXISTS idx_comisiones_created ON comisiones(created_at);

CREATE INDEX IF NOT EXISTS idx_sesiones_comision_comision ON sesiones_comision(comision_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_comision_anno ON sesiones_comision(anno);
CREATE INDEX IF NOT EXISTS idx_sesiones_comision_fecha ON sesiones_comision(fecha);

-- Triggers
CREATE TRIGGER trg_comisiones_updated_at
    BEFORE UPDATE ON comisiones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_sesiones_comision_updated_at
    BEFORE UPDATE ON sesiones_comision
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
