/**
 * Interfaz para el endpoint de tipos de titular de asistencia de la Cámara de Diputados
 * Basado en la estructura JSON de: /comunes/tiposTitularAsistencia
 */

export interface TipoTitularAsistenciaColeccion {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  xmlns: string;
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
