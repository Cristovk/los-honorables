-- ============================================
-- MÓDULO: DIPUTADOS
-- Basado en: src/interface/external/camara-diputados/diputados/diputados.dto.ts
-- DTO Principal: DiputadoBaseDto
-- ============================================

-- Tabla principal: diputados
-- Mapea: DiputadoBaseDto
CREATE TABLE IF NOT EXISTS diputados (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nombre2 VARCHAR(100),
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    rut VARCHAR(20) NOT NULL,
    rut_dv VARCHAR(2) NOT NULL,
    sexo_valor VARCHAR(10),
    sexo_texto VARCHAR(50),
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uk_diputado_rut UNIQUE (rut, rut_dv)
);

-- Tabla: partidos
-- Mapea: PartidoDto
CREATE TABLE IF NOT EXISTS partidos (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    alias VARCHAR(100),
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uk_partido_nombre UNIQUE (nombre)
);

-- Tabla: militancias
-- Mapea: MilitanciaDto
CREATE TABLE IF NOT EXISTS militancias (
    id SERIAL PRIMARY KEY,
    diputado_id VARCHAR(50) NOT NULL REFERENCES diputados(id) ON DELETE CASCADE,
    partido_id VARCHAR(50) NOT NULL REFERENCES partidos(id) ON DELETE CASCADE,
    fecha_inicio DATE NOT NULL,
    fecha_termino DATE,
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),   
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uk_militancia UNIQUE (diputado_id, partido_id, fecha_inicio)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_diputados_rut ON diputados(rut);
CREATE INDEX IF NOT EXISTS idx_diputados_sexo ON diputados(sexo_valor);
CREATE INDEX IF NOT EXISTS idx_diputados_created ON diputados(created_at);

CREATE INDEX IF NOT EXISTS idx_militancias_diputado ON militancias(diputado_id);
CREATE INDEX IF NOT EXISTS idx_militancias_partido ON militancias(partido_id);
CREATE INDEX IF NOT EXISTS idx_militancias_fechas ON militancias(fecha_inicio, fecha_termino);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_diputados_updated_at
    BEFORE UPDATE ON diputados
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_partidos_updated_at
    BEFORE UPDATE ON partidos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_militancias_updated_at
    BEFORE UPDATE ON militancias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
