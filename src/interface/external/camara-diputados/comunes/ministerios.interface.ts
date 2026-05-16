/**
 * Interfaz para representar un ministerio chileno
 * @see http://opendata.camara.cl/camaradiputados/v1/comunes/ministerios
 */
export interface Ministerio {
  /** Identificador único del ministerio */
  Id: string;
  /** Nombre completo del ministerio */
  Nombre: string;
}

/**
 * Colección de ministerios devuelta por la API
 */
export interface MinisteriosColeccion {
  xmlns: string;
  xmlns_xsi: string;
  xmlns_xsd: string;
  Ministerio: Ministerio[];
}

/**
 * Respuesta completa del endpoint de ministerios
 */
export interface MinisteriosResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    MinisteriosColeccion: MinisteriosColeccion;
  };
}