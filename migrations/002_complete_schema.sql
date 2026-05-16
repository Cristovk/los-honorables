-- ============================================================
-- Migration 002: Complete schema covering all available API data
-- Cámara de Diputados (32 endpoints) + Senado (4 endpoints)
-- ============================================================

-- ============================================================
-- SECTION 1: Fix existing tables
-- ============================================================

-- Fix 1: militancias is missing FK to diputados
ALTER TABLE public.militancias
  ADD CONSTRAINT IF NOT EXISTS militancias_diputado_id_fkey
  FOREIGN KEY (diputado_id) REFERENCES public.diputados(id);

-- Fix 2: sesiones_sala.legislatura should reference legislaturas
-- The column currently stores the legislatura number (integer) not the ID (varchar).
-- We keep the integer column for the number but add a separate id column for the FK.
ALTER TABLE public.sesiones_sala
  ADD COLUMN IF NOT EXISTS legislatura_id character varying,
  ADD CONSTRAINT IF NOT EXISTS sesiones_sala_legislatura_id_fkey
  FOREIGN KEY (legislatura_id) REFERENCES public.legislaturas(id);

-- ============================================================
-- SECTION 2: Geographic catalog (provincias, comunas, distritos)
-- regiones already exists but its PK is auto-generated — we add
-- the API's "Numero" as an alternate unique key instead of replacing
-- the PK (to avoid breaking existing FK references).
-- ============================================================

ALTER TABLE public.regiones
  ADD COLUMN IF NOT EXISTS numero integer,
  ADD COLUMN IF NOT EXISTS numero_romano_api text;

CREATE UNIQUE INDEX IF NOT EXISTS regiones_numero_idx ON public.regiones(numero);

CREATE TABLE IF NOT EXISTS public.provincias (
  id         integer NOT NULL,          -- Numero from API
  nombre     text NOT NULL,
  region_id  bigint NOT NULL,
  raw_data   jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT provincias_pkey PRIMARY KEY (id),
  CONSTRAINT provincias_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regiones(id)
);

CREATE TABLE IF NOT EXISTS public.distritos (
  id         integer NOT NULL,          -- Numero from API
  raw_data   jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT distritos_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.comunas (
  id           integer NOT NULL,        -- Numero from API
  nombre       text NOT NULL,
  provincia_id integer,
  distrito_id  integer,
  raw_data     jsonb NOT NULL,
  created_at   timestamp with time zone DEFAULT now(),
  updated_at   timestamp with time zone DEFAULT now(),
  CONSTRAINT comunas_pkey PRIMARY KEY (id),
  CONSTRAINT comunas_provincia_id_fkey FOREIGN KEY (provincia_id) REFERENCES public.provincias(id),
  CONSTRAINT comunas_distrito_id_fkey  FOREIGN KEY (distrito_id)  REFERENCES public.distritos(id)
);

-- ============================================================
-- SECTION 3: votos_diputado — THE core table
-- Source: WSLegislativo/getVotacion → VotacionDetalleDto.Votos.Voto[]
-- Each row = one deputy's vote on one votation.
-- This is the primary data for "who voted what" analytics.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.votos_diputado (
  id                    bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  votacion_id           character varying NOT NULL,    -- FK → votaciones_proyecto_ley.id
  diputado_id           character varying NOT NULL,    -- FK → diputados.id
  opcion_voto_valor     character varying,             -- "1", "2", "3", "4" from OpcionVoto
  opcion_voto_texto     character varying,             -- "Sí", "No", "Abstención", "Dispensado"
  raw_data              jsonb NOT NULL,
  created_at            timestamp with time zone DEFAULT now(),
  updated_at            timestamp with time zone DEFAULT now(),
  CONSTRAINT votos_diputado_pkey PRIMARY KEY (id),
  CONSTRAINT votos_diputado_votacion_id_fkey  FOREIGN KEY (votacion_id)  REFERENCES public.votaciones_proyecto_ley(id),
  CONSTRAINT votos_diputado_diputado_id_fkey  FOREIGN KEY (diputado_id)  REFERENCES public.diputados(id),
  CONSTRAINT votos_diputado_unique UNIQUE (votacion_id, diputado_id)
);

CREATE INDEX IF NOT EXISTS votos_diputado_diputado_idx  ON public.votos_diputado(diputado_id);
CREATE INDEX IF NOT EXISTS votos_diputado_votacion_idx  ON public.votos_diputado(votacion_id);
CREATE INDEX IF NOT EXISTS votos_diputado_opcion_idx    ON public.votos_diputado(opcion_voto_valor);

-- ============================================================
-- SECTION 4: Comisiones
-- Source: WSComision/getComisionDetalle → ComisionDetalleDto
--         WSComision/getComisionesVigentes → ComisionResumenDto[]
--         WSComision/getComisionesPorPeriodo → ComisionResumenDto[]
-- ============================================================

CREATE TABLE IF NOT EXISTS public.comisiones (
  id                  character varying NOT NULL,
  nombre              text NOT NULL,
  nombre_web          text,
  alias               character varying,
  tipo_valor          character varying,
  tipo_texto          character varying,
  fecha_inicio        date,
  fecha_constitucion  date,
  fecha_termino       date,
  correo              character varying,
  telefono            character varying,
  fax                 character varying,
  numero              character varying,
  presidente_id       character varying,               -- FK → diputados.id (current president)
  raw_data            jsonb NOT NULL,
  created_at          timestamp with time zone DEFAULT now(),
  updated_at          timestamp with time zone DEFAULT now(),
  CONSTRAINT comisiones_pkey PRIMARY KEY (id),
  CONSTRAINT comisiones_presidente_id_fkey FOREIGN KEY (presidente_id) REFERENCES public.diputados(id)
);

-- Historical record of who presided each commission and when
-- Source: ComisionDetalleDto.PresidentesHistorico.DiputadoIntegrante[]
CREATE TABLE IF NOT EXISTS public.comision_presidentes (
  id           bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  comision_id  character varying NOT NULL,
  diputado_id  character varying NOT NULL,
  fecha_inicio date,
  fecha_termino date,
  raw_data     jsonb NOT NULL,
  created_at   timestamp with time zone DEFAULT now(),
  updated_at   timestamp with time zone DEFAULT now(),
  CONSTRAINT comision_presidentes_pkey PRIMARY KEY (id),
  CONSTRAINT comision_presidentes_comision_id_fkey FOREIGN KEY (comision_id) REFERENCES public.comisiones(id),
  CONSTRAINT comision_presidentes_diputado_id_fkey FOREIGN KEY (diputado_id) REFERENCES public.diputados(id)
);

-- ============================================================
-- SECTION 5: Sesiones y asistencia de comisión
-- Source: WSComision/getSesionesXComisionYAnno → SesionesXComisionYAnnoDto
--         SesionComisionDto with nested AsistenciaItemDto[]
-- ============================================================

CREATE TABLE IF NOT EXISTS public.sesiones_comision (
  id              character varying NOT NULL,
  comision_id     character varying NOT NULL,
  numero          character varying NOT NULL,
  tipo_valor      character varying,
  tipo_texto      character varying,
  fecha_inicio    timestamp with time zone NOT NULL,
  fecha_termino   timestamp with time zone,
  estado_valor    character varying,
  estado_texto    character varying,
  periodo_id      character varying,               -- FK → periodos_legislativos.id
  periodo_nombre  character varying,
  raw_data        jsonb NOT NULL,
  created_at      timestamp with time zone DEFAULT now(),
  updated_at      timestamp with time zone DEFAULT now(),
  CONSTRAINT sesiones_comision_pkey PRIMARY KEY (id),
  CONSTRAINT sesiones_comision_comision_id_fkey FOREIGN KEY (comision_id) REFERENCES public.comisiones(id),
  CONSTRAINT sesiones_comision_periodo_id_fkey  FOREIGN KEY (periodo_id)  REFERENCES public.periodos_legislativos(id)
);

CREATE INDEX IF NOT EXISTS sesiones_comision_comision_idx ON public.sesiones_comision(comision_id);

-- AsistenciaItemDto adds TipoTitularAsistencia compared to sala sessions
CREATE TABLE IF NOT EXISTS public.asistencias_comision (
  id                            bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  sesion_comision_id            character varying NOT NULL,
  diputado_id                   character varying NOT NULL,
  tipo_asistencia_valor         character varying,
  tipo_asistencia_texto         character varying,
  tipo_titular_asistencia_valor character varying,   -- "1"=Titular, "2"=Integración, etc.
  tipo_titular_asistencia_texto character varying,
  justificacion_valor           character varying,
  justificacion_nombre          character varying,
  justificacion_rebaja_asistencia character varying,
  justificacion_rebaja_quorum   character varying,
  raw_data                      jsonb NOT NULL,
  created_at                    timestamp with time zone DEFAULT now(),
  updated_at                    timestamp with time zone DEFAULT now(),
  CONSTRAINT asistencias_comision_pkey PRIMARY KEY (id),
  CONSTRAINT asistencias_comision_sesion_id_fkey   FOREIGN KEY (sesion_comision_id) REFERENCES public.sesiones_comision(id),
  CONSTRAINT asistencias_comision_diputado_id_fkey FOREIGN KEY (diputado_id)         REFERENCES public.diputados(id),
  CONSTRAINT asistencias_comision_unique UNIQUE (sesion_comision_id, diputado_id)
);

CREATE INDEX IF NOT EXISTS asistencias_comision_diputado_idx ON public.asistencias_comision(diputado_id);

-- ============================================================
-- SECTION 6: Proyectos Acuerdo — autores y respuestas
-- Source: WSProyectoAcuerdo/getProyectoAcuerdo → ProyectoAcuerdoDto
-- ============================================================

CREATE TABLE IF NOT EXISTS public.proyecto_acuerdo_autores (
  id                  bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  proyecto_acuerdo_id character varying NOT NULL,
  orden               character varying,
  diputado_id         character varying,
  senador_id          character varying,
  tipo_parlamentario  character varying,              -- "Diputado" | "Senador"
  raw_data            jsonb NOT NULL,
  created_at          timestamp with time zone DEFAULT now(),
  updated_at          timestamp with time zone DEFAULT now(),
  CONSTRAINT proyecto_acuerdo_autores_pkey PRIMARY KEY (id),
  CONSTRAINT proyecto_acuerdo_autores_proyecto_id_fkey FOREIGN KEY (proyecto_acuerdo_id) REFERENCES public.proyectos_acuerdo(id)
);

-- RespuestasRecibidas.Respuesta[] from ProyectoAcuerdoDto
CREATE TABLE IF NOT EXISTS public.proyecto_acuerdo_respuestas (
  id                  bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  proyecto_acuerdo_id character varying NOT NULL,
  numero              character varying NOT NULL,
  fecha               date NOT NULL,
  remitente           text,
  remitente_id        character varying,
  raw_data            jsonb NOT NULL,
  created_at          timestamp with time zone DEFAULT now(),
  updated_at          timestamp with time zone DEFAULT now(),
  CONSTRAINT proyecto_acuerdo_respuestas_pkey PRIMARY KEY (id),
  CONSTRAINT proyecto_acuerdo_respuestas_proyecto_id_fkey FOREIGN KEY (proyecto_acuerdo_id) REFERENCES public.proyectos_acuerdo(id)
);

-- ============================================================
-- SECTION 7: Proyectos Resolución — autores, votación, oficios, respuestas
-- Source: WSProyectoResolucion/getProyectoResolucion → ProyectoResolucionDto
-- ProyectoResolucionDto embeds a full VotacionDto with individual Votos
-- ============================================================

CREATE TABLE IF NOT EXISTS public.proyecto_resolucion_autores (
  id                      bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  proyecto_resolucion_id  character varying NOT NULL,
  orden                   character varying,
  diputado_id             character varying,
  senador_id              character varying,
  tipo_parlamentario      character varying,
  raw_data                jsonb NOT NULL,
  created_at              timestamp with time zone DEFAULT now(),
  updated_at              timestamp with time zone DEFAULT now(),
  CONSTRAINT proyecto_resolucion_autores_pkey PRIMARY KEY (id),
  CONSTRAINT proyecto_resolucion_autores_proyecto_id_fkey FOREIGN KEY (proyecto_resolucion_id) REFERENCES public.proyectos_resolucion(id)
);

-- The resolution has its own embedded votación (different from ley votations)
CREATE TABLE IF NOT EXISTS public.votaciones_resolucion (
  id                      bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  proyecto_resolucion_id  character varying NOT NULL UNIQUE,
  descripcion             text NOT NULL,
  fecha                   timestamp with time zone NOT NULL,
  total_si                integer DEFAULT 0,
  total_no                integer DEFAULT 0,
  total_abstencion        integer DEFAULT 0,
  total_dispensado        integer DEFAULT 0,
  quorum_valor            character varying,
  quorum_texto            character varying,
  resultado_valor         character varying,
  resultado_texto         character varying,
  tipo_valor              character varying,
  tipo_texto              character varying,
  raw_data                jsonb NOT NULL,
  created_at              timestamp with time zone DEFAULT now(),
  updated_at              timestamp with time zone DEFAULT now(),
  CONSTRAINT votaciones_resolucion_pkey PRIMARY KEY (id),
  CONSTRAINT votaciones_resolucion_proyecto_id_fkey FOREIGN KEY (proyecto_resolucion_id) REFERENCES public.proyectos_resolucion(id)
);

-- Individual votes for resolution votations
CREATE TABLE IF NOT EXISTS public.votos_resolucion (
  id                    bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  votacion_resolucion_id bigint NOT NULL,
  diputado_id           character varying NOT NULL,
  opcion_voto_valor     character varying,
  opcion_voto_texto     character varying,
  raw_data              jsonb NOT NULL,
  created_at            timestamp with time zone DEFAULT now(),
  updated_at            timestamp with time zone DEFAULT now(),
  CONSTRAINT votos_resolucion_pkey PRIMARY KEY (id),
  CONSTRAINT votos_resolucion_votacion_id_fkey FOREIGN KEY (votacion_resolucion_id) REFERENCES public.votaciones_resolucion(id),
  CONSTRAINT votos_resolucion_diputado_id_fkey FOREIGN KEY (diputado_id)             REFERENCES public.diputados(id),
  CONSTRAINT votos_resolucion_unique UNIQUE (votacion_resolucion_id, diputado_id)
);

-- OficiosEnviados.Oficio[] from ProyectoResolucionDto
CREATE TABLE IF NOT EXISTS public.proyecto_resolucion_oficios (
  id                     bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  proyecto_resolucion_id character varying NOT NULL,
  numero                 character varying NOT NULL,
  fecha_despacho         date,
  fecha_entrega          date,
  destinatario           text,
  destinatario_id        character varying,
  raw_data               jsonb NOT NULL,
  created_at             timestamp with time zone DEFAULT now(),
  updated_at             timestamp with time zone DEFAULT now(),
  CONSTRAINT proyecto_resolucion_oficios_pkey PRIMARY KEY (id),
  CONSTRAINT proyecto_resolucion_oficios_proyecto_id_fkey FOREIGN KEY (proyecto_resolucion_id) REFERENCES public.proyectos_resolucion(id)
);

CREATE TABLE IF NOT EXISTS public.proyecto_resolucion_respuestas (
  id                     bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  proyecto_resolucion_id character varying NOT NULL,
  numero                 character varying NOT NULL,
  fecha                  date NOT NULL,
  remitente              text,
  remitente_id           character varying,
  raw_data               jsonb NOT NULL,
  created_at             timestamp with time zone DEFAULT now(),
  updated_at             timestamp with time zone DEFAULT now(),
  CONSTRAINT proyecto_resolucion_respuestas_pkey PRIMARY KEY (id),
  CONSTRAINT proyecto_resolucion_respuestas_proyecto_id_fkey FOREIGN KEY (proyecto_resolucion_id) REFERENCES public.proyectos_resolucion(id)
);

-- ============================================================
-- SECTION 8: Senado
-- Source: tramitacion.senado.cl/wspublico/
--   senadores_vigentes.php → XML with senator data
--   invoca_votacion.html?prmBoletin → votes by boletín
--   invoca_proyecto.html?prmBoletin → project tramitación
--   invoca_tramitacion_fecha.html → projects by date range
-- The Senate XML schema is not yet parsed; raw_data stores the
-- full response until DTOs are defined for this source.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.senadores (
  id                character varying NOT NULL,       -- ID from Senate API
  nombre            character varying NOT NULL,
  nombre_segundo    character varying,
  apellido_paterno  character varying NOT NULL,
  apellido_materno  character varying NOT NULL,
  fecha_nacimiento  date,
  rut               character varying,
  rut_dv            character varying,
  sexo_valor        character varying,
  sexo_texto        character varying,
  region_id         bigint,                           -- circunscripción region
  raw_data          jsonb NOT NULL,
  created_at        timestamp with time zone DEFAULT now(),
  updated_at        timestamp with time zone DEFAULT now(),
  CONSTRAINT senadores_pkey PRIMARY KEY (id),
  CONSTRAINT senadores_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regiones(id)
);

CREATE TABLE IF NOT EXISTS public.militancias_senadores (
  id            bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  senador_id    character varying NOT NULL,
  partido_id    character varying NOT NULL,
  fecha_inicio  date NOT NULL,
  fecha_termino date,
  raw_data      jsonb NOT NULL,
  created_at    timestamp with time zone DEFAULT now(),
  updated_at    timestamp with time zone DEFAULT now(),
  CONSTRAINT militancias_senadores_pkey PRIMARY KEY (id),
  CONSTRAINT militancias_senadores_senador_id_fkey FOREIGN KEY (senador_id) REFERENCES public.senadores(id),
  CONSTRAINT militancias_senadores_partido_id_fkey FOREIGN KEY (partido_id)  REFERENCES public.partidos(id)
);

-- Tramitación de proyectos en el Senado
-- Source: invoca_proyecto.html + invoca_tramitacion_fecha.html
-- Each row represents a tramitación stage in the Senate for a proyecto_ley
CREATE TABLE IF NOT EXISTS public.tramitaciones_senado (
  id              bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  numero_boletin  character varying NOT NULL,         -- links to proyectos_ley.numero_boletin
  proyecto_id     character varying,                  -- FK → proyectos_ley.id (nullable until enriched)
  descripcion     text,
  fecha           date,
  etapa           character varying,
  sub_etapa       character varying,
  camara          character varying,                   -- "Senado" or "Cámara"
  raw_data        jsonb NOT NULL,
  created_at      timestamp with time zone DEFAULT now(),
  updated_at      timestamp with time zone DEFAULT now(),
  CONSTRAINT tramitaciones_senado_pkey PRIMARY KEY (id),
  CONSTRAINT tramitaciones_senado_proyecto_id_fkey FOREIGN KEY (proyecto_id) REFERENCES public.proyectos_ley(id)
);

CREATE INDEX IF NOT EXISTS tramitaciones_senado_boletin_idx ON public.tramitaciones_senado(numero_boletin);

-- Votaciones del Senado por boletín
-- Source: invoca_votacion.html?prmBoletin
CREATE TABLE IF NOT EXISTS public.votaciones_senado (
  id             bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  numero_boletin character varying NOT NULL,
  proyecto_id    character varying,                    -- FK → proyectos_ley.id
  descripcion    text,
  fecha          date,
  resultado      character varying,
  total_si       integer DEFAULT 0,
  total_no       integer DEFAULT 0,
  total_abstencion integer DEFAULT 0,
  raw_data       jsonb NOT NULL,
  created_at     timestamp with time zone DEFAULT now(),
  updated_at     timestamp with time zone DEFAULT now(),
  CONSTRAINT votaciones_senado_pkey PRIMARY KEY (id),
  CONSTRAINT votaciones_senado_proyecto_id_fkey FOREIGN KEY (proyecto_id) REFERENCES public.proyectos_ley(id)
);

-- Individual senator votes (populated once Senate vote DTOs are defined)
CREATE TABLE IF NOT EXISTS public.votos_senador (
  id               bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  votacion_id      bigint NOT NULL,
  senador_id       character varying NOT NULL,
  opcion_voto_valor character varying,
  opcion_voto_texto character varying,
  raw_data         jsonb NOT NULL,
  created_at       timestamp with time zone DEFAULT now(),
  updated_at       timestamp with time zone DEFAULT now(),
  CONSTRAINT votos_senador_pkey PRIMARY KEY (id),
  CONSTRAINT votos_senador_votacion_id_fkey FOREIGN KEY (votacion_id)  REFERENCES public.votaciones_senado(id),
  CONSTRAINT votos_senador_senador_id_fkey  FOREIGN KEY (senador_id)   REFERENCES public.senadores(id),
  CONSTRAINT votos_senador_unique UNIQUE (votacion_id, senador_id)
);

-- ============================================================
-- SECTION 9: RLS policies for new tables (public read, admin write)
-- ============================================================

ALTER TABLE public.votos_diputado         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comisiones             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comision_presidentes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sesiones_comision      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asistencias_comision   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provincias             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distritos              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunas                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.senadores              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.militancias_senadores  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tramitaciones_senado   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votaciones_senado      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votos_senador          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votaciones_resolucion  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votos_resolucion       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyecto_acuerdo_autores     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyecto_acuerdo_respuestas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyecto_resolucion_autores  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyecto_resolucion_oficios  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyecto_resolucion_respuestas ENABLE ROW LEVEL SECURITY;

-- Public read policy for all new tables
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'votos_diputado','comisiones','comision_presidentes',
    'sesiones_comision','asistencias_comision',
    'provincias','distritos','comunas',
    'senadores','militancias_senadores',
    'tramitaciones_senado','votaciones_senado','votos_senador',
    'votaciones_resolucion','votos_resolucion',
    'proyecto_acuerdo_autores','proyecto_acuerdo_respuestas',
    'proyecto_resolucion_autores','proyecto_resolucion_oficios',
    'proyecto_resolucion_respuestas'
  ]) LOOP
    EXECUTE format(
      'CREATE POLICY IF NOT EXISTS "public_read_%s" ON public.%I FOR SELECT USING (true)',
      t, t
    );
  END LOOP;
END$$;
