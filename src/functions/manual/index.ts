/**
 * Sistema de Funciones Manuales
 * 
 * Este módulo proporciona un sistema interactivo para gestionar y ejecutar
 * funciones manuales desde la línea de comandos.
 * 
 * Uso:
 * - Desde package.json: `bun run functions`
 * - Desde Node.js: import FunctionManager from './function-manager'
 */

export { default as FunctionManager } from './function-manager';
export * from './types';
export * from './function-registry';

// Re-exportar funciones específicas para uso programático
export {
  greetingFunction,
  calculatorFunction,
  systemInfoFunction
} from './examples/demo-functions';

export {
  createCollectionStructure,
  generateSecurityRules
} from './firestore/collection-functions';

export {
  consultarEndpointsTipos
} from './call-routes-diputados/consultar-endpoints-tipos';

// Función de conveniencia para ejecutar el manager
export async function startFunctionManager(): Promise<void> {
  const { default: FunctionManager } = await import('./function-manager');
  const manager = new FunctionManager();
  return manager.start();
}