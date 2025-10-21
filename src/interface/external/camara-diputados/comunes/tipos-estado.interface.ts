/**
 * Interfaz para el endpoint de tipos de estado de la Cámara de Diputados
 * Basado en la estructura JSON de: /comunes/tiposEstado
 */

export interface TipoEstadoColeccion {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  xmlns: string;
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
