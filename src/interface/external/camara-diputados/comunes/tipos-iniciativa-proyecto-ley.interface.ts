/**
 * Interfaz para el endpoint de tipos de iniciativa de proyecto de ley de la Cámara de Diputados.
 *
 * @remarks
 * La API expone un objeto con claves numéricas serializadas como string ("1" y "2").
 * Se definen explícitamente para mejorar el tipado.
 *
 * Basado en la estructura JSON de: /comunes/tiposIniciativaProyectoLey
 */

export interface TipoIniciativaProyectoLeyColeccion {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  xmlns: string;
  /**
   * Mapa de códigos de iniciativa de proyecto de ley a su descripción.
   */
  TipoIniciativaProyectoLey: {
    '1': string;
    '2': string;
  };
}

export interface TiposIniciativaProyectoLeyResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    TiposIniciativaProyectoLeyColeccion: TipoIniciativaProyectoLeyColeccion;
  };
}
