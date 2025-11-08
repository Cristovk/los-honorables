import admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Configuración de Firebase Admin SDK para backend
 * Lee Service Account desde archivo JSON con validaciones robustas
 */

// ============================
// TIPOS PERSONALIZADOS
// ============================

/**
 * Interfaz que representa la estructura exacta del Service Account JSON de Firebase
 * Nota: Firebase usa snake_case en sus archivos JSON
 */
interface FirebaseServiceAccountJSON {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain?: string;
}

// ============================
// UTILIDADES DE CONFIGURACIÓN
// ============================

/**
 * Helper para obtener variables de entorno de forma segura
 */
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];

  if (!value && !defaultValue) {
    throw new Error(
      `❌ Variable de entorno requerida no encontrada: ${key}\n` +
      `Asegúrate de configurar ${key} en tu archivo .env`
    );
  }

  return value ?? defaultValue ?? '';
};

/**
 * Valida que todos los campos requeridos existan en el Service Account
 */
const validateServiceAccount = (sa: any): sa is FirebaseServiceAccountJSON => {
  // Campos requeridos tal como vienen en el JSON de Firebase
  const requiredFields: (keyof FirebaseServiceAccountJSON)[] = [
    'type',
    'project_id',
    'private_key_id',
    'private_key',
    'client_email',
    'client_id',
    'auth_uri',
    'token_uri',
  ];

  // Verificar campos faltantes
  const missingFields = requiredFields.filter(field => !sa[field]);

  if (missingFields.length > 0) {
    throw new Error(
      `❌ Service Account inválido. Campos faltantes: ${missingFields.join(', ')}\n` +
      '📖 Descarga un nuevo Service Account desde:\n' +
      '   https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk\n' +
      '   1. Ve a "Generar nueva clave privada"\n' +
      '   2. Descarga el archivo JSON\n' +
      '   3. Guárdalo como horonables-firebase.json'
    );
  }

  // Validar que sea tipo service_account
  if (sa.type !== 'service_account') {
    throw new Error(
      `❌ Tipo de credencial inválido: "${sa.type}"\n` +
      '✅ Se esperaba "service_account"\n' +
      '💡 Verifica que descargaste el archivo correcto (no es una API key ni OAuth client)'
    );
  }

  // Validar formato de la private_key
  if (!sa.private_key.includes('BEGIN PRIVATE KEY')) {
    throw new Error(
      `❌ El campo "private_key" no tiene el formato correcto\n` +
      '✅ Debe contener "-----BEGIN PRIVATE KEY-----"\n' +
      '💡 Descarga un nuevo Service Account si este está corrupto'
    );
  }

  // Validar formato del email
  const emailRegex = /^[\w-]+@[\w-]+\.iam\.gserviceaccount\.com$/;
  if (!emailRegex.test(sa.client_email)) {
    console.warn(
      `⚠️  El client_email tiene un formato inusual: ${sa.client_email}\n` +
      '   Esto puede causar problemas de autenticación'
    );
  }

  return true;
};

/**
 * Carga el Service Account desde archivo con manejo robusto de errores
 */
const loadServiceAccount = (path: string): admin.ServiceAccount => {
  try {
    const absolutePath = join(process.cwd(), path);

    console.log(`📂 Cargando credenciales desde: ${absolutePath}`);

    const credentialsContent = readFileSync(absolutePath, 'utf8');
    const serviceAccount = JSON.parse(credentialsContent) as FirebaseServiceAccountJSON;

    // Validar estructura
    validateServiceAccount(serviceAccount);

    console.log('✅ Firebase Service Account cargado correctamente');
    console.log(`📋 Proyecto: ${serviceAccount.project_id}`);
    console.log(`📧 Email: ${serviceAccount.client_email}`);
    console.log(`🔑 Key ID: ${serviceAccount.private_key_id.substring(0, 8)}...`);

    // Convertir a ServiceAccount de Firebase Admin
    return serviceAccount as unknown as admin.ServiceAccount;

  } catch (error: any) {
    // Error: Archivo no encontrado
    if (error.code === 'ENOENT') {
      throw new Error(
        `❌ Archivo de credenciales no encontrado: ${path}\n` +
        `📂 Ruta absoluta buscada: ${join(process.cwd(), path)}\n` +
        `📝 Verifica que:\n` +
        `   1. El archivo existe en la ubicación correcta\n` +
        `   2. El nombre del archivo es correcto\n` +
        `   3. La variable FIREBASE_CREDENTIALS en .env apunta al archivo correcto`
      );
    }

    // Error: JSON inválido
    if (error instanceof SyntaxError) {
      throw new Error(
        `❌ Error al parsear JSON del Service Account: ${path}\n` +
        `💡 El archivo no contiene JSON válido\n` +
        `🔧 Solución:\n` +
        `   1. Abre el archivo y verifica que sea un JSON válido\n` +
        `   2. Si está corrupto, descarga uno nuevo desde Firebase Console\n` +
        `   Error original: ${error.message}`
      );
    }

    // Error de validación
    if (error instanceof Error && error.message.includes('Service Account inválido')) {
      throw error; // Re-lanzar error de validación con mensaje original
    }

    // Error desconocido
    throw new Error(
      `❌ Error inesperado al cargar credenciales: ${path}\n` +
      `Error: ${error.message}\n` +
      `Stack: ${error.stack}`
    );
  }
};

// ============================
// INICIALIZACIÓN DE FIREBASE
// ============================

const firebaseCredentialsPath = getEnvVar(
  'FIREBASE_CREDENTIALS',
  'horonables-firebase.json'
);

const serviceAccount = loadServiceAccount(firebaseCredentialsPath);

/**
 * Inicializa Firebase Admin SDK (solo una vez)
 */
const initializeFirebase = (): admin.app.App => {
  // Verificar si ya existe una app inicializada
  if (admin.apps.length > 0) {
    console.log('ℹ️  Firebase Admin ya estaba inicializado');
    return admin.apps[0]!;
  }

  try {
    // Configuración base
    const config: admin.AppOptions = {
      credential: admin.credential.cert(serviceAccount),
    };

    // Configuraciones opcionales
    const databaseURL = process.env.FIREBASE_DATABASE_URL;
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

    if (databaseURL) {
      config.databaseURL = databaseURL;
      console.log(`🗄️  Database URL configurada: ${databaseURL}`);
    }

    if (storageBucket) {
      config.storageBucket = storageBucket;
      console.log(`🪣 Storage Bucket configurado: ${storageBucket}`);
    }

    // Inicializar app
    const app = admin.initializeApp(config);

    console.log('🔥 Firebase Admin inicializado correctamente');
    console.log(`📱 App Name: ${app.name}`);

    return app;

  } catch (error: any) {
    throw new Error(
      `❌ Error al inicializar Firebase Admin SDK\n` +
      `Error: ${error.message}\n` +
      `💡 Verifica que las credenciales sean válidas`
    );
  }
};

// Inicializar Firebase
const firebaseApp = initializeFirebase();

// ============================
// SERVICIOS DE FIREBASE
// ============================

/**
 * Instancia de Firestore con configuraciones optimizadas
 */
export const DB = admin.firestore();

// Configuración de Firestore
DB.settings({
  ignoreUndefinedProperties: true, // Ignora propiedades undefined al guardar
  // timestampsInSnapshots: true, // DEPRECATED: Ya es true por defecto
});

console.log('📊 Firestore configurado correctamente');

/**
 * Instancia de Storage
 */
export const Storage = admin.storage();

/**
 * Instancia de Authentication
 */
export const Auth = admin.auth();

/**
 * Instancia de Messaging (para notificaciones push)
 */
export const Messaging = admin.messaging();

// ============================
// UTILIDADES DE INFORMACIÓN
// ============================

/**
 * Obtiene información del proyecto Firebase
 */
export const getProjectInfo = () => {
  const sa = serviceAccount as unknown as FirebaseServiceAccountJSON;

  return {
    projectId: sa.project_id,
    clientEmail: sa.client_email,
    privateKeyId: sa.private_key_id,
    initialized: admin.apps.length > 0,
    appName: firebaseApp.name,
    hasDatabase: !!process.env.FIREBASE_DATABASE_URL,
    hasStorage: !!process.env.FIREBASE_STORAGE_BUCKET,
  };
};

/**
 * Verifica el estado de conexión con Firestore
 */
export const checkFirestoreConnection = async (): Promise<boolean> => {
  try {
    // Intenta leer colecciones (operación lightweight)
    await DB.listCollections();
    console.log('✅ Conexión con Firestore establecida');
    return true;
  } catch (error: any) {
    console.error('❌ Error al conectar con Firestore:', error.message);
    return false;
  }
};

/**
 * Obtiene estadísticas del uso de Firebase
 */
export const getFirebaseStats = async () => {
  try {
    const collections = await DB.listCollections();

    // Obtener conteo de documentos en cada colección (limitado para performance)
    const collectionsWithCounts = await Promise.all(
      collections.map(async (col) => {
        const snapshot = await col.limit(1000).get();
        return {
          name: col.id,
          documentCount: snapshot.size,
          isLimited: snapshot.size === 1000,
        };
      })
    );

    return {
      projectId: (serviceAccount as unknown as FirebaseServiceAccountJSON).project_id,
      totalCollections: collections.length,
      collections: collectionsWithCounts,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('❌ Error obteniendo estadísticas:', error.message);
    return null;
  }
};

/**
 * Health check completo de Firebase
 */
export const healthCheck = async () => {
  const health = {
    status: 'unknown' as 'healthy' | 'degraded' | 'unhealthy',
    timestamp: new Date().toISOString(),
    services: {
      firestore: false,
      auth: false,
      storage: false,
    },
    details: {} as Record<string, any>,
  };

  try {
    // Check Firestore
    health.services.firestore = await checkFirestoreConnection();

    // Check Auth (intenta listar usuarios con límite 1)
    try {
      await Auth.listUsers(1);
      health.services.auth = true;
    } catch (error) {
      console.warn('⚠️  Auth check falló:', (error as Error).message);
    }

    // Check Storage (intenta acceder al bucket)
    try {
      const bucket = Storage.bucket();
      await bucket.getMetadata();
      health.services.storage = true;
    } catch (error) {
      console.warn('⚠️  Storage check falló:', (error as Error).message);
    }

    // Determinar estado general
    const healthyServices = Object.values(health.services).filter(Boolean).length;
    if (healthyServices === 3) {
      health.status = 'healthy';
    } else if (healthyServices > 0) {
      health.status = 'degraded';
    } else {
      health.status = 'unhealthy';
    }

    health.details = getProjectInfo();

  } catch (error: any) {
    health.status = 'unhealthy';
    health.details.error = error.message;
  }

  return health;
};

// ============================
// EXPORTACIONES
// ============================

export { admin, firebaseApp };
export default admin;

// Tipos útiles para usar en otras partes del proyecto
export type FirestoreTimestamp = admin.firestore.Timestamp;
export type FirestoreFieldValue = admin.firestore.FieldValue;
export type FirestoreDocumentReference = admin.firestore.DocumentReference;
export type FirestoreCollectionReference = admin.firestore.CollectionReference;
export type FirestoreQuerySnapshot = admin.firestore.QuerySnapshot;
export type FirestoreDocumentSnapshot = admin.firestore.DocumentSnapshot;