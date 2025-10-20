/**
 * Interfaz para representar una comuna dentro de una provincia
 */
export interface ComunaRegion {
  Numero: string;
  Nombre: string;
}

/**
 * Interfaz para representar las comunas de una provincia
 */
export interface ComunasProvincia {
  Comuna: ComunaRegion[];
}

/**
 * Interfaz para representar una provincia dentro de una región
 */
export interface Provincia {
  Numero: string;
  Nombre: string;
  Comunas: {
    Comuna: ComunaRegion[];
  };
}

/**
 * Interfaz para representar las provincias de una región
 */
export interface ProvinciasRegion {
  Provincia: Provincia[];
}

/**
 * Interfaz para representar una región chilena
 */
export interface Region {
  Numero: string;
  NumeroRomano: string;
  Nombre: string;
  Provincias: ProvinciasRegion;
}

/**
 * Colección de regiones devuelta por la API
 */
export interface RegionesColeccion {
  xmlns: string;
  xmlns_xsi: string;
  xmlns_xsd: string;
  Region: Region[];
}

/**
 * Respuesta completa del endpoint de regiones
 */
export interface RegionesResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    RegionesColeccion: RegionesColeccion;
  };
}