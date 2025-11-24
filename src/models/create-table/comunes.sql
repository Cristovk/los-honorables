-- ============================================
-- MÓDULO: COMUNES (Catálogos y Datos Comunes)
-- Basado en: src/interface/external/camara-diputados/comunes/
-- DTO Principal: Ministerio (ministerios.interface.ts)
-- ============================================

-- Tabla: api_ministerios
-- Mapea: Ministerio
CREATE TABLE IF NOT EXISTS api_ministerios (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(300) NOT NULL,
    
    -- Metadatos
    raw_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT uk_ministerio_nombre UNIQUE (nombre)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_ministerios_nombre ON api_ministerios(nombre);
CREATE INDEX IF NOT EXISTS idx_ministerios_created ON api_ministerios(created_at);

-- Trigger
CREATE TRIGGER trg_api_ministerios_updated_at
    BEFORE UPDATE ON api_ministerios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- NOTA: Las interfaces de tipos (tipos-*.interface.ts) en la carpeta comunes
-- contienen catálogos estáticos que se pueden manejar como ENUMS o tablas
-- pequeñas según necesidad. Por ejemplo:
--
-- - tipos-asistencia.interface.ts
-- - tipos-estado.interface.ts
-- - tipos-camara-origen.interface.ts
-- - tipos-iniciativa-proyecto-ley.interface.ts
-- - etc.
--
-- Estos se pueden implementar como tablas pequeñas si se necesitan consultar
-- dinámicamente, o como constraints/enums si son estáticos.
-- ============================================
