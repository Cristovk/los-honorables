import { Firestore } from 'firebase-admin/firestore';
import { BaseRepository } from '../base.repository';
import { DistritoFirestore } from '../../collections/comunes/distritos.model';
import { DISTRITOS_COLLECTION } from '../../collections/comunes/collections.constants';

/**
 * Repositorio para operaciones CRUD de distritos en Firestore
 */
export class DistritosRepository extends BaseRepository<DistritoFirestore> {
  constructor(db: Firestore) {
    super(db, DISTRITOS_COLLECTION);
  }

  /**
   * Busca distritos por número
   */
  async findByNumero(numero: string): Promise<DistritoFirestore[]> {
    return this.findByField('numero', numero);
  }

  /**
   * Busca el primer distrito que coincida con el número
   */
  async findOneByNumero(numero: string): Promise<DistritoFirestore | null> {
    const results = await this.findByNumero(numero);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Verifica si un distrito existe por número
   */
  async existsByNumero(numero: string): Promise<boolean> {
    const distrito = await this.findOneByNumero(numero);
    return distrito !== null;
  }
}