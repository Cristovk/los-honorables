/**
 * Interfaz para el endpoint de tipos de estado de sesión de sala de la Cámara de Diputados.
 *
 * @remarks
 * La API expone un objeto cuyas claves son códigos numéricos serializados como string
 * (por ejemplo: "0", "1", "2"). Se definen explícitamente para mejorar el tipado
 * y evitar el uso genérico de Record.
 *
 * Basado en la estructura JSON de: /comunes/tiposEstadoSesionSala
 */

export interface TipoEstadoSesionSalaColeccion {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  xmlns: string;
  /**
   * Mapa de códigos de estado de sesión de sala a su descripción.
   * Las claves son strings numéricas entregadas por el servicio.
   */
  TipoEstadoSesionSala: {
    '0': string;
    '1': string;
    '2': string;
  };
}

export interface TiposEstadoSesionSalaResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    TiposEstadoSesionSalaColeccion: TipoEstadoSesionSalaColeccion;
  };
}
