import { Timestamp } from 'firebase-admin/firestore';

/**
 * Modelo de Firestore para una comuna dentro de una región
 */
export interface ComunaRegionFirestore {
  numero: string;
  nombre: string;
}

/**
 * Modelo de Firestore para una provincia dentro de una región
 */
export interface ProvinciaRegionFirestore {
  numero: string;
  nombre: string;
  comunas: ComunaRegionFirestore[];
}

/**
 * Modelo de Firestore para una región chilena
 * Basado en la interfaz Region de la API de la Cámara de Diputados
 */
export interface RegionFirestore {
  /** Número de la región */
  numero: string;
  /** Número romano de la región */
  numeroRomano?: string;
  /** Nombre de la región */
  nombre: string;
  /** Provincias que pertenecen a la región */
  provincias: ProvinciaRegionFirestore[];
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

