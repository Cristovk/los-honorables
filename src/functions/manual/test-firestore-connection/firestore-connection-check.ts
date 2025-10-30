import { DB, Storage, Auth, admin, getProjectInfo } from '@cloud/firebaseConfig';

/**
 * Función manual para verificar la conexión con Firestore
 * Esta función puede ejecutarse manualmente para diagnosticar problemas de conexión
 * 
 * Uso:
 * ```typescript
 * import { testFirestoreConnection } from './testFirebaseConnection';
 * 
 * testFirestoreConnection()
 *   .then(() => console.log('✅ Todo funcionó correctamente'))
 *   .catch((error) => console.error('❌ Hubo un error:', error));
 * ```
 */
export const testFirestoreConnection = async (): Promise<void> => {
  try {
    console.log('\n🔄 Probando conexión con Firestore...\n');

    // Mostrar información del proyecto
    const projectInfo = getProjectInfo();
    console.log('📊 Información del Proyecto:');
    console.log(`   • Project ID: ${projectInfo.projectId}`);
    console.log(`   • Client Email: ${projectInfo.clientEmail}`);
    console.log(`   • Inicializado: ${projectInfo.initialized ? 'Sí' : 'No'}\n`);

    // Intentar listar colecciones
    console.log('📚 Listando colecciones...');
    const collections = await DB.listCollections();

    console.log(`✅ Conexión con Firestore exitosa`);
    console.log(`📋 Colecciones encontradas: ${collections.length}`);

    if (collections.length > 0) {
      console.log(`   Colecciones: ${collections.map(col => col.id).join(', ')}`);
    } else {
      console.log('   ℹ️  No hay colecciones aún en la base de datos');
    }

    // Test de escritura/lectura
    console.log('\n✍️  Probando escritura en Firestore...');
    const testDocRef = DB.collection('__connection_test__').doc('test');

    await testDocRef.set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      message: 'Connection test successful',
      testNumber: Math.random()
    });

    console.log('✅ Escritura exitosa');

    // Test de lectura
    console.log('📖 Probando lectura desde Firestore...');
    const testDoc = await testDocRef.get();

    if (testDoc.exists) {
      console.log('✅ Lectura exitosa');
      console.log('   Datos del documento:', testDoc.data());
    } else {
      throw new Error('El documento de prueba no existe después de crearlo');
    }

    // Limpiar documento de prueba
    console.log('🧹 Limpiando documento de prueba...');
    await testDocRef.delete();
    console.log('✅ Documento de prueba eliminado');

    console.log('\n✅ ¡Todas las pruebas de Firestore pasaron correctamente!\n');

  } catch (error) {
    console.error('\n❌ Error al conectar con Firestore:', error);

    if (error instanceof Error) {
      console.error('\n📝 Detalles del error:');
      console.error(`   • Tipo: ${error.name}`);
      console.error(`   • Mensaje: ${error.message}`);
      if (error.stack) {
        console.error(`   • Stack: ${error.stack.split('\n').slice(0, 3).join('\n      ')}`);
      }
    }

    // Sugerencias de solución
    console.error('\n💡 Posibles soluciones:');
    console.error('   1. Verifica que el Service Account tenga permisos adecuados');
    console.error('   2. Asegúrate de que Firestore esté habilitado en Firebase Console');
    console.error('   3. Verifica las reglas de seguridad de Firestore');
    console.error('   4. Comprueba tu conexión a internet');
    console.error('   5. Revisa que el archivo horonables-firebase.json sea válido\n');

    throw error;
  }
};

/**
 * Función para verificar todos los servicios de Firebase
 * Prueba Firestore, Storage y Authentication
 */
export const testAllFirebaseServices = async (): Promise<{
  firestore: boolean;
  storage: boolean;
  auth: boolean;
}> => {
  console.log('\n🔍 Verificando todos los servicios de Firebase...\n');

  const results = {
    firestore: false,
    storage: false,
    auth: false
  };

  // Test Firestore
  console.log('📊 Probando Firestore...');
  try {
    await DB.listCollections();
    results.firestore = true;
    console.log('   ✅ Firestore: OK\n');
  } catch (error) {
    console.error('   ❌ Firestore: FALLO');
    console.error(`   Error: ${error instanceof Error ? error.message : error}\n`);
  }

  // Test Storage
  console.log('📦 Probando Storage...');
  try {
    const bucket = Storage.bucket();
    const [exists] = await bucket.exists();
    results.storage = exists;
    console.log(`   ✅ Storage: OK (bucket: ${bucket.name})\n`);
  } catch (error) {
    console.error('   ❌ Storage: FALLO');
    console.error(`   Error: ${error instanceof Error ? error.message : error}\n`);
  }

  // Test Auth
  console.log('🔐 Probando Authentication...');
  try {
    await Auth.listUsers(1);
    results.auth = true;
    console.log('   ✅ Auth: OK\n');
  } catch (error) {
    console.error('   ❌ Auth: FALLO');
    console.error(`   Error: ${error instanceof Error ? error.message : error}\n`);
  }

  // Resumen
  console.log('📋 Resumen de pruebas:');
  console.log(`   • Firestore: ${results.firestore ? '✅' : '❌'}`);
  console.log(`   • Storage: ${results.storage ? '✅' : '❌'}`);
  console.log(`   • Auth: ${results.auth ? '✅' : '❌'}\n`);

  return results;
};

/**
 * Función para ejecutar una prueba rápida de conectividad
 * Solo verifica si Firestore responde
 */
export const quickConnectionTest = async (): Promise<boolean> => {
  try {
    await DB.listCollections();
    return true;
  } catch (error) {
    console.error('Quick connection test failed:', error);
    return false;
  }
};

/**
 * Script ejecutable para pruebas rápidas
 * Ejecutar con: ts-node src/functions/manual/test-firestore-connection/firestore-connection-check.ts
 * O crear un archivo de prueba separado que importe estas funciones
 */
