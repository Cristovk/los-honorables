import { Firestore } from 'firebase/firestore';
import { BaseRepository } from '../base.repository';
import { MinisterioFirestore } from '../../collections/comunes/ministerios.model';
import { MINISTERIOS_COLLECTION } from '../../collections/comunes/collections.constants';

/**
 * Repositorio para operaciones CRUD de ministerios en Firestore
 */
export class MinisteriosRepository extends BaseRepository<MinisterioFirestore> {
  constructor(db: Firestore) {
    super(db, MINISTERIOS_COLLECTION);
  }

  /**
   * Busca ministerios por número
   */
  async findByNumero(numero: string): Promise<MinisterioFirestore[]> {
    return this.findByField('numero', numero);
  }

  /**
   * Busca ministerios por nombre (búsqueda case-insensitive)
   */
  async findByNombre(nombre: string): Promise<MinisterioFirestore[]> {
    const normalizedNombre = nombre.toLowerCase().trim();
    const allMinisterios = await this.getAll();

    return allMinisterios.filter(ministerio =>
      ministerio.nombre.toLowerCase().includes(normalizedNombre)
    );
  }

  /**
   * Obtiene un ministerio por número exacto
   */
  async findOneByNumero(numero: string): Promise<MinisterioFirestore | null> {
    const results = await this.findByNumero(numero);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Verifica si un ministerio existe por número
   */
  async existsByNumero(numero: string): Promise<boolean> {
    const ministerio = await this.findOneByNumero(numero);
    return ministerio !== null;
  }
}