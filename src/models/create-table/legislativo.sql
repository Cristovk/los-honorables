-- ============================================
-- MÓDULO: LEGISLATIVO (Proyectos de Ley)
-- Basado en: src/interface/external/camara-diputados/legislativo/
-- DTOs Principales: ProyectoLeyDto, MateriaDto, ParlamentarioAutorDto
-- ============================================

-- Tabla: api_proyectos_ley
-- Mapea: ProyectoLeyDto
CREATE TABLE IF NOT EXISTS api_proyectos_ley (
    id VARCHAR(50) PRIMARY KEY,
    numero_boletin VARCHAR(50) NOT NULL,
    nombre TEXT NOT NULL,
    fecha_ingreso DATE NOT NULL,
    tipo_iniciativa_valor VARCHAR(50),
    tipo_iniciativa_texto VARCHAR(200),
    camara_origen_valor VARCHAR(50),
    camara_origen_texto VARCHAR(200),
    admisible VARCHAR(10),
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: api_proyecto_materias
-- Mapea: MateriaDto (relación N:M entre proyectos y materias)
CREATE TABLE IF NOT EXISTS api_proyecto_materias (
    id SERIAL PRIMARY KEY,
    proyecto_id VARCHAR(50) NOT NULL REFERENCES api_proyectos_ley(id) ON DELETE CASCADE,
    materia_id VARCHAR(50) NOT NULL,
    materia_nombre VARCHAR(300) NOT NULL,
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uk_proyecto_materia UNIQUE (proyecto_id, materia_id)
);

-- Tabla: api_proyecto_autores
-- Mapea: ParlamentarioAutorDto
CREATE TABLE IF NOT EXISTS api_proyecto_autores (
    id SERIAL PRIMARY KEY,
    proyecto_id VARCHAR(50) NOT NULL REFERENCES api_proyectos_ley(id) ON DELETE CASCADE,
    orden VARCHAR(10),
    diputado_id VARCHAR(50) REFERENCES api_diputados(id),
    senador_id VARCHAR(50),
    tipo_parlamentario VARCHAR(20), -- 'diputado' o 'senador'
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_proyectos_ley_boletin ON api_proyectos_ley(numero_boletin);
CREATE INDEX IF NOT EXISTS idx_proyectos_ley_fecha ON api_proyectos_ley(fecha_ingreso);
CREATE INDEX IF NOT EXISTS idx_proyectos_ley_iniciativa ON api_proyectos_ley(tipo_iniciativa_valor);
CREATE INDEX IF NOT EXISTS idx_proyectos_ley_created ON api_proyectos_ley(created_at);

CREATE INDEX IF NOT EXISTS idx_proyecto_materias_proyecto ON api_proyecto_materias(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_proyecto_materias_materia ON api_proyecto_materias(materia_id);

CREATE INDEX IF NOT EXISTS idx_proyecto_autores_proyecto ON api_proyecto_autores(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_proyecto_autores_diputado ON api_proyecto_autores(diputado_id);
CREATE INDEX IF NOT EXISTS idx_proyecto_autores_tipo ON api_proyecto_autores(tipo_parlamentario);

-- Triggers
CREATE TRIGGER trg_api_proyectos_ley_updated_at
    BEFORE UPDATE ON api_proyectos_ley
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_api_proyecto_materias_updated_at
    BEFORE UPDATE ON api_proyecto_materias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_api_proyecto_autores_updated_at
    BEFORE UPDATE ON api_proyecto_autores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
