/**
 * Interfaz para el endpoint de tipos de titular de asistencia de la Cámara de Diputados.
 *
 * @remarks
 * La API expone un objeto con claves numéricas serializadas como string ("1" y "2").
 * Se tipan explícitamente para brindar mayor seguridad en el contrato.
 *
 * Basado en la estructura JSON de: /comunes/tiposTitularAsistencia
 */

export interface TipoTitularAsistenciaColeccion {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  xmlns: string;
  /**
   * Mapa de códigos de titular de asistencia a su descripción.
   */
  TipoTitularAsistencia: {
    '1': string;
    '2': string;
  };
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
