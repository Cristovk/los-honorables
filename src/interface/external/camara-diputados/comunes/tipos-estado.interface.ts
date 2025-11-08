/**
 * Interfaz para el endpoint de tipos de estado de la Cámara de Diputados.
 *
 * @remarks
 * La API entrega un objeto con claves numéricas serializadas como string ("0" y "1").
 * Se tipan explícitamente para reflejar fielmente el contrato de la API.
 *
 * Basado en la estructura JSON de: /comunes/tiposEstado
 */

export interface TipoEstadoColeccion {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  xmlns: string;
  /**
   * Mapa de códigos de estado general a su descripción.
   */
  TipoEstado: {
    '0': string;
    '1': string;
  };
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
