/**
 * Interfaces específicas para diferentes tipos de endpoints comunes
 * Basado en las estructuras JSON de los endpoints de tipos específicos
 */

// Tipos de Asistencia
export interface TipoAsistenciaColeccion {
  "xmlns:xsi": string;
  "xmlns:xsd": string;
  "xmlns": string;
  TipoAsistencia: {
    "0": string;
    "1": string;
    "2": string;
  };
}

export interface TiposAsistenciaResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    TiposAsistenciaColeccion: TipoAsistenciaColeccion;
  };
}

// Tipos de Cámara de Origen
export interface TipoCamaraOrigenColeccion {
  "xmlns:xsi": string;
  "xmlns:xsd": string;
  "xmlns": string;
  TipoCamaraOrigen: {
    "1": string;
    "2": string;
  };
}

export interface TiposCamaraOrigenResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    TiposCamaraOrigenColeccion: TipoCamaraOrigenColeccion;
  };
}

// Tipos de Estado de Sesión de Comisión
export interface TipoEstadoSesionComisionColeccion {
  "xmlns:xsi": string;
  "xmlns:xsd": string;
  "xmlns": string;
  TipoEstadoSesionComision: Record<string, string>;
}

export interface TiposEstadoSesionComisionResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    TiposEstadoSesionComisionColeccion: TipoEstadoSesionComisionColeccion;
  };
}

// Tipos de Estado de Sesión de Sala
export interface TipoEstadoSesionSalaColeccion {
  "xmlns:xsi": string;
  "xmlns:xsd": string;
  "xmlns": string;
  TipoEstadoSesionSala: Record<string, string>;
}

export interface TiposEstadoSesionSalaResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    TiposEstadoSesionSalaColeccion: TipoEstadoSesionSalaColeccion;
  };
}

// Tipos de Estado (General)
export interface TipoEstadoColeccion {
  "xmlns:xsi": string;
  "xmlns:xsd": string;
  "xmlns": string;
  TipoEstado: Record<string, string>;
}

export interface TiposEstadoResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    TiposEstadoColeccion: TipoEstadoColeccion;
  };
}

// Tipos de Estado de Acuerdos y Resoluciones
export interface TipoEstadoAcuerdosResolucionesColeccion {
  "xmlns:xsi": string;
  "xmlns:xsd": string;
  "xmlns": string;
  TipoEstadoAcuerdosResoluciones: Record<string, string>;
}

export interface TiposEstadoAcuerdosResolucionesResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    TiposEstadoAcuerdosResolucionesColeccion: TipoEstadoAcuerdosResolucionesColeccion;
  };
}

// Tipos de Iniciativa de Proyecto de Ley
export interface TipoIniciativaProyectoLeyColeccion {
  "xmlns:xsi": string;
  "xmlns:xsd": string;
  "xmlns": string;
  TipoIniciativaProyectoLey: Record<string, string>;
}

export interface TiposIniciativaProyectoLeyResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    TiposIniciativaProyectoLeyColeccion: TipoIniciativaProyectoLeyColeccion;
  };
}

// Tipos de Titular de Asistencia
export interface TipoTitularAsistenciaColeccion {
  "xmlns:xsi": string;
  "xmlns:xsd": string;
  "xmlns": string;
  TipoTitularAsistencia: Record<string, string>;
}

export interface TiposTitularAsistenciaResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    TiposTitularAsistenciaColeccion: TipoTitularAsistenciaColeccion;
  };
}