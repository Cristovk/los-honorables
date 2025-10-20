/**
 * Interfaz para request de detalle de votación
 * @see curl -X GET "http://localhost:6000/votaciones/detalleVotacion" -d '{"id": "12345"}'
 */
export interface DetalleVotacionRequest {
  /** ID único de la votación */
  id: string;
}

/**
 * Interfaz para request de votaciones por año
 * @see curl -X GET "http://localhost:6000/votaciones/votacionesXAnno" -d '{"year": "2024"}'
 */
export interface VotacionesXAnnoRequest {
  /** Año de las votaciones a consultar */
  year: string;
}

/**
 * Interfaz para request de votaciones por proyecto de ley
 * @see curl -X GET "http://localhost:6000/votaciones/votacionesXProyectoLey" -d '{"id": "1234567"}'
 */
export interface VotacionesXProyectoLeyRequest {
  /** ID del proyecto de ley */
  id: string;
}

/**
 * Interfaz para request de sesiones de comisión por año
 * @see curl -X GET "http://localhost:6000/comisiones/sesionesXComisionYAnno" -d '{"comisionId": 1, "anno": 2024}'
 */
export interface SesionesXComisionYAnnoRequest {
  /** ID de la comisión */
  comisionId: number;
  /** Año de las sesiones */
  anno: number;
}

/**
 * Interfaz para request de detalle de comisión
 * @see curl -X GET "http://localhost:6000/comisiones/detalle" -d '{"comisionId": 1}'
 */
export interface DetalleComisionRequest {
  /** ID de la comisión */
  comisionId: number;
}

/**
 * Interfaz para request de comisiones por período
 * @see curl -X GET "http://localhost:6000/comisiones/porPeriodo" -d '{"periodoId": 1}'
 */
export interface ComisionesPorPeriodoRequest {
  /** ID del período legislativo */
  periodoId: number;
}

/**\n * Interfaz para request de detalle de diputado
 * @see curl -X GET "http://localhost:6000/diputados/detalle" -d '{"diputadoId": 123}'
 */
export interface DetalleDiputadoRequest {
  /** ID del diputado */
  diputadoId: number;
}

/**
 * Interfaz para request de diputados por período
 * @see curl -X GET "http://localhost:6000/diputados/porPeriodo" -d '{"periodoId": 1}'
 */
export interface DiputadosPorPeriodoRequest {
  /** ID del período legislativo */
  periodoId: number;
}

/**
 * Interfaz para request de detalle de proyecto de acuerdo
 * @see curl -X GET "http://localhost:6000/proyectosAcuerdo/detalle" -d '{"idProyectoAcuerdo": 12345}'
 */
export interface DetalleProyectoAcuerdoRequest {
  /** ID del proyecto de acuerdo */
  idProyectoAcuerdo: number;
}

/**
 * Interfaz para request de proyectos de acuerdo por año
 * @see curl -X GET "http://localhost:6000/proyectosAcuerdo/porAnno" -d '{"anno": 2024}'
 */
export interface ProyectosAcuerdoPorAnnoRequest {
  /** Año de los proyectos de acuerdo */
  anno: number;
}

/**
 * Interfaz para request de detalle de proyecto de resolución
 * @see curl -X GET "http://localhost:6000/proyectosResolucion/detalle" -d '{"idProyectoResolucion": 67890}'
 */
export interface DetalleProyectoResolucionRequest {
  /** ID del proyecto de resolución */
  idProyectoResolucion: number;
}

/**
 * Interfaz para request de proyectos de resolución por año
 * @see curl -X GET "http://localhost:6000/proyectosResolucion/porAnno" -d '{"anno": 2024}'
 */
export interface ProyectosResolucionPorAnnoRequest {
  /** Año de los proyectos de resolución */
  anno: number;
}

/**
 * Interfaz para request de mociones por año
 * @see curl -X GET "http://localhost:6000/legislativos/mocionesXAnno" -d '{"year": "2024"}'
 */
export interface MocionesXAnnoRequest {
  /** Año de las mociones */
  year: string;
}

/**
 * Interfaz para request de mensajes por año
 * @see curl -X GET "http://localhost:6000/legislativos/mensajesXAnno" -d '{"year": "2024"}'
 */
export interface MensajesXAnnoRequest {
  /** Año de los mensajes */
  year: string;
}

/**
 * Interfaz para request de proyecto de ley por boletín
 * @see curl -X GET "http://localhost:6000/legislativos/proyectoLey" -d '{"numeroBoletin": 1234567}'
 */
export interface ProyectoLeyRequest {
  /** Número de boletín del proyecto de ley */
  numeroBoletin: number;
}

/**
 * Interfaz para request de votaciones por boletín
 * @see curl -X GET "http://localhost:6000/projects/boletin" -d '{"boletin": "1234567"}'
 */
export interface VotacionesBoletinRequest {
  /** Número de boletín */
  boletin: string;
}

/**
 * Interfaz para request de asistencia a sesión
 * @see curl -X GET "http://localhost:6000/servicioSala/sesionAsistencia" -d '{"id": "123456"}'
 */
export interface SesionAsistenciaRequest {
  /** ID de la sesión */
  id: string;
}

/**
 * Interfaz para request de sesiones por año
 * @see curl -X GET "http://localhost:6000/servicioSala/sesionesXAnno" -d '{"year": "2024"}'
 */
export interface SesionesXAnnoRequest {
  /** Año de las sesiones */
  year: string;
}

/**
 * Interfaz para request de sesiones por legislatura
 * @see curl -X GET "http://localhost:6000/servicioSala/sesionesXLegislatura" -d '{"id": "1"}'
 */
export interface SesionesXLegislaturaRequest {
  /** ID de la legislatura */
  id: string;
}