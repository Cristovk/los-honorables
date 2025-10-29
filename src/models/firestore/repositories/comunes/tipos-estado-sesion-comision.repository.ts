import { Firestore } from 'firebase/firestore';
import { TipoEstadoSesionComisionFirestore } from '@models/firestore/collections/comunes/tipos-estado-sesion-comision.model';
import { BaseRepository } from '../base.repository';
import { TIPOS_ESTADO_SESION_COMISION_COLLECTION } from '@models/firestore/collections/comunes/collections.constants';

/**
 * Repositorio para manejar operaciones CRUD de tipos de estado de sesión de comisión en Firestore
 */
export class TiposEstadoSesionComisionRepository extends BaseRepository<TipoEstadoSesionComisionFirestore> {
  constructor(db: Firestore) {
    super(db, TIPOS_ESTADO_SESION_COMISION_COLLECTION);
  }

  /**
   * Encuentra tipos de estado de sesión de comisión por nombre
   * @param nombre - Nombre del tipo de estado a buscar
   * @returns Promise con los tipos de estado encontrados
   */
  async findByNombre(nombre: string): Promise<TipoEstadoSesionComisionFirestore[]> {
    return this.findByField('nombre', nombre);
  }

  /**
   * Encuentra un tipo de estado de sesión de comisión por ID
   * @param id - ID del tipo de estado
   * @returns Promise con el tipo de estado encontrado o null
   */
  async findOneById(id: string): Promise<TipoEstadoSesionComisionFirestore | null> {
    return this.findOneByField('id', id);
  }

  /**
   * Verifica si existe un tipo de estado de sesión de comisión por ID
   * @param id - ID del tipo de estado
   * @returns Promise booleano indicando si existe
   */
  async existsById(id: string): Promise<boolean> {
    return this.existsByField('id', id);
  }

  /**
   * Verifica si existe un tipo de estado de sesión de comisión por nombre
   * @param nombre - Nombre del tipo de estado
   * @returns Promise booleano indicando si existe
   */
  async existsByNombre(nombre: string): Promise<boolean> {
    return this.existsByField('nombre', nombre);
  }
}