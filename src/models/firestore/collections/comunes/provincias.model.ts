import { Timestamp, FieldValue } from 'firebase-admin/firestore';

/**
 * Modelo de Firestore para una comuna dentro de una provincia
 */
export interface ComunaProvinciaFirestore {
  numero: string;
  nombre: string;
}

/**
 * Modelo de Firestore para una provincia chilena
 * Basado en la interfaz Provincia de la API de la Cámara de Diputados
 */
export interface ProvinciaFirestore {
  /** Número de la provincia */
  numero: string;
  /** Nombre de la provincia */
  nombre: string;
  /** Comunas que pertenecen a la provincia */
  comunas?: ComunaProvinciaFirestore[];
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
