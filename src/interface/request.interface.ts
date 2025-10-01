export interface MocionesXAnnoRequest {
  year: string;
}

export interface MensajesXAnnoRequest {
  year: string;
}

export interface BoletinRequest {
  boletin: string;
}

export interface SesionAsistenciaRequest {
  id: string;
}

export interface SesionesXAnnoRequest {
  year: string;
}

export interface SesionesXLegislaturaRequest {
  id: string;
}

export interface DetalleVotacionRequest {
  id: string;
}

export interface VotacionesXAnnoRequest {
  year: string;
}

export interface VotacionesXProyectoLeyRequest {
  id: string;
}

// ========================================
// INTERFACES PARA COMISIONES
// ========================================

export interface ComisionSesionesXComisionYAnnoRequest {
  comisionId: number;
  anno: number;
}

export interface ComisionDetalleRequest {
  comisionId: number;
}

// ComisionVigentesRequest - Sin parámetros necesarios

export interface ComisionPorPeriodoRequest {
  periodoId: number;
}

// ========================================
// INTERFACES PARA DIPUTADOS (completar las faltantes)
// ========================================

export interface DiputadoDetalleRequest {
  diputadoId: number;
}

// DiputadoListaRequest - Sin parámetros necesarios
// DiputadoPeriodoActualRequest - Sin parámetros necesarios (ya implementado)

export interface DiputadoPorPeriodoRequest {
  periodoId: number;
}

// ========================================
// INTERFACES PARA PROYECTOS DE ACUERDO
// ========================================

export interface ProyectoAcuerdoDetalleRequest {
  idProyectoAcuerdo: number;
}

export interface ProyectoAcuerdoPorAnnoRequest {
  anno: number;
}

// ========================================
// INTERFACES PARA PROYECTOS DE RESOLUCIÓN
// ========================================

export interface ProyectoResolucionDetalleRequest {
  idProyectoResolucion: number;
}

export interface ProyectoResolucionPorAnnoRequest {
  anno: number;
}

// ========================================
// INTERFACES PARA LEGISLATIVO (completar las faltantes)
// ========================================

// LegislativoLegislaturaActualRequest - Sin parámetros
// LegislativoPeriodoActualRequest - Sin parámetros
// LegislativoPeriodosRequest - Sin parámetros
// LegislativoLegislaturasRequest - Sin parámetros
// LegislativoMateriasRequest - Sin parámetros (ya implementado)
// MensajesXAnnoRequest - Ya existe
// MocionesXAnnoRequest - Ya existe

export interface LegislativoProyectoLeyRequest {
  numeroBoletin: number;
}

// LegislativoTramitesConstitucionalesRequest - Sin parámetros
// LegislativoTramitesReglamentariosRequest - Sin parámetros
// DetalleVotacionRequest - Ya existe
// VotacionesXAnnoRequest - Ya existe
// VotacionesXProyectoLeyRequest - Ya existe

// ========================================
// INTERFACES PARA DATOS COMUNES
// ========================================

// Todas las interfaces de Comun no requieren parámetros:
// ComunComunasRequest - Sin parámetros
// ComunDistritosRequest - Sin parámetros
// ComunProvinciasRequest - Sin parámetros
// ComunRegionesRequest - Sin parámetros
// ComunMinisteriosRequest - Sin parámetros
// ComunTiposCamaraOrigenRequest - Sin parámetros
// ComunTiposAsistenciaRequest - Sin parámetros
// ComunTiposEstadoSesionComisionRequest - Sin parámetros
// ComunTiposEstadoSesionSalaRequest - Sin parámetros
// ComunTiposTitularAsistenciaRequest - Sin parámetros
// ComunTiposEstadoRequest - Sin parámetros
// ComunTiposEstadoAcuerdosResolucionesRequest - Sin parámetros
// ComunTiposIniciativaProyectoLeyRequest - Sin parámetros
