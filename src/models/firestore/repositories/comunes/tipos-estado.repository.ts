import { Firestore } from 'firebase/firestore';
import { TipoEstadoFirestore } from '@models/firestore/collections/comunes/tipos-estado.model';
import { BaseRepository } from '../base.repository';
import { TIPOS_ESTADO_COLLECTION } from '@models/firestore/collections/comunes/collections.constants';

/**
 * Repositorio para manejar operaciones CRUD de tipos de estado en Firestore
 */
export class TiposEstadoRepository extends BaseRepository<TipoEstadoFirestore> {
  constructor(db: Firestore) {
    super(db, TIPOS_ESTADO_COLLECTION);
  }

  /**
   * Encuentra tipos de estado por nombre
   * @param nombre - Nombre del tipo de estado a buscar
   * @returns Promise con los tipos de estado encontrados
   */
  async findByNombre(nombre: string): Promise<TipoEstadoFirestore[]> {
    return this.findByField('nombre', nombre);
  }

  /**
   * Encuentra un tipo de estado por ID
   * @param id - ID del tipo de estado
   * @returns Promise con el tipo de estado encontrado o null
   */
  async findOneById(id: string): Promise<TipoEstadoFirestore | null> {
    return this.findOneByField('id', id);
  }

  /**
   * Verifica si existe un tipo de estado por ID
   * @param id - ID del tipo de estado
   * @returns Promise booleano indicando si existe
   */
  async existsById(id: string): Promise<boolean> {
    return this.existsByField('id', id);
  }

  /**
   * Verifica si existe un tipo de estado por nombre
   * @param nombre - Nombre del tipo de estado
   * @returns Promise booleano indicando si existe
   */
  async existsByNombre(nombre: string): Promise<boolean> {
    return this.existsByField('nombre', nombre);
  }
}