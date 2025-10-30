import { Timestamp } from 'firebase-admin/firestore';

/**
 * Modelo de Firestore para un ministerio chileno
 * Basado en la interfaz Ministerio de la API de la Cámara de Diputados
 */
export interface MinisterioFirestore {
  /** Identificador único del ministerio */
  id: string;
  /** Nombre completo del ministerio */
  nombre: string;
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

