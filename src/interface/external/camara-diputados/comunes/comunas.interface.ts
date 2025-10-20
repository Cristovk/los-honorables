/**
 * Interfaz para representar una comuna chilena
 * @see http://opendata.camara.cl/camaradiputados/v1/comunes/comunas
 */
export interface Comuna {
  /** Número único de la comuna */
  Numero: string;
  /** Nombre de la comuna */
  Nombre: string;
}

/**
 * Colección de comunas devuelta por la API
 */
export interface ComunasColeccion {
  xmlns: string;
  xmlns_xsi: string;
  xmlns_xsd: string;
  Comuna: Comuna[];
}

/**
 * Respuesta completa del endpoint de comunas
 */
export interface ComunasResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    ComunasColeccion: ComunasColeccion;
  };
}