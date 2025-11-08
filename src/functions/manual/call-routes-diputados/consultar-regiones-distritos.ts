import axios from 'axios';
import { ManualFunction } from '../types';

/**
 * Interfaces para las respuestas de la API
 */
interface ComunaDistrito {
  Numero: string;
  Nombre: string;
}

interface Distrito {
  Numero: string;
  Comunas: {
    Comuna: ComunaDistrito[] | ComunaDistrito;
  };
}

interface DistritosResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    DistritosColeccion: {
      'xmlns:xsi': string;
      'xmlns:xsd': string;
      xmlns: string;
      Distrito: Distrito[];
    };
  };
}

interface ComunaRegion {
  Numero: string;
  Nombre: string;
}

interface Provincia {
  Numero: string;
  Nombre: string;
  Comunas: {
    Comuna: ComunaRegion[] | ComunaRegion;
  };
}

interface Region {
  Numero: string;
  NumeroRomano: string;
  Nombre: string;
  Provincias: {
    Provincia: Provincia[] | Provincia;
  };
}

interface RegionesResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    RegionesColeccion: {
      xmlns: string;
      xmlns_xsi: string;
      xmlns_xsd: string;
      Region: Region[];
    };
  };
}

/**
 * Interfaces para documentos de Firestore
 */
interface ComunaFirestore {
  id: string;
  nombre: string;
}

interface DistritoFirestoreDoc {
  id: string;
  nombre: string;
  comunas: ComunaFirestore[];
}

interface ProvinciaFirestore {
  id: string;
  nombre: string;
  comunas: ComunaFirestore[];
}

interface RegionFirestoreDoc {
  id: string;
  nombre: string;
  numeroRomano: string;
  provincias: ProvinciaFirestore[];
}

/**
 * Normaliza un valor que puede ser un array o un objeto a un array
 */
const normalizeToArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

/**
 * Función para consultar regiones y distritos
 * Muestra ambas estructuras preparadas para Firestore
 */
export const consultarRegionesDistritos: ManualFunction = {
  id: 'consultar-regiones-distritos',
  name: 'Consultar Regiones y Distritos',
  description: 'Consulta regiones y distritos de Chile con estructura Firestore',
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
      name: 'tipo',
      type: 'select',
      description: 'Qué consultar?',
      required: true,
      options: ['ambos', 'regiones', 'distritos'],
      defaultValue: 'ambos',
    },
    {
      name: 'show_full_response',
      type: 'boolean',
      description: '¿Mostrar respuesta completa de la API?',
      required: false,
      defaultValue: false,
    },
    {
      name: 'show_detailed',
      type: 'boolean',
      description: '¿Mostrar estructura detallada con comunas/provincias?',
      required: false,
      defaultValue: true,
    },
  ],
  execute: async (params) => {
    const { base_url, tipo, show_full_response, show_detailed } = params || {};

    console.log('\n🗺️ CONSULTA DE REGIONES Y DISTRITOS');
    console.log('═'.repeat(60));
    console.log(`🔗 URL Base: ${base_url}`);
    console.log(`📊 Tipo: ${tipo}`);
    console.log('═'.repeat(60));

    let distritosData: DistritoFirestoreDoc[] = [];
    let regionesData: RegionFirestoreDoc[] = [];

    try {
      // =========================================
      // CONSULTAR DISTRITOS
      // =========================================
      if (tipo === 'ambos' || tipo === 'distritos') {
        console.log('\n📍 CONSULTANDO DISTRITOS...');
        console.log('─'.repeat(60));

        const urlDistritos = `${base_url}/comunes/distritos`;
        const startTime = Date.now();

        const responseDistritos = await axios.get<DistritosResponse>(urlDistritos, {
          timeout: 10000,
        });

        const duration = Date.now() - startTime;
        console.log(`✅ Respuesta exitosa - ${responseDistritos.status} - ${duration}ms`);

        const distritos = responseDistritos.data?.data?.DistritosColeccion?.Distrito || [];

        // Transformar a estructura Firestore
        distritosData = distritos.map(distrito => {
          const comunasArray = normalizeToArray(distrito.Comunas?.Comuna);
          return {
            id: distrito.Numero,
            nombre: `Distrito ${distrito.Numero}`,
            comunas: comunasArray.map(comuna => ({
              id: comuna.Numero,
              nombre: comuna.Nombre
            }))
          };
        }).sort((a, b) => parseInt(a.id) - parseInt(b.id));

        console.log(`📦 Total distritos: ${distritosData.length}`);

        if (show_full_response) {
          console.log('\n🔍 RESPUESTA COMPLETA DE LA API (DISTRITOS):');
          console.log(JSON.stringify(responseDistritos.data, null, 2));
        }
      }

      // =========================================
      // CONSULTAR REGIONES
      // =========================================
      if (tipo === 'ambos' || tipo === 'regiones') {
        console.log('\n🌎 CONSULTANDO REGIONES...');
        console.log('─'.repeat(60));

        const urlRegiones = `${base_url}/comunes/regiones`;
        const startTime = Date.now();

        const responseRegiones = await axios.get<RegionesResponse>(urlRegiones, {
          timeout: 10000,
        });

        const duration = Date.now() - startTime;
        console.log(`✅ Respuesta exitosa - ${responseRegiones.status} - ${duration}ms`);

        const regiones = responseRegiones.data?.data?.RegionesColeccion?.Region || [];

        // Transformar a estructura Firestore
        regionesData = regiones.map(region => {
          const provinciasArray = normalizeToArray(region.Provincias?.Provincia);
          return {
            id: region.Numero,
            nombre: region.Nombre,
            numeroRomano: region.NumeroRomano,
            provincias: provinciasArray.map(provincia => {
              const comunasArray = normalizeToArray(provincia.Comunas?.Comuna);
              return {
                id: provincia.Numero,
                nombre: provincia.Nombre,
                comunas: comunasArray.map(comuna => ({
                  id: comuna.Numero,
                  nombre: comuna.Nombre
                }))
              };
            })
          };
        }).sort((a, b) => parseInt(a.id) - parseInt(b.id));

        console.log(`📦 Total regiones: ${regionesData.length}`);

        if (show_full_response) {
          console.log('\n🔍 RESPUESTA COMPLETA DE LA API (REGIONES):');
          console.log(JSON.stringify(responseRegiones.data, null, 2));
        }
      }

      // =========================================
      // MOSTRAR ESTRUCTURA FIRESTORE - DISTRITOS
      // =========================================
      if (distritosData.length > 0) {
        console.log('\n\n🔥 ESTRUCTURA FIRESTORE - DISTRITOS:');
        console.log('═'.repeat(60));
        console.log('📁 Colección: distritos\n');

        distritosData.forEach((distrito, index) => {
          console.log(`📄 /distritos/${distrito.id}`);
          console.log(`{`);
          console.log(`  id: "${distrito.id}",`);
          console.log(`  nombre: "${distrito.nombre}",`);
          
          if (show_detailed) {
            console.log(`  comunas: [`);
            distrito.comunas.forEach((comuna, cIdx) => {
              const coma = cIdx < distrito.comunas.length - 1 ? ',' : '';
              console.log(`    { id: "${comuna.id}", nombre: "${comuna.nombre}" }${coma}`);
            });
            console.log(`  ]`);
          } else {
            console.log(`  comunas: [${distrito.comunas.length} comunas]`);
          }
          
          console.log(`}`);
          if (index < distritosData.length - 1) {
            console.log('');
          }
        });

        // Estadísticas de distritos
        const totalComunasDistritos = distritosData.reduce((acc, d) => acc + d.comunas.length, 0);
        console.log('\n📊 ESTADÍSTICAS DISTRITOS:');
        console.log('─'.repeat(60));
        console.log(`📄 Total documentos: ${distritosData.length}`);
        console.log(`🏘️ Total comunas: ${totalComunasDistritos}`);
        console.log(`📈 Promedio comunas por distrito: ${(totalComunasDistritos / distritosData.length).toFixed(1)}`);
      }

      // =========================================
      // MOSTRAR ESTRUCTURA FIRESTORE - REGIONES
      // =========================================
      if (regionesData.length > 0) {
        console.log('\n\n🔥 ESTRUCTURA FIRESTORE - REGIONES:');
        console.log('═'.repeat(60));
        console.log('📁 Colección: regiones\n');

        regionesData.forEach((region, index) => {
          console.log(`📄 /regiones/${region.id}`);
          console.log(`{`);
          console.log(`  id: "${region.id}",`);
          console.log(`  nombre: "${region.nombre}",`);
          console.log(`  numeroRomano: "${region.numeroRomano}",`);
          
          if (show_detailed) {
            console.log(`  provincias: [`);
            region.provincias.forEach((provincia, pIdx) => {
              const coma = pIdx < region.provincias.length - 1 ? ',' : '';
              console.log(`    {`);
              console.log(`      id: "${provincia.id}",`);
              console.log(`      nombre: "${provincia.nombre}",`);
              console.log(`      comunas: [`);
              provincia.comunas.forEach((comuna, cIdx) => {
                const comaCom = cIdx < provincia.comunas.length - 1 ? ',' : '';
                console.log(`        { id: "${comuna.id}", nombre: "${comuna.nombre}" }${comaCom}`);
              });
              console.log(`      ]`);
              console.log(`    }${coma}`);
            });
            console.log(`  ]`);
          } else {
            console.log(`  provincias: [${region.provincias.length} provincias]`);
          }
          
          console.log(`}`);
          if (index < regionesData.length - 1) {
            console.log('');
          }
        });

        // Estadísticas de regiones
        const totalProvincias = regionesData.reduce((acc, r) => acc + r.provincias.length, 0);
        const totalComunasRegiones = regionesData.reduce((acc, r) => 
          acc + r.provincias.reduce((pAcc, p) => pAcc + p.comunas.length, 0), 0
        );
        
        console.log('\n📊 ESTADÍSTICAS REGIONES:');
        console.log('─'.repeat(60));
        console.log(`📄 Total documentos: ${regionesData.length}`);
        console.log(`🏛️ Total provincias: ${totalProvincias}`);
        console.log(`🏘️ Total comunas: ${totalComunasRegiones}`);
        console.log(`📈 Promedio provincias por región: ${(totalProvincias / regionesData.length).toFixed(1)}`);
        console.log(`📈 Promedio comunas por región: ${(totalComunasRegiones / regionesData.length).toFixed(1)}`);
      }

      // =========================================
      // GUARDAR EN MEMORIA
      // =========================================
      if (distritosData.length > 0) {
        (global as any).distritosFirestore = distritosData.reduce((acc, d) => {
          acc[d.id] = d;
          return acc;
        }, {} as Record<string, DistritoFirestoreDoc>);
      }

      if (regionesData.length > 0) {
        (global as any).regionesFirestore = regionesData.reduce((acc, r) => {
          acc[r.id] = r;
          return acc;
        }, {} as Record<string, RegionFirestoreDoc>);
      }

      console.log('\n💾 DATOS GUARDADOS EN MEMORIA:');
      console.log('─'.repeat(60));
      if (distritosData.length > 0) {
        console.log('• global.distritosFirestore (documentos formato Firestore)');
      }
      if (regionesData.length > 0) {
        console.log('• global.regionesFirestore (documentos formato Firestore)');
      }

      // =========================================
      // RESUMEN FINAL
      // =========================================
      console.log('\n📋 RESUMEN DE ESTRUCTURAS:');
      console.log('═'.repeat(60));
      
      if (distritosData.length > 0) {
        console.log('\n📍 DISTRITOS:');
        console.log(`📁 Colección: distritos`);
        console.log(`📄 Documentos: ${distritosData.length}`);
        console.log(`🔑 Estructura:`);
        console.log(`   {`);
        console.log(`     id: string,           // Número del distrito`);
        console.log(`     nombre: string,       // "Distrito N"`);
        console.log(`     comunas: [            // Array de comunas`);
        console.log(`       { id: string, nombre: string }`);
        console.log(`     ]`);
        console.log(`   }`);
        console.log(`💡 División político-electoral (para elecciones)`);
      }

      if (regionesData.length > 0) {
        console.log('\n🌎 REGIONES:');
        console.log(`📁 Colección: regiones`);
        console.log(`📄 Documentos: ${regionesData.length}`);
        console.log(`🔑 Estructura:`);
        console.log(`   {`);
        console.log(`     id: string,              // Número de región`);
        console.log(`     nombre: string,          // Nombre de la región`);
        console.log(`     numeroRomano: string,    // Número romano (XIII)`);
        console.log(`     provincias: [            // Array de provincias`);
        console.log(`       {`);
        console.log(`         id: string,`);
        console.log(`         nombre: string,`);
        console.log(`         comunas: [           // Array de comunas`);
        console.log(`           { id: string, nombre: string }`);
        console.log(`         ]`);
        console.log(`       }`);
        console.log(`     ]`);
        console.log(`   }`);
        console.log(`💡 División administrativo-territorial (gobierno)`);
      }

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
        console.log(`🔗 URL base: ${base_url}`);
        console.log('💡 Verifica que el servidor esté corriendo');
      } else {
        console.log(`⚠️ Error: ${error.message}`);
      }

      throw error;
    }
  },
};
