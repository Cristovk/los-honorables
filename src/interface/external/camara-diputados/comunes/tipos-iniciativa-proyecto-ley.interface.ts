/**
 * Interfaz para el endpoint de tipos de iniciativa de proyecto de ley de la Cámara de Diputados
 * Basado en la estructura JSON de: /comunes/tiposIniciativaProyectoLey
 */

export interface TipoIniciativaProyectoLeyColeccion {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  xmlns: string;
  TipoIniciativaProyectoLey: Record<string, string>;
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
