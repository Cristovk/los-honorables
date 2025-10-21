import { Firestore } from 'firebase/firestore';
import { BaseRepository } from '../base.repository';
import { ComunaFirestore } from '../../collections/comunes/comunas.model';
import { COMUNAS_COLLECTION } from '../../collections/comunes/collections.constants';

/**
 * Repositorio para operaciones CRUD de comunas en Firestore
 */
export class ComunasRepository extends BaseRepository<ComunaFirestore> {
  constructor(db: Firestore) {
    super(db, COMUNAS_COLLECTION);
  }

  /**
   * Busca comunas por número
   */
  async findByNumero(numero: string): Promise<ComunaFirestore[]> {
    return this.findByField('numero', numero);
  }

  /**
   * Busca comunas por nombre (búsqueda case-insensitive)
   */
  async findByNombre(nombre: string): Promise<ComunaFirestore[]> {
    // Para búsqueda case-insensitive, necesitamos normalizar el texto
    const normalizedNombre = nombre.toLowerCase().trim();
    const allComunas = await this.getAll();

    return allComunas.filter(comuna =>
      comuna.nombre.toLowerCase().includes(normalizedNombre)
    );
  }

  /**
   * Obtiene una comuna por número exacto
   */
  async findOneByNumero(numero: string): Promise<ComunaFirestore | null> {
    const results = await this.findByNumero(numero);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Verifica si una comuna existe por número
   */
  async existsByNumero(numero: string): Promise<boolean> {
    const comuna = await this.findOneByNumero(numero);
    return comuna !== null;
  }
}