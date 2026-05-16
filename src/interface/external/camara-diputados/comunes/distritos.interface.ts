/**
 * Interfaces para el endpoint de distritos de la Cámara de Diputados
 * Basado en la estructura JSON de: /comunes/distritos
 */

export interface ComunaDistrito {
  Numero: string;
  Nombre: string;
}

export interface ComunasDistrito {
  Comuna: ComunaDistrito[];
}

export interface Distrito {
  Numero: string;
  Comunas: ComunasDistrito;
}

export interface DistritosColeccion {
  "xmlns:xsi": string;
  "xmlns:xsd": string;
  "xmlns": string;
  Distrito: Distrito[];
}

export interface DistritosResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    DistritosColeccion: DistritosColeccion;
  };
}