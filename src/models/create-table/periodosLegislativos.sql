-- ============================================
-- MÓDULO: PERIODOS LEGISLATIVOS
-- Basado en: src/interface/external/camara-diputados/periodosLegislativos/
-- DTOs Principales: PeriodoLegislativoDto, LegislaturaDto
-- ============================================

-- Tabla: periodos_legislativos
-- Mapea: PeriodoLegislativoDto
CREATE TABLE IF NOT EXISTS periodos_legislativos (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_termino DATE,
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: legislaturas
-- Mapea: LegislaturaDto
CREATE TABLE IF NOT EXISTS legislaturas (
    id VARCHAR(50) PRIMARY KEY,
    periodo_id VARCHAR(50) NOT NULL REFERENCES periodos_legislativos(id) ON DELETE CASCADE,
    numero VARCHAR(10) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_termino DATE,
    tipo_valor VARCHAR(50),
    tipo_texto VARCHAR(200),
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uk_legislatura_periodo UNIQUE (periodo_id, numero)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_periodos_nombre ON periodos_legislativos(nombre);
CREATE INDEX IF NOT EXISTS idx_periodos_fecha_inicio ON periodos_legislativos(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_periodos_created ON periodos_legislativos(created_at);

CREATE INDEX IF NOT EXISTS idx_legislaturas_periodo ON legislaturas(periodo_id);
CREATE INDEX IF NOT EXISTS idx_legislaturas_numero ON legislaturas(numero);
CREATE INDEX IF NOT EXISTS idx_legislaturas_fecha ON legislaturas(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_legislaturas_created ON legislaturas(created_at);

-- Triggers
CREATE TRIGGER trg_periodos_legislativos_updated_at
    BEFORE UPDATE ON periodos_legislativos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_legislaturas_updated_at
    BEFORE UPDATE ON legislaturas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
