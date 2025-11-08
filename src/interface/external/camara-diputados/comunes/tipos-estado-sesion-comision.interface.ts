/**
 * Interfaz para el endpoint de tipos de estado de sesión de comisión de la Cámara de Diputados.
 *
 * @remarks
 * La API retorna un objeto con claves numéricas serializadas como string ("1" a "5").
 * Se tipan explícitamente para evitar ambigüedad y facilitar el consumo tipado.
 *
 * Basado en la estructura JSON de: /comunes/tiposEstadoSesionComision
 */

export interface TipoEstadoSesionComisionColeccion {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  xmlns: string;
  /**
   * Mapa de códigos de estado de sesión de comisión a su descripción.
   */
  TipoEstadoSesionComision: {
    '1': string;
    '2': string;
    '3': string;
    '4': string;
    '5': string;
  };
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
