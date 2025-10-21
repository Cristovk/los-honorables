#!/usr/bin/env node

/**
 * Script simplificado para verificar conexión con Firestore
 * Esta versión no depende de paths de alias para evitar problemas de resolución
 */

import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Logger simple para este script
class SimpleLogger {
  info(message, ...args) {
    console.log(`ℹ️  ${message}`, ...args);
  }
  
  error(message, ...args) {
    console.error(`❌ ${message}`, ...args);
  }
  
  success(message, ...args) {
    console.log(`✅ ${message}`, ...args);
  }
}

async function checkFirestoreConnection() {
  const logger = new SimpleLogger();

  try {
    logger.info('Iniciando verificación de conexión Firestore...');

    // 1. Cargar configuración de Firebase
    const firebaseCredentialsPath = process.env.FIREBASE_CREDENTIALS || 'horonables-firebase.json';

    // Leer el archivo de Service Account
    let serviceAccount;
    try {
      const credentialsContent = readFileSync(join(process.cwd(), firebaseCredentialsPath), 'utf8');
      serviceAccount = JSON.parse(credentialsContent);
      logger.info(`Service Account cargado - Proyecto: ${serviceAccount.projectId}`);
    } catch (error) {
      logger.error(`Error cargando Service Account desde: ${firebaseCredentialsPath}`, error);
      throw new Error(`No se pudo cargar las credenciales de Firebase`);
    }

    // 2. Inicializar Firebase Admin (solo una vez)
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      logger.info('Firebase Admin inicializado correctamente');
    }

    // 3. Obtener instancia de Firestore
    const db = admin.firestore();

    // 4. Verificar emulador si es necesario
    if (process.env.FIREBASE_EMULATOR_HOST) {
      logger.info('⚠️  Emulador detectado - usando configuración de emulador');
    }

    // 5. Realizar operación de prueba
    logger.info('Realizando operación de prueba...');

    const testCollection = '__connection_test__';
    const testDocRef = db.collection(testCollection).doc('test');

    const testData = {
      timestamp: new Date().toISOString(),
      test: 'firestore_connection_check',
      status: 'testing'
    };

    // Intentar escribir
    await testDocRef.set(testData);
    logger.info('Escritura de prueba exitosa');

    // Intentar leer
    const docSnapshot = await testDocRef.get();

    if (docSnapshot.exists) {
      logger.info('Lectura de prueba exitosa');

      // Limpiar
      await testDocRef.delete();
      logger.info('Limpieza de documento de prueba completada');

      return {
        success: true,
        message: 'Conexión con Firestore verificada exitosamente',
        details: {
          projectId: serviceAccount.projectId,
          environment: process.env.FIREBASE_EMULATOR_HOST ? 'emulator' : 'production',
          timestamp: new Date().toISOString()
        }
      };
    } else {
      return {
        success: false,
        message: 'El documento de prueba no existe después de escribirlo'
      };
    }

  } catch (error) {
    logger.error('Error en verificación de conexión Firestore:', error);

    return {
      success: false,
      message: 'Error de conexión con Firestore',
      details: {
        error: error.message,
        code: error.code
      }
    };
  }
}

// Ejecutar la verificación
async function main() {
  console.log('=== Verificación de Conexión Firestore (Simplificado) ===\n');

  const result = await checkFirestoreConnection();

  console.log('\n📊 Resultado:');
  console.log(`✅ Éxito: ${result.success}`);
  console.log(`📝 Mensaje: ${result.message}`);

  if (result.details) {
    console.log('\n🔍 Detalles:');
    console.log(JSON.stringify(result.details, null, 2));
  }

  console.log('\n=== Verificación completada ===');
  process.exit(result.success ? 0 : 1);
}

// Ejecutar solo si se llama directamente
if (import.meta.url === `file://${__filename}`) {
  main().catch(error => {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  });
}

export { checkFirestoreConnection };