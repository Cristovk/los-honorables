import { Timestamp, FieldValue } from 'firebase-admin/firestore';

/**
 * Modelo de Firestore para una comuna dentro de un distrito
 */
export interface ComunaDistritoFirestore {
  numero: string;
  nombre: string;
}

/**
 * Modelo de Firestore para un distrito chileno
 * Basado en la interfaz Distrito de la API de la Cámara de Diputados
 */
export interface DistritoFirestore {
  /** Número del distrito */
  numero: string;
  /** Comunas que pertenecen al distrito */
  comunas: ComunaDistritoFirestore[];
  /** Fecha de creación en Firestore (puede ser Timestamp o FieldValue para server timestamp) */
  createdAt: Timestamp | FieldValue;
  /** Fecha de última actualización (puede ser Timestamp o FieldValue para server timestamp) */
  updatedAt: Timestamp | FieldValue;
  /** Metadata de la fuente de datos */
  metadata: {
    /** Fuente de los datos */
    source: 'camara-diputados';
    /** Endpoint de la API */
    endpoint: string;
    /** Timestamp de la última sincronización */
    lastSynced: Timestamp;
  };
}
