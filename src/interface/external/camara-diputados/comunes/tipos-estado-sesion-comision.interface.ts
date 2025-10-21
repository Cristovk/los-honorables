/**
 * Interfaz para el endpoint de tipos de estado de sesión de comisión de la Cámara de Diputados
 * Basado en la estructura JSON de: /comunes/tiposEstadoSesionComision
 */

export interface TipoEstadoSesionComisionColeccion {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  xmlns: string;
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
