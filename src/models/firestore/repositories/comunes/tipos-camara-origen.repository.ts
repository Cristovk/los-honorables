import { Firestore } from 'firebase-admin/firestore';
import { TipoCamaraOrigenFirestore } from '@models/firestore/collections/comunes/tipos-camara-origen.model';
import { BaseRepository } from '../base.repository';
import { TIPOS_CAMARA_ORIGEN_COLLECTION } from '@models/firestore/collections/comunes/collections.constants';

/**
 * Repositorio para manejar operaciones CRUD de tipos de cámara de origen en Firestore
 */
export class TiposCamaraOrigenRepository extends BaseRepository<TipoCamaraOrigenFirestore> {
  constructor(db: Firestore) {
    super(db, TIPOS_CAMARA_ORIGEN_COLLECTION);
  }

  /**
   * Encuentra tipos de cámara de origen por nombre
   * @param nombre - Nombre del tipo de cámara de origen a buscar
   * @returns Promise con los tipos de cámara de origen encontrados
   */
  async findByNombre(nombre: string): Promise<TipoCamaraOrigenFirestore[]> {
    return this.findByField('nombre', nombre);
  }

  /**
   * Encuentra un tipo de cámara de origen por ID
   * @param id - ID del tipo de cámara de origen
   * @returns Promise con el tipo de cámara de origen encontrado o null
   */
  async findOneById(id: string): Promise<TipoCamaraOrigenFirestore | null> {
    return this.findOneByField('id', id);
  }

  /**
   * Verifica si existe un tipo de cámara de origen por ID
   * @param id - ID del tipo de cámara de origen
   * @returns Promise booleano indicando si existe
   */
  async existsById(id: string): Promise<boolean> {
    return this.existsByField('id', id);
  }

  /**
   * Verifica si existe un tipo de cámara de origen por nombre
   * @param nombre - Nombre del tipo de cámara de origen
   * @returns Promise booleano indicando si existe
   */
  async existsByNombre(nombre: string): Promise<boolean> {
    return this.existsByField('nombre', nombre);
  }
}