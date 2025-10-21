/**
 * Interfaz para el endpoint de tipos de asistencia de la Cámara de Diputados
 * Basado en la estructura JSON de: /comunes/tiposAsistencia
 */

export interface TipoAsistenciaColeccion {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  xmlns: string;
  TipoAsistencia: {
    '0': string;
    '1': string;
    '2': string;
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
