/**
 * Interfaz para el endpoint de tipos de estado de sesión de sala de la Cámara de Diputados
 * Basado en la estructura JSON de: /comunes/tiposEstadoSesionSala
 */

export interface TipoEstadoSesionSalaColeccion {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  xmlns: string;
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
