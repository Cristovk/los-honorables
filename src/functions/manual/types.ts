// Tipo base para todas las funciones manuales
export interface ManualFunction {
  id: string;
  name: string;
  description: string;
  category: 'firestore' | 'utils' | 'examples';
  inputs?: FunctionInput[];
  execute: (params?: Record<string, any>) => Promise<void>;
}

// Configuración de inputs para las funciones
export interface FunctionInput {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  description: string;
  required: boolean;
  options?: string[]; // Para tipo 'select'
  defaultValue?: any;
}

// Resultado de la ejecución de una función
export interface FunctionResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

// Configuración del menú principal
export interface MenuOption {
  name: string;
  value: string;
  description?: string;
}