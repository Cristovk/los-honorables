/**
 * Interfaz para el endpoint de tipos de estado de acuerdos y resoluciones de la Cámara de Diputados.
 *
 * @remarks
 * La API retorna un objeto con claves numéricas serializadas como string ("1" a "6").
 * Se definen explícitamente para mejorar el tipado y la claridad del contrato.
 *
 * Basado en la estructura JSON de: /comunes/tiposEstadoAcuerdosResoluciones
 */

export interface TipoEstadoAcuerdosResolucionesColeccion {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  xmlns: string;
  /**
   * Mapa de códigos de estado de acuerdos y resoluciones a su descripción.
   */
  TipoEstadoAcuerdosResoluciones: {
    '1': string;
    '2': string;
    '3': string;
    '4': string;
    '5': string;
    '6': string;
  };
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
