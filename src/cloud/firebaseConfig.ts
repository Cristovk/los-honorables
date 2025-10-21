import admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Configuración de Firebase Admin SDK para backend
 * Lee Service Account desde archivo JSON
 */

const env = (key: string, defaultValue?: string): string => {
  return process.env[key] ?? defaultValue ?? '';
};

const firebaseCredentialsPath = env('FIREBASE_CREDENTIALS', 'horonables-firebase.json');

// Leer el archivo de Service Account
let serviceAccount: admin.ServiceAccount;
try {
  const credentialsContent = readFileSync(
    join(process.cwd(), firebaseCredentialsPath),
    'utf8'
  );
  serviceAccount = JSON.parse(credentialsContent);

  console.log('✅ Firebase Service Account cargado correctamente');
  console.log(`📂 Proyecto: ${serviceAccount.project_id}`);
} catch (error) {
  console.error('❌ Error cargando Firebase Service Account:', error);
  throw new Error(
    `Failed to load Firebase credentials from: ${firebaseCredentialsPath}\n` +
    `Asegúrate de que el archivo existe y es un Service Account válido.`
  );
}

// Validar campos requeridos del Service Account
const validateServiceAccount = (sa: any): void => {
  const requiredFields = [
    'type',
    'project_id',
    'private_key_id',
    'private_key',
    'client_email',
    'client_id'
  ];

  const missingFields = requiredFields.filter(field => !sa[field]);

  if (missingFields.length > 0) {
    throw new Error(
      `Service Account inválido. Campos faltantes: ${missingFields.join(', ')}\n` +
      'Descarga un nuevo Service Account desde Firebase Console.'
    );
  }

  if (sa.type !== 'service_account') {
    throw new Error(
      `Tipo de credencial inválido: ${sa.type}\n` +
      'Se esperaba "service_account". Verifica que descargaste el archivo correcto.'
    );
  }
};

// Validar Service Account
validateServiceAccount(serviceAccount);

// Inicializar Firebase Admin (solo una vez)
// Usamos un enfoque más robusto para verificar apps inicializadas
const apps = admin.apps;
if (!apps || apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('🔥 Firebase Admin inicializado correctamente');
} else {
  console.log('ℹ️  Firebase Admin ya estaba inicializado');
}

// Exportar instancias de servicios
const DB = admin.firestore();
const Storage = admin.storage();
const Auth = admin.auth();

// Configuración adicional de Firestore (opcional)
DB.settings({
  ignoreUndefinedProperties: true, // Ignora propiedades undefined al guardar
});

/**
 * Obtener información del proyecto
 */
export const getProjectInfo = () => {
  return {
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKeyId: serviceAccount.private_key_id,
    initialized: admin.apps.length > 0
  };
};

export { DB, Storage, Auth, admin };
export default admin;
