import { Firestore } from 'firebase-admin/firestore';
import { BaseRepository } from '../base.repository';
import { ProvinciaFirestore } from '../../collections/comunes/provincias.model';
import { PROVINCIAS_COLLECTION } from '../../collections/comunes/collections.constants';

/**
 * Repositorio para operaciones CRUD de provincias en Firestore
 */
export class ProvinciasRepository extends BaseRepository<ProvinciaFirestore> {
  constructor(db: Firestore) {
    super(db, PROVINCIAS_COLLECTION);
  }

  /**
   * Busca provincias por número
   */
  async findByNumero(numero: string): Promise<ProvinciaFirestore[]> {
    return this.findByField('numero', numero);
  }

  /**
   * Busca provincias por nombre (búsqueda case-insensitive)
   */
  async findByNombre(nombre: string): Promise<ProvinciaFirestore[]> {
    const normalizedNombre = nombre.toLowerCase().trim();
    const allProvincias = await this.getAll();

    return allProvincias.filter(provincia =>
      provincia.nombre.toLowerCase().includes(normalizedNombre)
    );
  }

  /**
   * Obtiene una provincia por número exacto
   */
  async findOneByNumero(numero: string): Promise<ProvinciaFirestore | null> {
    const results = await this.findByNumero(numero);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Verifica si una provincia existe por número
   */
  async existsByNumero(numero: string): Promise<boolean> {
    const provincia = await this.findOneByNumero(numero);
    return provincia !== null;
  }
}