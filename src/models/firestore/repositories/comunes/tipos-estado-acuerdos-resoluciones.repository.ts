import { Firestore } from 'firebase/firestore';
import { TipoEstadoAcuerdosResolucionesFirestore } from '@models/firestore/collections/comunes/tipos-estado-acuerdos-resoluciones.model';
import { BaseRepository } from '../base.repository';
import { TIPOS_ESTADO_ACUERDOS_RESOLUCIONES_COLLECTION } from '@models/firestore/collections/comunes/collections.constants';

/**
 * Repositorio para manejar operaciones CRUD de tipos de estado de acuerdos y resoluciones en Firestore
 */
export class TiposEstadoAcuerdosResolucionesRepository extends BaseRepository<TipoEstadoAcuerdosResolucionesFirestore> {
  constructor(db: Firestore) {
    super(db, TIPOS_ESTADO_ACUERDOS_RESOLUCIONES_COLLECTION);
  }

  /**
   * Encuentra tipos de estado de acuerdos y resoluciones por nombre
   * @param nombre - Nombre del tipo de estado a buscar
   * @returns Promise con los tipos de estado encontrados
   */
  async findByNombre(nombre: string): Promise<TipoEstadoAcuerdosResolucionesFirestore[]> {
    return this.findByField('nombre', nombre);
  }

  /**
   * Encuentra un tipo de estado de acuerdos y resoluciones por ID
   * @param id - ID del tipo de estado
   * @returns Promise con el tipo de estado encontrado o null
   */
  async findOneById(id: string): Promise<TipoEstadoAcuerdosResolucionesFirestore | null> {
    return this.findOneByField('id', id);
  }

  /**
   * Verifica si existe un tipo de estado de acuerdos y resoluciones por ID
   * @param id - ID del tipo de estado
   * @returns Promise booleano indicando si existe
   */
  async existsById(id: string): Promise<boolean> {
    return this.existsByField('id', id);
  }

  /**
   * Verifica si existe un tipo de estado de acuerdos y resoluciones por nombre
   * @param nombre - Nombre del tipo de estado
   * @returns Promise booleano indicando si existe
   */
  async existsByNombre(nombre: string): Promise<boolean> {
    return this.existsByField('nombre', nombre);
  }
}