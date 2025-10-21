// Exportaciones principales
export * from './comunas.interface';
export * from './regiones.interface';
export * from './ministerios.interface';
export * from './distritos.interface';
export { Provincia, ProvinciasColeccion, ProvinciasResponse } from './provincias.interface';
export * from './tipos.interface';
export * from './requests.interface';

// Exportaciones de nuevos archivos de tipos
export * from './tipos-asistencia.interface';
export * from './tipos-camara-origen.interface';
export * from './tipos-estado.interface';
export * from './tipos-estado-acuerdos-resoluciones.interface';
export * from './tipos-estado-sesion-comision.interface';
export * from './tipos-estado-sesion-sala.interface';
export * from './tipos-iniciativa-proyecto-ley.interface';
export * from './tipos-titular-asistencia.interface';


/**
 * Tipos comunes reexportados para fácil acceso
 */

export type { Comuna } from './comunas.interface';
export type { ComunasColeccion } from './comunas.interface';
export type { ComunasResponse } from './comunas.interface';

export type { Region } from './regiones.interface';
export type { RegionesColeccion } from './regiones.interface';
export type { RegionesResponse } from './regiones.interface';

export type { Ministerio } from './ministerios.interface';
export type { MinisteriosColeccion } from './ministerios.interface';
export type { MinisteriosResponse } from './ministerios.interface';

export type { TipoBase } from './tipos.interface';
export type { TipoCamaraOrigen } from './tipos.interface';
export type { TipoAsistencia } from './tipos.interface';
export type { TiposColeccion } from './tipos.interface';
export type { TiposResponse } from './tipos.interface';

// Requests
export type {
  DetalleVotacionRequest,
  VotacionesXAnnoRequest,
  VotacionesXProyectoLeyRequest,
  SesionesXComisionYAnnoRequest,
  DetalleComisionRequest,
  ComisionesPorPeriodoRequest,
  DetalleDiputadoRequest,
  DiputadosPorPeriodoRequest,
  DetalleProyectoAcuerdoRequest,
  ProyectosAcuerdoPorAnnoRequest,
  DetalleProyectoResolucionRequest,
  ProyectosResolucionPorAnnoRequest,
  MocionesXAnnoRequest,
  MensajesXAnnoRequest,
  ProyectoLeyRequest,
  VotacionesBoletinRequest,
  SesionAsistenciaRequest,
  SesionesXAnnoRequest,
  SesionesXLegislaturaRequest,
} from './requests.interface';
