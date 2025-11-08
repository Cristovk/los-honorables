// Registrar paths de TypeScript antes de cualquier import
import 'tsconfig-paths/register';

import * as admin from 'firebase-admin';

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

// Exportar funciones HTTP
export { syncComunesData, scheduledSyncComunesData } from './manual/diputados/comunes/sync-comunes-data';

// Puedes agregar más funciones aquí según sea necesario
// export { otraFuncion } from './ruta/a/otraFuncion';
