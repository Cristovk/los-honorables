import { Firestore } from 'firebase-admin/firestore';
import { TipoAsistenciaFirestore } from '@models/firestore/collections/comunes/tipos-asistencia.model';
import { BaseRepository } from '../base.repository';
import { TIPOS_ASISTENCIA_COLLECTION } from '@models/firestore/collections/comunes/collections.constants';

/**
 * Repositorio para manejar operaciones CRUD de tipos de asistencia en Firestore
 */
export class TiposAsistenciaRepository extends BaseRepository<TipoAsistenciaFirestore> {
  constructor(db: Firestore) {
    super(db, TIPOS_ASISTENCIA_COLLECTION);
  }

  /**
   * Encuentra tipos de asistencia por nombre
   * @param nombre - Nombre del tipo de asistencia a buscar
   * @returns Promise con los tipos de asistencia encontrados
   */
  async findByNombre(nombre: string): Promise<TipoAsistenciaFirestore[]> {
    return this.findByField('nombre', nombre);
  }

  /**
   * Encuentra un tipo de asistencia por ID
   * @param id - ID del tipo de asistencia
   * @returns Promise con el tipo de asistencia encontrado o null
   */
  async findOneById(id: string): Promise<TipoAsistenciaFirestore | null> {
    return this.findOneByField('id', id);
  }

  /**
   * Verifica si existe un tipo de asistencia por ID
   * @param id - ID del tipo de asistencia
   * @returns Promise booleano indicando si existe
   */
  async existsById(id: string): Promise<boolean> {
    return this.existsByField('id', id);
  }

  /**
   * Verifica si existe un tipo de asistencia por nombre
   * @param nombre - Nombre del tipo de asistencia
   * @returns Promise booleano indicando si existe
   */
  async existsByNombre(nombre: string): Promise<boolean> {
    return this.existsByField('nombre', nombre);
  }
}