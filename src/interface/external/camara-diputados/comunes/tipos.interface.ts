/**
 * Interfaz base para tipos comunes con identificador y nombre
 */
export interface TipoBase {
  /** Identificador único del tipo */
  Id: string;
  /** Nombre descriptivo del tipo */
  Nombre: string;
}

/**
 * Interfaz para tipos de cámara de origen
 */
export interface TipoCamaraOrigen extends TipoBase {}

/**
 * Interfaz para tipos de asistencia
 */
export interface TipoAsistencia extends TipoBase {}

/**
 * Interfaz para tipos de estado de sesión de comisión
 */
export interface TipoEstadoSesionComision extends TipoBase {}

/**
 * Interfaz para tipos de estado de sesión de sala
 */
export interface TipoEstadoSesionSala extends TipoBase {}

/**
 * Interfaz para tipos de titular de asistencia
 */
export interface TipoTitularAsistencia extends TipoBase {}

/**
 * Interfaz para tipos de estado general
 */
export interface TipoEstado extends TipoBase {}

/**
 * Interfaz para tipos de estado de acuerdos y resoluciones
 */
export interface TipoEstadoAcuerdosResoluciones extends TipoBase {}

/**
 * Interfaz para tipos de iniciativa de proyecto de ley
 */
export interface TipoIniciativaProyectoLey extends TipoBase {}

/**
 * Estructura de colección para tipos comunes
 */
export interface TiposColeccion<T extends TipoBase> {
  xmlns: string;
  xmlns_xsi: string;
  xmlns_xsd: string;
  [key: string]: T[] | string;
}

/**
 * Respuesta genérica para endpoints de tipos
 */
export interface TiposResponse<T extends TipoBase> {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    [key: string]: TiposColeccion<T>;
  };
}