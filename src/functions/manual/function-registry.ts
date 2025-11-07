import { ManualFunction } from './types';

// Importar funciones de ejemplos
import { 
  greetingFunction, 
  calculatorFunction, 
  systemInfoFunction 
} from './examples/demo-functions';

// Importar funciones de Firestore
import { 
  createCollectionStructure, 
  generateSecurityRules 
} from './firestore/collection-functions';

/**
 * Registro central de todas las funciones manuales disponibles
 * Para agregar una nueva función:
 * 1. Importarla arriba
 * 2. Agregarla al array AVAILABLE_FUNCTIONS
 */
export const AVAILABLE_FUNCTIONS: ManualFunction[] = [
  // Funciones de ejemplo
  greetingFunction,
  calculatorFunction,
  systemInfoFunction,
  
  // Funciones de Firestore
  createCollectionStructure,
  generateSecurityRules,
];

/**
 * Obtiene todas las funciones disponibles
 */
export const getAllFunctions = (): ManualFunction[] => {
  return AVAILABLE_FUNCTIONS;
};

/**
 * Obtiene funciones por categoría
 */
export const getFunctionsByCategory = (category: string): ManualFunction[] => {
  return AVAILABLE_FUNCTIONS.filter(func => func.category === category);
};

/**
 * Busca una función por su ID
 */
export const getFunctionById = (id: string): ManualFunction | undefined => {
  return AVAILABLE_FUNCTIONS.find(func => func.id === id);
};

/**
 * Obtiene las categorías disponibles
 */
export const getAvailableCategories = (): string[] => {
  const categories = AVAILABLE_FUNCTIONS.map(func => func.category);
  return Array.from(new Set(categories));
};

/**
 * Busca funciones por texto (nombre o descripción)
 */
export const searchFunctions = (searchText: string): ManualFunction[] => {
  const search = searchText.toLowerCase();
  return AVAILABLE_FUNCTIONS.filter(func => 
    func.name.toLowerCase().includes(search) ||
    func.description.toLowerCase().includes(search)
  );
};