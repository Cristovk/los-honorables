/**
 * Interfaz para el endpoint de tipos de estado de acuerdos y resoluciones de la Cámara de Diputados
 * Basado en la estructura JSON de: /comunes/tiposEstadoAcuerdosResoluciones
 */

export interface TipoEstadoAcuerdosResolucionesColeccion {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  xmlns: string;
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
