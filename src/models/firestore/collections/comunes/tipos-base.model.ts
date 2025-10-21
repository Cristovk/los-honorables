import { Timestamp } from 'firebase/firestore';

/**
 * Modelo base para tipos comunes en Firestore
 */
export interface TipoBaseFirestore {
  /** Identificador único del tipo */
  id: string;
  /** Nombre descriptivo del tipo */
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