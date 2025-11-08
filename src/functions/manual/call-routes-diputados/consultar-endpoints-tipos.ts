import axios from 'axios';
import { ManualFunction } from '../types';

// Interfaz para la respuesta de cada endpoint
interface ApiEndpointResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: any;
}

// Función para consultar todos los endpoints de tipos
export const consultarEndpointsTipos: ManualFunction = {
  id: 'consultar-endpoints-tipos',
  name: 'Consultar Endpoints de Tipos',
  description: 'Consulta todos los endpoints de tipos de la API de Diputados y muestra las respuestas',
  category: 'utils',
  inputs: [
    {
      name: 'base_url',
      type: 'string',
      description: 'URL base del servidor (ej: http://localhost:6000)',
      required: false,
      defaultValue: 'http://localhost:6000',
    },
    {
      name: 'show_full_response',
      type: 'boolean',
      description: '¿Mostrar respuesta completa o solo los datos principales?',
      required: false,
      defaultValue: false,
    },
  ],
  execute: async (params) => {
    const { base_url, show_full_response } = params || {};

    // Lista de endpoints de tipos
    const tiposEndpoints = [
      'tiposAsistencia',
      'tiposCamaraOrigen',
      'tiposEstado',
      'tiposEstadoAcuerdosResoluciones',
      'tiposEstadoSesionComision',
      'tiposEstadoSesionSala',
      'tiposIniciativaProyectoLey',
      'tiposSesionSala',
      'tiposTitularAsistencia'
    ];

    console.log('\\n🌐 CONSULTA DE ENDPOINTS DE TIPOS');
    console.log('═'.repeat(60));
    console.log(`🔗 URL Base: ${base_url}`);
    console.log(`📊 Total de endpoints: ${tiposEndpoints.length}`);
    console.log('═'.repeat(60));

    const resultados: Record<string, any> = {};
    const resultadosLimpios: Record<string, any> = {};
    const errores: string[] = [];
    let exitosos = 0;

    // Función helper para extraer los datos principales
    const extraerDatosPrincipales = (data: any): any => {
      if (!data) return null;

      // Función recursiva para buscar el objeto de tipos (clave numérica -> descripción)
      const buscarDatosTipos = (obj: any, profundidad: number = 0): any => {
        if (!obj || typeof obj !== 'object') return null;
        if (profundidad > 5) return null; // Limitar profundidad

        // Filtrar claves xmlns
        const keys = Object.keys(obj).filter(key => !key.startsWith('xmlns'));
        if (keys.length === 0) return null;

        // Verificar si todos los valores son strings (indica que es un diccionario de tipos)
        const valores = keys.map(key => obj[key]);
        const todosStrings = valores.every(val => typeof val === 'string');

        // Si encontramos un objeto donde todos los valores son strings, es nuestro objetivo
        if (todosStrings && keys.length > 0) {
          const resultado: any = {};
          keys.forEach(key => {
            resultado[key] = obj[key];
          });
          return resultado;
        }

        // Buscar recursivamente
        for (const key of keys) {
          const valor = obj[key];
          if (valor && typeof valor === 'object') {
            const resultado = buscarDatosTipos(valor, profundidad + 1);
            if (resultado) return resultado;
          }
        }

        return null;
      };

      return buscarDatosTipos(data);
    };

    // Consultar cada endpoint
    for (const endpoint of tiposEndpoints) {
      try {
        console.log(`\\n🔄 Consultando: ${endpoint}...`);

        const url = `${base_url}/comunes/${endpoint}`;
        const startTime = Date.now();

        const response = await axios.get<ApiEndpointResponse>(url, {
          timeout: 10000, // 10 segundos de timeout
        });

        const endTime = Date.now();
        const duration = endTime - startTime;

        if (response.data) {
          resultados[endpoint] = response.data;

          // Extraer solo los datos principales
          const datosLimpios = extraerDatosPrincipales(response.data);
          resultadosLimpios[endpoint] = datosLimpios;

          exitosos++;

          console.log(`  ✅ ${endpoint} - ${response.status} - ${duration}ms`);

          // Mostrar preview de los datos limpios
          if (datosLimpios) {
            const keys = Object.keys(datosLimpios);
            console.log(`     📋 Datos extraídos: ${keys.length} elemento(s)`);
          }
        }

      } catch (error: any) {
        const errorMsg = error.response?.data?.message || error.message || 'Error desconocido';
        errores.push(`${endpoint}: ${errorMsg}`);

        console.log(`  ❌ ${endpoint} - Error: ${errorMsg}`);

        // Agregar respuesta de error al resultado
        resultados[endpoint] = {
          success: false,
          error: errorMsg,
          status: error.response?.status || 0,
        };

        resultadosLimpios[endpoint] = null;
      }

      // Pequeña pausa entre requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Mostrar resumen
    console.log('\\n📊 RESUMEN DE CONSULTAS:');
    console.log('─'.repeat(60));
    console.log(`✅ Exitosos: ${exitosos}/${tiposEndpoints.length}`);
    console.log(`❌ Errores: ${errores.length}/${tiposEndpoints.length}`);

    if (errores.length > 0) {
      console.log('\\n❌ ERRORES ENCONTRADOS:');
      console.log(base_url)
      errores.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    // Mostrar datos consolidados limpios
    console.log('\\n📦 DATOS CONSOLIDADOS (LIMPIOS):');
    console.log('─'.repeat(60));

    if (show_full_response) {
      // Mostrar respuesta completa original
      console.log('\\n🔍 RESPUESTA COMPLETA ORIGINAL:');
      console.log(JSON.stringify(resultados, null, 2));
      console.log('\\n🎩 DATOS EXTRAÍDOS (LIMPIOS):');
      console.log(resultadosLimpios);
    } else {
      // Mostrar solo los datos limpios como objeto
      console.log('\\n🎩 OBJETO CONSOLIDADO:');
      console.log(resultadosLimpios);

      // Mostrar resumen por endpoint
      console.log('\\n📋 RESUMEN POR ENDPOINT:');
      Object.entries(resultadosLimpios).forEach(([endpoint, data]) => {
        console.log(`\\n🔸 ${endpoint}:`);

        if (data === null) {
          console.log(`  ❌ Sin datos (error en consulta)`);
        } else if (data && typeof data === 'object') {
          const keys = Object.keys(data);
          console.log(`  📊 ${keys.length} elemento(s): [${keys.join(', ')}]`);

          // Mostrar algunos valores de ejemplo
          const firstKeys = keys.slice(0, 3);
          firstKeys.forEach(key => {
            const value = data[key];
            const displayValue = typeof value === 'string' ? value : JSON.stringify(value);
            console.log(`    • ${key}: ${displayValue}`);
          });

          if (keys.length > 3) {
            console.log(`    ... y ${keys.length - 3} más`);
          }
        }
      });
    }

    console.log('\\n🎯 OBJETO CONSOLIDADO DISPONIBLE:');
    console.log('─'.repeat(60));
    console.log('Este objeto contiene solo los datos principales de cada endpoint:');
    console.log(`- Total de endpoints procesados: ${Object.keys(resultadosLimpios).length}`);
    console.log(`- Estructura limpia: { ${Object.keys(resultadosLimpios).join(', ')} }`);
    console.log('\\n💡 Para ver respuestas completas, activa "show_full_response: true"');

    // Guardar en variables globales
    if (typeof global !== 'undefined') {
      (global as any).ultimosResultadosTipos = resultados; // Respuestas completas
      (global as any).tiposLimpios = resultadosLimpios; // Solo datos principales
      console.log('\\n🌐 Datos guardados en:');
      console.log('  - global.ultimosResultadosTipos (respuestas completas)');
      console.log('  - global.tiposLimpios (solo datos principales)');
    }

    console.log('═'.repeat(60));
  },
};