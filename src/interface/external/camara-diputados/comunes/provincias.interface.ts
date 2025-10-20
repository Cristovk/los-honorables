/**
 * Interfaces para el endpoint de provincias de la Cámara de Diputados
 * Basado en la estructura JSON de: /comunes/provincias
 */

export interface ComunaProvincia {
  Numero: string;
  Nombre: string;
}

export interface ComunasProvincia {
  Comuna: ComunaProvincia | ComunaProvincia[];
}

export interface Provincia {
  Numero: string;
  Nombre: string;
  Comunas: ComunasProvincia;
}

export interface ProvinciasColeccion {
  "xmlns:xsi": string;
  "xmlns:xsd": string;
  "xmlns": string;
  Provincia: Provincia[];
}

export interface ProvinciasResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    ProvinciasColeccion: ProvinciasColeccion;
  };
}