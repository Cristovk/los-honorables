/**
 * Interfaz para el endpoint de tipos de cámara de origen de la Cámara de Diputados
 * Basado en la estructura JSON de: /comunes/tiposCamaraOrigen
 */

export interface TipoCamaraOrigenColeccion {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  xmlns: string;
  TipoCamaraOrigen: {
    '1': string;
    '2': string;
  };
}

export interface TiposCamaraOrigenResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    TiposCamaraOrigenColeccion: TipoCamaraOrigenColeccion;
  };
}
