import CONFIG from './endpoints-config';

/**
 * Configuración específica para integración con IA
 * Complementa la configuración principal en endpoints-config.ts
 */
export const AI_CONFIG = {
  // Configuración DeepSeek v3.1
  deepseek: {
    apiKey: CONFIG.DEEPSEEK_API_KEY,
    model: 'deepseek-v3.1',
    baseUrl: 'https://api.deepseek.com/v1',
    maxTokens: 4000,
    temperature: 0.3,
    timeout: 30000
  },

  // Configuración de procesamiento
  processing: {
    enabled: CONFIG.AI_PROCESSING_ENABLED,
    batchSize: 10,
    retryAttempts: 3,
    retryDelay: 1000,
    cacheEnabled: true
  },

  // Configuración de caché
  cache: {
    expirationDays: CONFIG.CACHE_EXPIRATION_DAYS,
    maxSize: 1000, // Máximo número de respuestas cacheadas
    cleanupInterval: 24 * 60 * 60 * 1000 // 24 horas en ms
  },

  // Templates de prompts para diferentes tipos de análisis
  prompts: {
    explanation: {
      template: `Explica este proyecto de ley chileno de manera simple para un ciudadano promedio:

Título: {titulo}
Descripción: {descripcion}
Tipo: {tipo}

Requisitos:
- Máximo 200 palabras
- Lenguaje coloquial chileno
- Sin jerga legal
- Explica el impacto real en la vida diaria
- Incluye a quién afecta directamente`,
      maxLength: 200
    },

    categorization: {
      template: `Clasifica este proyecto de ley chileno en UNA de estas categorías:

Categorías disponibles:
- Social
- Económico
- Salud
- Educación
- Medio Ambiente
- Seguridad
- Trabajo
- Vivienda
- Transporte
- Cultura
- Tecnología
- Justicia

Proyecto:
Título: {titulo}
Descripción: {descripcion}

Responde solo con el nombre de la categoría, sin explicaciones adicionales.`,
      categories: [
        'Social', 'Económico', 'Salud', 'Educación', 'Medio Ambiente',
        'Seguridad', 'Trabajo', 'Vivienda', 'Transporte', 'Cultura',
        'Tecnología', 'Justicia'
      ]
    },

    summary: {
      template: `Resume este proyecto de ley chileno en máximo 50 palabras, explicando:
1. Qué propone
2. A quién afecta
3. Cuál es el objetivo principal

Proyecto:
Título: {titulo}
Descripción: {descripcion}

Respuesta en máximo 50 palabras:`,
      maxLength: 50
    }
  },

  // Configuración de calidad y validación
  quality: {
    minConfidence: 0.7, // Confianza mínima para aceptar respuesta
    validateResponses: true,
    logResponses: true
  }
};

export default AI_CONFIG;