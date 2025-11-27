import axios from 'axios';
import { ManualFunction } from '../types';
import { supabaseAdmin } from '@config/supabase.config';

/**
 * Interfaz para un ministerio
 */
interface Ministerio {
  Id: string;
  Nombre: string;
}

/**
 * Interfaz para la respuesta del endpoint de ministerios
 */
interface MinisteriosResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    MinisteriosColeccion: {
      xmlns: string;
      xmlns_xsi: string;
      xmlns_xsd: string;
      Ministerio: Ministerio[];
    };
  };
}

/**
 * Interfaz para el documento de Firestore
 */
interface MinisterioFirestoreDoc {
  id: string;
  nombre: string;
}

/**
 * Función para consultar el endpoint de ministerios
 * Muestra la lista completa de ministerios de Chile
 */
export const consultarMinisterios: ManualFunction = {
  id: 'consultar-ministerios',
  name: 'Consultar Ministerios',
  description: 'Consulta el endpoint de ministerios y muestra la lista de ministerios de Chile',
  category: 'diputados',
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
      description: '¿Mostrar respuesta completa de la API?',
      required: false,
      defaultValue: false,
    },
    {
      name: 'format',
      type: 'string',
      description: 'Formato de salida: firestore (estructura), table (tabla) o list (lista)',
      required: false,
      defaultValue: 'firestore',
    },
  ],
  execute: async (params) => {
    const { base_url, show_full_response, format } = params || {};

    console.log('\n🏛️ CONSULTA DE MINISTERIOS');
    console.log('═'.repeat(60));
    console.log(`🔗 URL Base: ${base_url}`);
    console.log('═'.repeat(60));

    try {
      console.log('\n🔄 Consultando endpoint de ministerios...');

      const url = `${base_url}/comunes/ministerios`;
      const startTime = Date.now();

      const response = await axios.get<MinisteriosResponse>(url, {
        timeout: 10000, // 10 segundos de timeout
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`✅ Respuesta exitosa - ${response.status} - ${duration}ms\n`);

      // Extraer los ministerios
      const ministerios = response.data?.data?.MinisteriosColeccion?.Ministerio || [];

      if (ministerios.length === 0) {
        console.log('⚠️ No se encontraron ministerios');
        return;
      }

      // Mostrar estadísticas
      console.log('📊 ESTADÍSTICAS:');
      console.log('─'.repeat(60));
      console.log(`📦 Total de ministerios: ${ministerios.length}`);
      console.log(`⏱️ Tiempo de respuesta: ${duration}ms`);
      console.log(`📅 Timestamp: ${response.data.timestamp}`);

      // Mostrar respuesta completa si se solicita
      if (show_full_response) {
        console.log('\n🔍 RESPUESTA COMPLETA DE LA API:');
        console.log('─'.repeat(60));
        console.log(JSON.stringify(response.data, null, 2));
      }

      // Crear documentos estilo Firestore
      const firestoreDocs: Record<string, MinisterioFirestoreDoc> = {};
      ministerios.forEach(ministerio => {
        firestoreDocs[ministerio.Id] = {
          id: ministerio.Id,
          nombre: ministerio.Nombre
        };
      });

      const records = ministerios.map(m => ({ id: String(m.Id), nombre: String(m.Nombre), raw_data: m }));
      const admin: any = supabaseAdmin as any;
      const { error, count } = await admin.from('ministerios').upsert(records, { onConflict: 'id', count: 'exact' });
      if (error) throw error;
      console.log(`\n💾 Guardados en Supabase: ${typeof count === 'number' ? count : records.length}`);

      // Mostrar según el formato seleccionado
      if (format === 'firestore') {
        console.log('\n🔥 ESTRUCTURA PARA FIRESTORE:');
        console.log('─'.repeat(60));
        console.log('Colección: ministerios\n');

        // Ordenar por ID numérico
        const sortedIds = Object.keys(firestoreDocs).sort((a, b) => parseInt(a) - parseInt(b));

        sortedIds.forEach((id, index) => {
          const doc = firestoreDocs[id];
          console.log(`📄 /ministerios/${id}`);
          console.log(`{`);
          console.log(`  id: "${doc.id}",`);
          console.log(`  nombre: "${doc.nombre}"`);
          console.log(`}`);
          if (index < sortedIds.length - 1) {
            console.log('');
          }
        });

      } else if (format === 'table') {
        console.log('\n🏛️ MINISTERIOS DE CHILE (TABLA):');
        console.log('─'.repeat(60));
        console.log('\n┌─────┬────────────────────────────────────────────────────┐');
        console.log('│ ID  │ Nombre del Ministerio                          │');
        console.log('├─────┼────────────────────────────────────────────────────┤');

        const sortedIds = Object.keys(firestoreDocs).sort((a, b) => parseInt(a) - parseInt(b));
        sortedIds.forEach(id => {
          const doc = firestoreDocs[id];
          const idFormatted = doc.id.padEnd(3, ' ');
          const nombre = doc.nombre.padEnd(50, ' ').substring(0, 50);
          console.log(`│ ${idFormatted} │ ${nombre} │`);
        });

        console.log('└─────┴────────────────────────────────────────────────────┘');

      } else {
        console.log('\n🏛️ MINISTERIOS DE CHILE (LISTA):');
        console.log('─'.repeat(60));
        
        const sortedIds = Object.keys(firestoreDocs).sort((a, b) => parseInt(a) - parseInt(b));
        sortedIds.forEach((id, index) => {
          const doc = firestoreDocs[id];
          console.log(`\n${index + 1}. ${doc.nombre}`);
          console.log(`   📌 ID: ${doc.id}`);
          console.log(`   📄 Ruta Firestore: /ministerios/${doc.id}`);
        });
      }

      // Guardar en global para uso posterior
      (global as any).ultimosMinisterios = response.data;
      (global as any).ministeriosFirestore = firestoreDocs;
      (global as any).ministeriosArray = ministerios;
      (global as any).ministeriosSupabaseCount = typeof count === 'number' ? count : records.length;

      console.log('\n💾 DATOS GUARDADOS EN MEMORIA:');
      console.log('─'.repeat(60));
      console.log('• global.ultimosMinisterios (respuesta completa de la API)');
      console.log('• global.ministeriosFirestore (documentos formato Firestore)');
      console.log('• global.ministeriosArray (array original de ministerios)');

      // Mostrar resumen de estructura
      console.log('\n📋 RESUMEN DE ESTRUCTURA FIRESTORE:');
      console.log('─'.repeat(60));
      console.log(`📁 Colección: ministerios`);
      console.log(`📄 Total documentos: ${Object.keys(firestoreDocs).length}`);
      console.log(`🔑 Estructura de documento:`);
      console.log(`   {`);
      console.log(`     id: string,      // ID único del ministerio`);
      console.log(`     nombre: string   // Nombre completo del ministerio`);
      console.log(`   }`);

      // Mostrar algunos ejemplos
      console.log('\n📌 EJEMPLOS DE ACCESO:');
      console.log('─'.repeat(60));
      const ejemploIds = Object.keys(firestoreDocs).sort((a, b) => parseInt(a) - parseInt(b)).slice(0, 3);
      ejemploIds.forEach(id => {
        const doc = firestoreDocs[id];
        console.log(`• ministeriosFirestore["${id}"] = { id: "${doc.id}", nombre: "${doc.nombre}" }`);
      });

      console.log('\n✅ Consulta completada exitosamente');
      console.log('═'.repeat(60));

    } catch (error: any) {
      console.log('\n❌ ERROR EN LA CONSULTA:');
      console.log('─'.repeat(60));

      if (error.response) {
        console.log(`📡 Status: ${error.response.status}`);
        console.log(`📄 Mensaje: ${error.response.data?.message || 'Sin mensaje'}`);
        console.log(`🔗 URL: ${error.config?.url || 'N/A'}`);
      } else if (error.request) {
        console.log('🚫 No se recibió respuesta del servidor');
        console.log(`🔗 URL intentada: ${base_url}/comunes/ministerios`);
        console.log('💡 Verifica que el servidor esté corriendo');
      } else {
        console.log(`⚠️ Error: ${error.message}`);
      }

      console.log('\n🔍 Detalles del error:');
      console.log(error);

      throw error;
    }
  },
};
