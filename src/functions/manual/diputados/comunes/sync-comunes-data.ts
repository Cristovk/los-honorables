import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { fetchAndProcessXml } from "@utils/xmlToJson";
import { CONFIG } from '@config/endpoints-config';
import { createLogger } from '@services/logging/console-logger.service';

// Importar repositorios
import { ComunasRepository } from '@models/firestore/repositories/comunes/comunas.repository';
import { DistritosRepository } from '@models/firestore/repositories/comunes/distritos.repository';
import { ProvinciasRepository } from '@models/firestore/repositories/comunes/provincias.repository';
import { RegionesRepository } from '@models/firestore/repositories/comunes/regiones.repository';
import { MinisteriosRepository } from '@models/firestore/repositories/comunes/ministerios.repository';

// Importar interfaces de datos
import { ComunaFirestore } from '@models/firestore/collections/comunes/comunas.model';
import { DistritoFirestore } from '@models/firestore/collections/comunes/distritos.model';
import { ProvinciaFirestore } from '@models/firestore/collections/comunes/provincias.model';
import { RegionFirestore } from '@models/firestore/collections/comunes/regiones.model';
import { MinisterioFirestore } from '@models/firestore/collections/comunes/ministerios.model';



const logger = createLogger({ serviceName: 'sync-comunes-data', enabled: true });

// Inicializar Firebase Admin (ya debería estar inicializado en el contexto de Cloud Functions)
const db = admin.firestore();

/**
 * Mapea datos de comuna de la API a Firestore
 */
function mapComunaToFirestore(comunaData: any): ComunaFirestore {
  return {
    numero: comunaData.Numero?.toString() || '',
    nombre: comunaData.Nombre?.toString() || '',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    metadata: {
      source: 'camara-diputados',
      endpoint: 'comun_comunas',
      lastSynced: Timestamp.now()
    }
  };
}

/**
 * Mapea datos de distrito de la API a Firestore
 */
function mapDistritoToFirestore(distritoData: any): DistritoFirestore {
  return {
    numero: distritoData.Numero?.toString() || '',
    comunas: distritoData.Comunas?.Comuna?.map((comuna: any) => ({
      numero: comuna.Numero?.toString() || '',
      nombre: comuna.Nombre?.toString() || ''
    })) || [],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    metadata: {
      source: 'camara-diputados',
      endpoint: 'comun_distritos',
      lastSynced: Timestamp.now()
    }
  };
}

/**
 * Mapea datos de provincia de la API a Firestore
 */
function mapProvinciaToFirestore(provinciaData: any): ProvinciaFirestore {
  return {
    numero: provinciaData.Numero?.toString() || '',
    nombre: provinciaData.Nombre?.toString() || '',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    metadata: {
      source: 'camara-diputados',
      endpoint: 'comun_provincias',
      lastSynced: Timestamp.now()
    }
  };
}

/**
 * Mapea datos de región de la API a Firestore
 */
function mapRegionToFirestore(regionData: any): RegionFirestore {
  return {
    numero: regionData.Numero?.toString() || '',
    nombre: regionData.Nombre?.toString() || '',
    provincias: regionData.Provincias?.Provincia?.map((provincia: any) => ({
      numero: provincia.Numero?.toString() || '',
      nombre: provincia.Nombre?.toString() || '',
      comunas: provincia.Comunas?.Comuna?.map((comuna: any) => ({
        numero: comuna.Numero?.toString() || '',
        nombre: comuna.Nombre?.toString() || ''
      })) || []
    })) || [],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    metadata: {
      source: 'camara-diputados',
      endpoint: 'comun_regiones',
      lastSynced: Timestamp.now()
    }
  };
}

/**
 * Mapea datos de ministerio de la API a Firestore
 */
function mapMinisterioToFirestore(ministerioData: any): MinisterioFirestore {
  return {
    id: ministerioData.Numero?.toString() || '', // Usar el número como ID
    nombre: ministerioData.Nombre?.toString() || '',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    metadata: {
      source: 'camara-diputados',
      endpoint: 'comun_ministerios',
      lastSynced: Timestamp.now()
    }
  };
}

/**
 * Sincroniza datos de comunas
 */
async function syncComunas(): Promise<void> {
  try {
    logger.info('Iniciando sincronización de comunas');

    const endpoint = CONFIG.getEndpoint('Comun', 'comun_comunas');
    if (!endpoint) {
      throw new Error('Endpoint comun_comunas no encontrado');
    }

    const url = CONFIG.buildUrl(endpoint);
    logger.info(`Obteniendo datos de comunas desde: ${url}`);

    const data = await fetchAndProcessXml(url);
    const comunasData = data.ComunasColeccion?.Comuna || [];

    if (!Array.isArray(comunasData)) {
      throw new Error('Formato de datos de comunas inválido');
    }

    const comunasRepository = new ComunasRepository(db);

    // Eliminar datos existentes antes de insertar nuevos
    const existingComunas = await comunasRepository.getAll();
    if (existingComunas.length > 0) {
      const ids = existingComunas.map(c => c.numero!).filter(Boolean);
      await comunasRepository.deleteBatch(ids);
      logger.info(`Eliminadas ${ids.length} comunas existentes`);
    }

    // Insertar nuevas comunas
    const comunasToInsert = comunasData.map(mapComunaToFirestore);
    const insertedIds = await comunasRepository.createBatch(comunasToInsert);

    logger.info(`Sincronizadas ${insertedIds.length} comunas exitosamente`);

  } catch (error) {
    logger.error('Error sincronizando comunas:', error instanceof Error ? error : new Error('Error desconocido'));
    throw error;
  }
}

/**
 * Sincroniza datos de distritos
 */
async function syncDistritos(): Promise<void> {
  try {
    logger.info('Iniciando sincronización de distritos');

    const endpoint = CONFIG.getEndpoint('Comun', 'comun_distritos');
    if (!endpoint) {
      throw new Error('Endpoint comun_distritos no encontrado');
    }

    const url = CONFIG.buildUrl(endpoint);
    logger.info(`Obteniendo datos de distritos desde: ${url}`);

    const data = await fetchAndProcessXml(url);
    const distritosData = data.DistritosColeccion?.Distrito || [];

    if (!Array.isArray(distritosData)) {
      throw new Error('Formato de datos de distritos inválido');
    }

    const distritosRepository = new DistritosRepository(db);

    // Eliminar datos existentes antes de insertar nuevos
    const existingDistritos = await distritosRepository.getAll();
    if (existingDistritos.length > 0) {
      const ids = existingDistritos.map(d => d.numero!).filter(Boolean);
      await distritosRepository.deleteBatch(ids);
      logger.info(`Eliminados ${ids.length} distritos existentes`);
    }

    // Insertar nuevos distritos
    const distritosToInsert = distritosData.map(mapDistritoToFirestore);
    const insertedIds = await distritosRepository.createBatch(distritosToInsert);

    logger.info(`Sincronizados ${insertedIds.length} distritos exitosamente`);

  } catch (error) {
    logger.error('Error sincronizando distritos:', error instanceof Error ? error : new Error('Error desconocido'));
    throw error;
  }
}

/**
 * Sincroniza datos de provincias
 */
async function syncProvincias(): Promise<void> {
  try {
    logger.info('Iniciando sincronización de provincias');

    const endpoint = CONFIG.getEndpoint('Comun', 'comun_provincias');
    if (!endpoint) {
      throw new Error('Endpoint comun_provincias no encontrado');
    }

    const url = CONFIG.buildUrl(endpoint);
    logger.info(`Obteniendo datos de provincias desde: ${url}`);

    const data = await fetchAndProcessXml(url);
    const provinciasData = data.ProvinciasColeccion?.Provincia || [];

    if (!Array.isArray(provinciasData)) {
      throw new Error('Formato de datos de provincias inválido');
    }

    const provinciasRepository = new ProvinciasRepository(db);

    // Eliminar datos existentes antes de insertar nuevos
    const existingProvincias = await provinciasRepository.getAll();
    if (existingProvincias.length > 0) {
      const ids = existingProvincias.map(p => p.numero!).filter(Boolean);
      await provinciasRepository.deleteBatch(ids);
      logger.info(`Eliminadas ${ids.length} provincias existentes`);
    }

    // Insertar nuevas provincias
    const provinciasToInsert = provinciasData.map(mapProvinciaToFirestore);
    const insertedIds = await provinciasRepository.createBatch(provinciasToInsert);

    logger.info(`Sincronizadas ${insertedIds.length} provincias exitosamente`);

  } catch (error) {
    logger.error('Error sincronizando provincias:', error instanceof Error ? error : new Error('Error desconocido'));
    throw error;
  }
}

/**
 * Sincroniza datos de regiones
 */
async function syncRegiones(): Promise<void> {
  try {
    logger.info('Iniciando sincronización de regiones');

    const endpoint = CONFIG.getEndpoint('Comun', 'comun_regiones');
    if (!endpoint) {
      throw new Error('Endpoint comun_regiones no encontrado');
    }

    const url = CONFIG.buildUrl(endpoint);
    logger.info(`Obteniendo datos de regiones desde: ${url}`);

    const data = await fetchAndProcessXml(url);
    const regionesData = data.RegionesColeccion?.Region || [];

    if (!Array.isArray(regionesData)) {
      throw new Error('Formato de datos de regiones inválido');
    }

    const regionesRepository = new RegionesRepository(db);

    // Eliminar datos existentes antes de insertar nuevos
    const existingRegiones = await regionesRepository.getAll();
    if (existingRegiones.length > 0) {
      const ids = existingRegiones.map(r => r.numero!).filter(Boolean);
      await regionesRepository.deleteBatch(ids);
      logger.info(`Eliminadas ${ids.length} regiones existentes`);
    }

    // Insertar nuevas regiones
    const regionesToInsert = regionesData.map(mapRegionToFirestore);
    const insertedIds = await regionesRepository.createBatch(regionesToInsert);

    logger.info(`Sincronizadas ${insertedIds.length} regiones exitosamente`);

  } catch (error) {
    logger.error('Error sincronizando regiones:', error instanceof Error ? error : new Error('Error desconocido'));
    throw error;
  }
}

/**
 * Sincroniza datos de ministerios
 */
async function syncMinisterios(): Promise<void> {
  try {
    logger.info('Iniciando sincronización de ministerios');

    const endpoint = CONFIG.getEndpoint('Comun', 'comun_ministerios');
    if (!endpoint) {
      throw new Error('Endpoint comun_ministerios no encontrado');
    }

    const url = CONFIG.buildUrl(endpoint);
    logger.info(`Obteniendo datos de ministerios desde: ${url}`);

    const data = await fetchAndProcessXml(url);
    const ministeriosData = data.MinisteriosColeccion?.Ministerio || [];

    if (!Array.isArray(ministeriosData)) {
      throw new Error('Formato de datos de ministerios inválido');
    }

    const ministeriosRepository = new MinisteriosRepository(db);

    // Eliminar datos existentes antes de insertar nuevos
    const existingMinisterios = await ministeriosRepository.getAll();
    if (existingMinisterios.length > 0) {
      const ids = existingMinisterios.map(m => m.id!).filter(Boolean);
      await ministeriosRepository.deleteBatch(ids);
      logger.info(`Eliminados ${ids.length} ministerios existentes`);
    }

    // Insertar nuevos ministerios
    const ministeriosToInsert = ministeriosData.map(mapMinisterioToFirestore);
    const insertedIds = await ministeriosRepository.createBatch(ministeriosToInsert);

    logger.info(`Sincronizados ${insertedIds.length} ministerios exitosamente`);

  } catch (error) {
    logger.error('Error sincronizando ministerios:', error instanceof Error ? error : new Error('Error desconocido'));
    throw error;
  }
}

/**
 * Función principal que sincroniza todos los datos comunes
 */
export async function syncAllComunesData(): Promise<void> {
  try {
    logger.info('Iniciando sincronización completa de datos comunes');

    // Ejecutar todas las sincronizaciones en secuencia
    await syncComunas();
    await syncDistritos();
    await syncProvincias();
    await syncRegiones();
    await syncMinisterios();

    logger.info('Sincronización completa de datos comunes finalizada exitosamente');

  } catch (error) {
    logger.error('Error en sincronización completa:', error instanceof Error ? error : new Error('Error desconocido'));
    throw error;
  }
}

/**
 * Cloud Function para sincronizar datos comunes de la Cámara de Diputados
 * Se puede invocar mediante HTTP o programación
 */
export const syncComunesData = functions
  .region('southamerica-east1') // Ajustar región según necesidad
  .https.onRequest(async (request, response) => {
    // Configurar CORS para permitir llamadas desde diferentes orígenes
    response.set('Access-Control-Allow-Origin', '*');

    if (request.method === 'OPTIONS') {
      response.set('Access-Control-Allow-Methods', 'GET, POST');
      response.set('Access-Control-Allow-Headers', 'Content-Type');
      response.status(204).send('');
      return;
    }

    try {
      logger.info('Iniciando sincronización de datos comunes via Cloud Function');

      await syncAllComunesData();

      logger.info('Sincronización completada exitosamente');
      response.status(200).json({
        success: true,
        message: 'Sincronización de datos comunes completada exitosamente',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('Error en sincronización:', error instanceof Error ? error : new Error(errorMessage));

      response.status(500).json({
        success: false,
        message: 'Error en sincronización de datos comunes',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  });

/**
 * Cloud Function programada para sincronización automática
 * Ejemplo: ejecutar diariamente a las 3:00 AM
 */
export const scheduledSyncComunesData = functions
  .region('southamerica-east1')
  .pubsub.schedule('0 3 * * *') // Todos los días a las 3:00 AM
  .timeZone('America/Santiago')
  .onRun(async (context) => {
    try {
      logger.info('Iniciando sincronización programada de datos comunes');

      await syncAllComunesData();

      logger.info('Sincronización programada completada exitosamente');
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('Error en sincronización programada:', error instanceof Error ? error : new Error(errorMessage));
      throw error;
    }
  });