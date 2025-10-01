import 'dotenv/config';
import { EndpointsDiputados } from '@server/EndpointsDiputados';

// Configuración centralizada que combina endpoints con variables de entorno
const env = (key: string, defaultValue?: string) => {
  return process.env[key] ?? defaultValue ?? '';
};

/**
 * Configuración central del proyecto Los Honorables
 * Fuente única de verdad para endpoints y configuración
 */
export const CONFIG = {
  // Configuración general
  BASE_URL: env('BASE_URL', 'https://opendata.camara.cl/camaradiputados/WServices/'),
  PORT: Number(env('PORT', '6000')),

  // Configuración Firebase
  FIREBASE_CREDENTIALS_PATH: env('FIREBASE_CREDENTIALS', 'horonables-firebase.json'),

  // Configuración IA
  DEEPSEEK_API_KEY: env('DEEPSEEK_API_KEY'),
  AI_PROCESSING_ENABLED: env('AI_PROCESSING_ENABLED', 'true') === 'true',

  // Configuración de datos
  DATA_SYNC_ENABLED: env('DATA_SYNC_ENABLED', 'true') === 'true',
  CACHE_EXPIRATION_DAYS: Number(env('CACHE_EXPIRATION_DAYS', '7')),

  // Endpoints - Fuente única desde EndpointsDiputados.ts
  ENDPOINTS: EndpointsDiputados,

  // Helper para construir URLs completas
  buildUrl: (endpoint: { url: string }, params: Record<string, string | number> = {}): string => {
    const baseUrl = CONFIG.BASE_URL;
    let url = `${baseUrl}${endpoint.url}`;

    // Agregar parámetros si existen
    const queryParams = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    if (queryParams) {
      url += `?${queryParams}`;
    }

    return url;
  },

  // Helper para obtener endpoint por categoría y nombre
  getEndpoint: (category: keyof typeof EndpointsDiputados, endpointKey: string) => {
    const categoryEndpoints = CONFIG.ENDPOINTS[category] as any;
    return categoryEndpoints?.[endpointKey] || null;
  }
};

export default CONFIG;