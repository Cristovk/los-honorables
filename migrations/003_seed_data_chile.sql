-- ============================================================================
-- Migration 003: Seed Data - División Territorial y Electoral de Chile
-- ============================================================================
-- Proyecto: Los Honorables
-- Descripción: Datos de referencia completos de regiones, provincias, 
--              comunas y distritos electorales de Chile
-- Autor: Winnie Cofre
-- Fecha: 2025-01-20
-- ============================================================================

-- Esta migración se ejecuta DESPUÉS de 002_optimized_schema.sql
-- Verifica que las tablas existan primero

-- ============================================================================
-- NOTA: Los datos de división territorial están simplificados
-- Para datos completos y actualizados, consulta:
-- - https://www.subdere.gov.cl/
-- - https://www.servel.cl/
-- ============================================================================

-- ============================================================================
-- SEED: PROVINCIAS (Provincias de Chile por región)
-- ============================================================================
-- Nota: Los IDs de región se obtienen automáticamente de la tabla regiones

-- Región XV - Arica y Parinacota
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'XV'), 'ARICA', 'Arica'),
((SELECT id FROM regiones WHERE codigo = 'XV'), 'PARINACOTA', 'Parinacota')
ON CONFLICT (codigo) DO NOTHING;

-- Región I - Tarapacá
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'I'), 'IQUIQUE', 'Iquique'),
((SELECT id FROM regiones WHERE codigo = 'I'), 'TAMARUGAL', 'Del Tamarugal')
ON CONFLICT (codigo) DO NOTHING;

-- Región II - Antofagasta
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'II'), 'ANTOFAGASTA', 'Antofagasta'),
((SELECT id FROM regiones WHERE codigo = 'II'), 'EL_LOA', 'El Loa'),
((SELECT id FROM regiones WHERE codigo = 'II'), 'TOCOPILLA', 'Tocopilla')
ON CONFLICT (codigo) DO NOTHING;

-- Región III - Atacama
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'III'), 'COPIAPO', 'Copiapó'),
((SELECT id FROM regiones WHERE codigo = 'III'), 'CHAÑARAL', 'Chañaral'),
((SELECT id FROM regiones WHERE codigo = 'III'), 'HUASCO', 'Huasco')
ON CONFLICT (codigo) DO NOTHING;

-- Región IV - Coquimbo
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'IV'), 'ELQUI', 'Elqui'),
((SELECT id FROM regiones WHERE codigo = 'IV'), 'CHOAPA', 'Choapa'),
((SELECT id FROM regiones WHERE codigo = 'IV'), 'LIMARI', 'Limarí')
ON CONFLICT (codigo) DO NOTHING;

-- Región V - Valparaíso
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'V'), 'VALPARAISO', 'Valparaíso'),
((SELECT id FROM regiones WHERE codigo = 'V'), 'ISLA_PASCUA', 'Isla de Pascua'),
((SELECT id FROM regiones WHERE codigo = 'V'), 'LOS_ANDES', 'Los Andes'),
((SELECT id FROM regiones WHERE codigo = 'V'), 'PETORCA', 'Petorca'),
((SELECT id FROM regiones WHERE codigo = 'V'), 'QUILLOTA', 'Quillota'),
((SELECT id FROM regiones WHERE codigo = 'V'), 'SAN_ANTONIO', 'San Antonio'),
((SELECT id FROM regiones WHERE codigo = 'V'), 'SAN_FELIPE', 'San Felipe de Aconcagua'),
((SELECT id FROM regiones WHERE codigo = 'V'), 'MARGA_MARGA', 'Marga Marga')
ON CONFLICT (codigo) DO NOTHING;

-- Región RM - Metropolitana
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'RM'), 'SANTIAGO', 'Santiago'),
((SELECT id FROM regiones WHERE codigo = 'RM'), 'CORDILLERA', 'Cordillera'),
((SELECT id FROM regiones WHERE codigo = 'RM'), 'CHACABUCO', 'Chacabuco'),
((SELECT id FROM regiones WHERE codigo = 'RM'), 'MAIPO', 'Maipo'),
((SELECT id FROM regiones WHERE codigo = 'RM'), 'MELIPILLA', 'Melipilla'),
((SELECT id FROM regiones WHERE codigo = 'RM'), 'TALAGANTE', 'Talagante')
ON CONFLICT (codigo) DO NOTHING;

-- Región VI - O'Higgins
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'VI'), 'CACHAPOAL', 'Cachapoal'),
((SELECT id FROM regiones WHERE codigo = 'VI'), 'CARDENAL_CARO', 'Cardenal Caro'),
((SELECT id FROM regiones WHERE codigo = 'VI'), 'COLCHAGUA', 'Colchagua')
ON CONFLICT (codigo) DO NOTHING;

-- Región VII - Maule
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'VII'), 'TALCA', 'Talca'),
((SELECT id FROM regiones WHERE codigo = 'VII'), 'CAUQUENES', 'Cauquenes'),
((SELECT id FROM regiones WHERE codigo = 'VII'), 'CURICO', 'Curicó'),
((SELECT id FROM regiones WHERE codigo = 'VII'), 'LINARES', 'Linares')
ON CONFLICT (codigo) DO NOTHING;

-- Región XVI - Ñuble
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'XVI'), 'DIGUILLÍN', 'Diguillín'),
((SELECT id FROM regiones WHERE codigo = 'XVI'), 'ITATA', 'Itata'),
((SELECT id FROM regiones WHERE codigo = 'XVI'), 'PUNILLA', 'Punilla')
ON CONFLICT (codigo) DO NOTHING;

-- Región VIII - Biobío
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'VIII'), 'CONCEPCION', 'Concepción'),
((SELECT id FROM regiones WHERE codigo = 'VIII'), 'ARAUCO', 'Arauco'),
((SELECT id FROM regiones WHERE codigo = 'VIII'), 'BIOBIO', 'Biobío')
ON CONFLICT (codigo) DO NOTHING;

-- Región IX - Araucanía
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'IX'), 'CAUTIN', 'Cautín'),
((SELECT id FROM regiones WHERE codigo = 'IX'), 'MALLECO', 'Malleco')
ON CONFLICT (codigo) DO NOTHING;

-- Región XIV - Los Ríos
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'XIV'), 'VALDIVIA', 'Valdivia'),
((SELECT id FROM regiones WHERE codigo = 'XIV'), 'RANCO', 'Ranco')
ON CONFLICT (codigo) DO NOTHING;

-- Región X - Los Lagos
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'X'), 'LLANQUIHUE', 'Llanquihue'),
((SELECT id FROM regiones WHERE codigo = 'X'), 'CHILOE', 'Chiloé'),
((SELECT id FROM regiones WHERE codigo = 'X'), 'OSORNO', 'Osorno'),
((SELECT id FROM regiones WHERE codigo = 'X'), 'PALENA', 'Palena')
ON CONFLICT (codigo) DO NOTHING;

-- Región XI - Aysén
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'XI'), 'COIHAIQUE', 'Coihaique'),
((SELECT id FROM regiones WHERE codigo = 'XI'), 'AYSEN', 'Aysén'),
((SELECT id FROM regiones WHERE codigo = 'XI'), 'CAPITAN_PRAT', 'Capitán Prat'),
((SELECT id FROM regiones WHERE codigo = 'XI'), 'GRAL_CARRERA', 'General Carrera')
ON CONFLICT (codigo) DO NOTHING;

-- Región XII - Magallanes
INSERT INTO provincias (region_id, codigo, nombre) VALUES
((SELECT id FROM regiones WHERE codigo = 'XII'), 'MAGALLANES', 'Magallanes'),
((SELECT id FROM regiones WHERE codigo = 'XII'), 'ANTARTICA', 'Antártica Chilena'),
((SELECT id FROM regiones WHERE codigo = 'XII'), 'TIERRA_FUEGO', 'Tierra del Fuego'),
((SELECT id FROM regiones WHERE codigo = 'XII'), 'ULTIMA_ESPERANZA', 'Última Esperanza')
ON CONFLICT (codigo) DO NOTHING;

-- ============================================================================
-- SEED: COMUNAS (Ejemplo - Solo principales)
-- ============================================================================
-- NOTA: Chile tiene 346 comunas. Aquí se incluyen solo algunas de ejemplo.
-- Para una lista completa, importa desde una fuente oficial.

-- Comunas de ejemplo por región
INSERT INTO comunas (provincia_id, codigo, nombre) VALUES
-- Región RM - Santiago
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'SANTIAGO', 'Santiago'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'PROVIDENCIA', 'Providencia'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'LAS_CONDES', 'Las Condes'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'VITACURA', 'Vitacura'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'LO_BARNECHEA', 'Lo Barnechea'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'ÑUÑOA', 'Ñuñoa'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'LA_REINA', 'La Reina'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'PEÑALOLEN', 'Peñalolén'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'MACUL', 'Macul'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'LA_FLORIDA', 'La Florida'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'SAN_JOAQUIN', 'San Joaquín'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'LA_GRANJA', 'La Granja'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'PUENTE_ALTO', 'Puente Alto'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'SAN_MIGUEL', 'San Miguel'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'LA_CISTERNA', 'La Cisterna'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'EL_BOSQUE', 'El Bosque'),
((SELECT id FROM provincias WHERE codigo = 'SANTIAGO'), 'SAN_RAMON', 'San Ramón'),

-- Región V - Valparaíso
((SELECT id FROM provincias WHERE codigo = 'VALPARAISO'), 'VALPARAISO', 'Valparaíso'),
((SELECT id FROM provincias WHERE codigo = 'VALPARAISO'), 'VIÑA_DEL_MAR', 'Viña del Mar'),
((SELECT id FROM provincias WHERE codigo = 'VALPARAISO'), 'QUILPUE', 'Quilpué'),
((SELECT id FROM provincias WHERE codigo = 'VALPARAISO'), 'VILLA_ALEMANA', 'Villa Alemana'),
((SELECT id FROM provincias WHERE codigo = 'VALPARAISO'), 'CONCON', 'Concón'),

-- Región VIII - Concepción
((SELECT id FROM provincias WHERE codigo = 'CONCEPCION'), 'CONCEPCION', 'Concepción'),
((SELECT id FROM provincias WHERE codigo = 'CONCEPCION'), 'TALCAHUANO', 'Talcahuano'),
((SELECT id FROM provincias WHERE codigo = 'CONCEPCION'), 'HUALPEN', 'Hualpén'),
((SELECT id FROM provincias WHERE codigo = 'CONCEPCION'), 'CHIGUAYANTE', 'Chiguayante'),
((SELECT id FROM provincias WHERE codigo = 'CONCEPCION'), 'SAN_PEDRO', 'San Pedro de la Paz')

ON CONFLICT (codigo) DO NOTHING;

-- ============================================================================
-- SEED: DISTRITOS ELECTORALES
-- ============================================================================
-- Distritos electorales actuales de Chile (28 distritos)
-- Nota: La configuración actual es del año 2017 en adelante

INSERT INTO distritos_electorales (numero, region_id, circunscripcion, nombre) VALUES
-- Región XV - Arica y Parinacota
(1, (SELECT id FROM regiones WHERE codigo = 'XV'), 1, 'Distrito 1 - Arica'),

-- Región I - Tarapacá
(2, (SELECT id FROM regiones WHERE codigo = 'I'), 2, 'Distrito 2 - Iquique'),

-- Región II - Antofagasta
(3, (SELECT id FROM regiones WHERE codigo = 'II'), 3, 'Distrito 3 - Antofagasta Costa'),
(4, (SELECT id FROM regiones WHERE codigo = 'II'), 3, 'Distrito 4 - Antofagasta Interior'),

-- Región III - Atacama
(5, (SELECT id FROM regiones WHERE codigo = 'III'), 4, 'Distrito 5 - Copiapó'),

-- Región IV - Coquimbo
(6, (SELECT id FROM regiones WHERE codigo = 'IV'), 5, 'Distrito 6 - Coquimbo Interior'),
(7, (SELECT id FROM regiones WHERE codigo = 'IV'), 5, 'Distrito 7 - Coquimbo Costa'),

-- Región V - Valparaíso
(8, (SELECT id FROM regiones WHERE codigo = 'V'), 6, 'Distrito 8 - Valparaíso Costa'),
(9, (SELECT id FROM regiones WHERE codigo = 'V'), 6, 'Distrito 9 - Valparaíso Cordillera'),

-- Región RM - Metropolitana
(10, (SELECT id FROM regiones WHERE codigo = 'RM'), 7, 'Distrito 10 - Santiago Norte'),
(11, (SELECT id FROM regiones WHERE codigo = 'RM'), 7, 'Distrito 11 - Santiago Centro'),
(12, (SELECT id FROM regiones WHERE codigo = 'RM'), 7, 'Distrito 12 - Santiago Oriente'),
(13, (SELECT id FROM regiones WHERE codigo = 'RM'), 7, 'Distrito 13 - Santiago Sur'),
(14, (SELECT id FROM regiones WHERE codigo = 'RM'), 7, 'Distrito 14 - Santiago Poniente'),
(15, (SELECT id FROM regiones WHERE codigo = 'RM'), 7, 'Distrito 15 - Puente Alto'),

-- Región VI - O'Higgins
(16, (SELECT id FROM regiones WHERE codigo = 'VI'), 8, 'Distrito 16 - Rancagua'),

-- Región VII - Maule
(17, (SELECT id FROM regiones WHERE codigo = 'VII'), 9, 'Distrito 17 - Talca'),
(18, (SELECT id FROM regiones WHERE codigo = 'VII'), 9, 'Distrito 18 - Linares'),

-- Región XVI - Ñuble
(19, (SELECT id FROM regiones WHERE codigo = 'XVI'), 10, 'Distrito 19 - Chillán'),

-- Región VIII - Biobío
(20, (SELECT id FROM regiones WHERE codigo = 'VIII'), 11, 'Distrito 20 - Concepción'),
(21, (SELECT id FROM regiones WHERE codigo = 'VIII'), 11, 'Distrito 21 - Biobío Costa'),
(22, (SELECT id FROM regiones WHERE codigo = 'VIII'), 11, 'Distrito 22 - Arauco'),

-- Región IX - Araucanía
(23, (SELECT id FROM regiones WHERE codigo = 'IX'), 12, 'Distrito 23 - Temuco'),
(24, (SELECT id FROM regiones WHERE codigo = 'IX'), 12, 'Distrito 24 - Malleco'),

-- Región XIV - Los Ríos
(25, (SELECT id FROM regiones WHERE codigo = 'XIV'), 13, 'Distrito 25 - Valdivia'),

-- Región X - Los Lagos
(26, (SELECT id FROM regiones WHERE codigo = 'X'), 14, 'Distrito 26 - Puerto Montt'),
(27, (SELECT id FROM regiones WHERE codigo = 'X'), 14, 'Distrito 27 - Chiloé'),

-- Región XI - Aysén y XII - Magallanes
(28, (SELECT id FROM regiones WHERE codigo = 'XI'), 15, 'Distrito 28 - Aysén y Magallanes')

ON CONFLICT (numero, region_id) DO NOTHING;

-- ============================================================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ============================================================================

-- Ver resumen de datos insertados
DO $$
DECLARE
    total_regiones INTEGER;
    total_provincias INTEGER;
    total_comunas INTEGER;
    total_distritos INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_regiones FROM regiones;
    SELECT COUNT(*) INTO total_provincias FROM provincias;
    SELECT COUNT(*) INTO total_comunas FROM comunas;
    SELECT COUNT(*) INTO total_distritos FROM distritos_electorales;
    
    RAISE NOTICE '';
    RAISE NOTICE '============================================================';
    RAISE NOTICE '   RESUMEN DE DATOS INSERTADOS';
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'Regiones:   % registros', total_regiones;
    RAISE NOTICE 'Provincias: % registros', total_provincias;
    RAISE NOTICE 'Comunas:    % registros (parcial - solo ejemplos)', total_comunas;
    RAISE NOTICE 'Distritos:  % registros', total_distritos;
    RAISE NOTICE '============================================================';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  NOTA: Las comunas están parcialmente cargadas (solo ejemplos).';
    RAISE NOTICE '   Para datos completos, ejecutar script de importación completo.';
    RAISE NOTICE '';
END $$;

-- ============================================================================
-- QUERIES ÚTILES PARA VERIFICAR LOS DATOS
-- ============================================================================

-- Ver regiones con sus provincias
-- SELECT r.nombre as region, p.nombre as provincia
-- FROM regiones r
-- LEFT JOIN provincias p ON r.id = p.region_id
-- ORDER BY r.id, p.nombre;

-- Ver provincias con sus comunas
-- SELECT p.nombre as provincia, c.nombre as comuna
-- FROM provincias p
-- LEFT JOIN comunas c ON p.id = c.provincia_id
-- ORDER BY p.nombre, c.nombre;

-- Ver distritos por región
-- SELECT r.nombre as region, d.numero, d.nombre as distrito
-- FROM distritos_electorales d
-- JOIN regiones r ON d.region_id = r.id
-- ORDER BY d.numero;

-- ============================================================================
-- FIN DE MIGRATION 003
-- ============================================================================
