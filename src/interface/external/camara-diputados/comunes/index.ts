// Exportaciones principales
export * from './comunas.interface';
export * from './regiones.interface';
export * from './ministerios.interface';
export * from './distritos.interface';
export { Provincia, ProvinciasColeccion, ProvinciasResponse } from './provincias.interface';
export * from './tipos.interface';
export * from './tipos-especificos.interface';
export * from './requests.interface';

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

export type { TipoAsistenciaColeccion } from './tipos-especificos.interface';
export type { TiposAsistenciaResponse } from './tipos-especificos.interface';
export type { TipoCamaraOrigenColeccion } from './tipos-especificos.interface';
export type { TiposCamaraOrigenResponse } from './tipos-especificos.interface';
export type { TipoEstadoSesionComisionColeccion } from './tipos-especificos.interface';
export type { TiposEstadoSesionComisionResponse } from './tipos-especificos.interface';
export type { TipoEstadoSesionSalaColeccion } from './tipos-especificos.interface';
export type { TiposEstadoSesionSalaResponse } from './tipos-especificos.interface';
export type { TipoEstadoColeccion } from './tipos-especificos.interface';
export type { TiposEstadoResponse } from './tipos-especificos.interface';
export type { TipoEstadoAcuerdosResolucionesColeccion } from './tipos-especificos.interface';
export type { TiposEstadoAcuerdosResolucionesResponse } from './tipos-especificos.interface';
export type { TipoIniciativaProyectoLeyColeccion } from './tipos-especificos.interface';
export type { TiposIniciativaProyectoLeyResponse } from './tipos-especificos.interface';
export type { TipoTitularAsistenciaColeccion } from './tipos-especificos.interface';
export type { TiposTitularAsistenciaResponse } from './tipos-especificos.interface';

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