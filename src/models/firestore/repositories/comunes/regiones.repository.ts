import { Firestore } from 'firebase-admin/firestore';
import { BaseRepository } from '../base.repository';
import { RegionFirestore } from '../../collections/comunes/regiones.model';
import { REGIONES_COLLECTION } from '../../collections/comunes/collections.constants';

/**
 * Repositorio para operaciones CRUD de regiones en Firestore
 */
export class RegionesRepository extends BaseRepository<RegionFirestore> {
  constructor(db: Firestore) {
    super(db, REGIONES_COLLECTION);
  }

  /**
   * Busca regiones por número
   */
  async findByNumero(numero: string): Promise<RegionFirestore[]> {
    return this.findByField('numero', numero);
  }

  /**
   * Busca regiones por nombre (búsqueda case-insensitive)
   */
  async findByNombre(nombre: string): Promise<RegionFirestore[]> {
    const normalizedNombre = nombre.toLowerCase().trim();
    const allRegiones = await this.getAll();

    return allRegiones.filter(region =>
      region.nombre.toLowerCase().includes(normalizedNombre)
    );
  }

  /**
   * Obtiene una región por número exacto
   */
  async findOneByNumero(numero: string): Promise<RegionFirestore | null> {
    const results = await this.findByNumero(numero);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Verifica si una región existe por número
   */
  async existsByNumero(numero: string): Promise<boolean> {
    const region = await this.findOneByNumero(numero);
    return region !== null;
  }
}