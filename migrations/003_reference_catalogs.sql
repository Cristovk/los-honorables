-- ============================================================
-- Migration 003: Reference catalog tables
-- ============================================================
-- Two distinct data shapes from the API:
--   A) comun_tipos_* endpoints → flat {code: name} map → catalogos table
--   B) legislativo reference endpoints → [{Id, Nombre}] arrays → separate tables

-- ============================================================
-- A) Generic catalog table for all comun_tipos_* endpoints
-- Stores 18 catalogs (~100 rows total): tipos_asistencia,
-- tipos_opcion_voto, tipos_quorum_votacion, etc.
-- PK is (categoria, codigo) — no FK references needed since
-- these values are stored inline (valor + texto) in other tables.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.catalogos (
  categoria   text NOT NULL,   -- e.g. 'tipos_asistencia', 'tipos_opcion_voto'
  codigo      text NOT NULL,   -- e.g. '0', '1', '2'
  nombre      text NOT NULL,   -- e.g. 'No Asiste', 'Asiste', 'Justificado'
  created_at  timestamp with time zone DEFAULT now(),
  updated_at  timestamp with time zone DEFAULT now(),
  CONSTRAINT catalogos_pkey PRIMARY KEY (categoria, codigo)
);

CREATE INDEX IF NOT EXISTS catalogos_categoria_idx ON public.catalogos(categoria);

-- ============================================================
-- B) Reference tables for legislativo catalogs
-- These have real IDs referenced from other tables as FKs:
--   proyecto_materias.materia_id → materias.id
--   votaciones_proyecto_ley.tramite_constitucional_id → tramites_constitucionales.id
--   votaciones_proyecto_ley.tramite_reglamentario_id  → tramites_reglamentarios.id
-- ============================================================

CREATE TABLE IF NOT EXISTS public.materias (
  id          text NOT NULL,
  nombre      text,
  raw_data    jsonb NOT NULL,
  created_at  timestamp with time zone DEFAULT now(),
  updated_at  timestamp with time zone DEFAULT now(),
  CONSTRAINT materias_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tramites_constitucionales (
  id          text NOT NULL,
  nombre      text,             -- comes from field '_' in TramiteConstitucionalDto
  raw_data    jsonb NOT NULL,
  created_at  timestamp with time zone DEFAULT now(),
  updated_at  timestamp with time zone DEFAULT now(),
  CONSTRAINT tramites_constitucionales_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tramites_reglamentarios (
  id          text NOT NULL,
  nombre      text,             -- comes from field '_' in TramiteReglamentarioDto
  raw_data    jsonb NOT NULL,
  created_at  timestamp with time zone DEFAULT now(),
  updated_at  timestamp with time zone DEFAULT now(),
  CONSTRAINT tramites_reglamentarios_pkey PRIMARY KEY (id)
);

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE public.catalogos                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materias                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tramites_constitucionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tramites_reglamentarios  ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "public_read_catalogos"
  ON public.catalogos FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "public_read_materias"
  ON public.materias FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "public_read_tramites_constitucionales"
  ON public.tramites_constitucionales FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "public_read_tramites_reglamentarios"
  ON public.tramites_reglamentarios FOR SELECT USING (true);
