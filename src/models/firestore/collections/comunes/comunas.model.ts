import { Timestamp } from 'firebase/firestore';

/**
 * Modelo de Firestore para una comuna chilena
 * Basado en la interfaz Comuna de la API de la Cámara de Diputados
 */
export interface ComunaFirestore {
    /** Número único de la comuna */
    numero: string;
    /** Nombre de la comuna */
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

