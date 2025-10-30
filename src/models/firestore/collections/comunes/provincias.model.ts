import { Timestamp } from 'firebase-admin/firestore';

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
  /** Fecha de creación en Firestore */
  createdAt: Timestamp;
  /** Fecha de última actualización */
  updatedAt: Timestamp;
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
