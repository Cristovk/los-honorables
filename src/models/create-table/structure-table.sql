-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.asistencias_sala (
  id integer NOT NULL DEFAULT nextval('asistencias_sala_id_seq'::regclass),
  sesion_id character varying NOT NULL,
  diputado_id character varying NOT NULL,
  tipo_asistencia_valor character varying,
  tipo_asistencia_texto character varying,
  justificacion_valor character varying,
  justificacion_nombre character varying,
  justificacion_rebaja_asistencia character varying,
  justificacion_rebaja_quorum character varying,
  raw_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT asistencias_sala_pkey PRIMARY KEY (id),
  CONSTRAINT asistencias_sala_sesion_id_fkey FOREIGN KEY (sesion_id) REFERENCES public.sesiones_sala(id),
  CONSTRAINT asistencias_sala_diputado_id_fkey FOREIGN KEY (diputado_id) REFERENCES public.diputados(id)
);
CREATE TABLE public.diputados (
  id character varying NOT NULL,
  nombre character varying NOT NULL,
  nombre_segundo character varying,
  apellido_paterno character varying NOT NULL,
  apellido_materno character varying NOT NULL,
  fecha_nacimiento date,
  rut character varying NOT NULL,
  rut_dv character varying NOT NULL,
  sexo_valor character varying,
  sexo_texto character varying,
  raw_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT diputados_pkey PRIMARY KEY (id)
);
CREATE TABLE public.legislaturas (
  id character varying NOT NULL,
  periodo_id character varying NOT NULL,
  numero character varying NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_termino date,
  tipo_valor character varying,
  tipo_texto character varying,
  raw_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT legislaturas_pkey PRIMARY KEY (id),
  CONSTRAINT legislaturas_periodo_id_fkey FOREIGN KEY (periodo_id) REFERENCES public.periodos_legislativos(id)
);
CREATE TABLE public.militancias (
  id integer NOT NULL DEFAULT nextval('api_militancias_id_seq'::regclass),
  diputado_id character varying NOT NULL,
  partido_id character varying NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_termino date,
  raw_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT militancias_pkey PRIMARY KEY (id),
  CONSTRAINT api_militancias_partido_id_fkey FOREIGN KEY (partido_id) REFERENCES public.partidos(id)
);
CREATE TABLE public.ministerios (
  id character varying NOT NULL,
  nombre character varying NOT NULL UNIQUE,
  raw_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ministerios_pkey PRIMARY KEY (id)
);
CREATE TABLE public.partidos (
  id character varying NOT NULL,
  nombre character varying NOT NULL UNIQUE,
  alias character varying,
  raw_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT partidos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.periodos_legislativos (
  id character varying NOT NULL,
  nombre character varying NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_termino date,
  raw_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT periodos_legislativos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.porcentaje_asistencia (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  year integer NOT NULL,
  asiste double precision,
  justificado double precision,
  no_asiste double precision,
  update_at timestamp without time zone DEFAULT now(),
  total_sesiones bigint,
  CONSTRAINT porcentaje_asistencia_pkey PRIMARY KEY (id)
);
CREATE TABLE public.proyecto_autores (
  id integer NOT NULL DEFAULT nextval('api_proyecto_autores_id_seq'::regclass),
  proyecto_id character varying NOT NULL,
  orden character varying,
  diputado_id character varying,
  senador_id character varying,
  tipo_parlamentario character varying,
  raw_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT proyecto_autores_pkey PRIMARY KEY (id),
  CONSTRAINT api_proyecto_autores_proyecto_id_fkey FOREIGN KEY (proyecto_id) REFERENCES public.proyectos_ley(id)
);
CREATE TABLE public.proyecto_materias (
  id integer NOT NULL DEFAULT nextval('api_proyecto_materias_id_seq'::regclass),
  proyecto_id character varying NOT NULL,
  materia_id character varying NOT NULL,
  materia_nombre character varying NOT NULL,
  raw_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT proyecto_materias_pkey PRIMARY KEY (id),
  CONSTRAINT api_proyecto_materias_proyecto_id_fkey FOREIGN KEY (proyecto_id) REFERENCES public.proyectos_ley(id)
);
CREATE TABLE public.proyectos_acuerdo (
  id character varying NOT NULL,
  numero character varying NOT NULL,
  materia text NOT NULL,
  fecha_ingreso date NOT NULL,
  estado_valor character varying,
  estado_texto character varying,
  periodo_id character varying,
  periodo_nombre character varying,
  raw_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT proyectos_acuerdo_pkey PRIMARY KEY (id)
);
CREATE TABLE public.proyectos_ley (
  id character varying NOT NULL,
  numero_boletin character varying NOT NULL,
  nombre text NOT NULL,
  fecha_ingreso date NOT NULL,
  tipo_iniciativa_valor character varying,
  tipo_iniciativa_texto character varying,
  camara_origen_valor character varying,
  camara_origen_texto character varying,
  admisible character varying,
  raw_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT proyectos_ley_pkey PRIMARY KEY (id)
);
CREATE TABLE public.proyectos_resolucion (
  id character varying NOT NULL,
  numero character varying NOT NULL,
  materia text NOT NULL,
  fecha_ingreso date NOT NULL,
  estado_valor character varying,
  estado_texto character varying,
  raw_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT proyectos_resolucion_pkey PRIMARY KEY (id)
);
CREATE TABLE public.regiones (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre text DEFAULT 'NOT NULL'::text,
  numero_romano text DEFAULT 'NOT NULL'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT regiones_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sesiones_sala (
  id character varying NOT NULL,
  numero character varying NOT NULL,
  fecha_inicio timestamp with time zone NOT NULL,
  fecha_termino timestamp with time zone,
  tipo_valor character varying,
  tipo_texto character varying,
  estado_valor character varying,
  estado_texto character varying,
  legislatura integer,
  raw_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sesiones_sala_pkey PRIMARY KEY (id)
);
CREATE TABLE public.votaciones_proyecto_ley (
  id character varying NOT NULL,
  proyecto_id character varying NOT NULL,
  descripcion text NOT NULL,
  fecha timestamp with time zone NOT NULL,
  total_si integer DEFAULT 0,
  total_no integer DEFAULT 0,
  total_abstencion integer DEFAULT 0,
  total_dispensado integer DEFAULT 0,
  quorum_valor character varying,
  quorum_texto character varying,
  resultado_valor character varying,
  resultado_texto character varying,
  tipo_valor character varying,
  tipo_texto character varying,
  tipo_votacion_proyecto_ley_valor character varying,
  tipo_votacion_proyecto_ley_texto character varying,
  articulo character varying,
  tramite_constitucional_id character varying,
  tramite_constitucional_nombre character varying,
  tramite_reglamentario_id character varying,
  tramite_reglamentario_nombre character varying,
  raw_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT votaciones_proyecto_ley_pkey PRIMARY KEY (id),
  CONSTRAINT votaciones_proyecto_ley_proyecto_id_fkey FOREIGN KEY (proyecto_id) REFERENCES public.proyectos_ley(id)
);