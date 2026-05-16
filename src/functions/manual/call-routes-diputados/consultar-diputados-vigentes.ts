import axios from 'axios';
import { ManualFunction } from '../types';

interface PartidoDto {
  Id: string;
  Nombre: string;
  Alias: string;
}

interface MilitanciaDto {
  FechaInicio: string;
  FechaTermino: string | null;
  Partido: PartidoDto;
}

interface MilitanciasDto {
  Militancia: MilitanciaDto | MilitanciaDto[];
}

interface DiputadoBaseDto {
  Id: string;
  Nombre: string;
  Nombre2: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  FechaNacimiento?: string;
  RUT: string;
  RUTDV: string;
  Sexo: {
    Valor: string;
    _text: string;
  };
  Militancias: MilitanciasDto;
}

interface DiputadoPeriodoDto {
  FechaInicio: string;
  FechaTermino: string | null;
  Diputado: DiputadoBaseDto;
}

interface DiputadosPeriodoColeccionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  DiputadoPeriodo: DiputadoPeriodoDto | DiputadoPeriodoDto[];
}

interface EnvelopePeriodoResponse {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: string;
  data: {
    DiputadosPeriodoColeccion: DiputadosPeriodoColeccionDto;
  };
}

interface DiputadoFirestoreDoc {
  id: string;
  nombreCompleto: string;
  rut: string;
  sexo: string;
  militancias: Array<{
    partidoId: string;
    partidoNombre: string;
    alias: string;
    fechaInicio: string;
    fechaTermino: string | null;
  }>;
}

const normalizeToArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export const consultarDiputadosVigentes: ManualFunction = {
  id: 'consultar-diputados-vigentes',
  name: 'Consultar Diputados Vigentes',
  description: 'Consulta diputados vigentes y muestra estructura tipo Firestore en consola',
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
      type: 'select',
      description: 'Formato de salida',
      required: false,
      options: ['firestore', 'table', 'list'],
      defaultValue: 'firestore',
    },
  ],
  execute: async (params) => {
    const { base_url, show_full_response, format } = params || {};

    console.log('\n👥 CONSULTA DE DIPUTADOS VIGENTES');
    console.log('═'.repeat(60));
    console.log(`🔗 URL Base: ${base_url}`);
    console.log('═'.repeat(60));

    try {
      const url = `${base_url}/diputados/vigentes`;
      const startTime = Date.now();
      const response = await axios.get<EnvelopePeriodoResponse | { DiputadosPeriodoColeccion: DiputadosPeriodoColeccionDto }>(url, {
        timeout: 15000,
      });
      const duration = Date.now() - startTime;
      console.log(`✅ Respuesta exitosa - ${response.status} - ${duration}ms`);

      const root: any = response.data as any;
      const coleccion: DiputadosPeriodoColeccionDto = root?.data?.DiputadosPeriodoColeccion || root?.DiputadosPeriodoColeccion;
      const items = normalizeToArray(coleccion?.DiputadoPeriodo);

      if (!items || items.length === 0) {
        console.log('⚠️ No se encontraron diputados vigentes');
        return;
      }

      const docs: Record<string, DiputadoFirestoreDoc> = {};
      items.forEach((item) => {
        const d = item.Diputado;
        const militancias = normalizeToArray(d.Militancias?.Militancia).map(m => ({
          partidoId: m.Partido.Id,
          partidoNombre: m.Partido.Nombre,
          alias: m.Partido.Alias,
          fechaInicio: m.FechaInicio,
          fechaTermino: m.FechaTermino,
        }));

        const nombreCompleto = `${d.Nombre} ${d.Nombre2} ${d.ApellidoPaterno} ${d.ApellidoMaterno}`.replace(/\s+/g, ' ').trim();
        docs[d.Id] = {
          id: d.Id,
          nombreCompleto,
          rut: `${d.RUT}-${d.RUTDV}`,
          sexo: d.Sexo?._text || d.Sexo?.Valor || '',
          militancias,
        };
      });

      const sortedIds = Object.keys(docs).sort((a, b) => parseInt(a) - parseInt(b));

      if (show_full_response) {
        console.log('\n🔍 RESPUESTA COMPLETA DE LA API:');
        console.log(JSON.stringify(response.data, null, 2));
      }

      if (format === 'table') {
        console.log('\n👥 DIPUTADOS VIGENTES (TABLA):');
        console.log('─'.repeat(60));
        console.log('\n┌──────┬──────────────────────────────────────────────┬──────────────┬──────────┐');
        console.log('│  ID  │ Nombre completo                             │ RUT          │ Sexo     │');
        console.log('├──────┼──────────────────────────────────────────────┼──────────────┼──────────┤');
        sortedIds.forEach(id => {
          const doc = docs[id];
          const idCell = doc.id.padEnd(4, ' ');
          const nombreCell = doc.nombreCompleto.padEnd(46, ' ').substring(0, 46);
          const rutCell = doc.rut.padEnd(12, ' ');
          const sexoCell = doc.sexo.padEnd(8, ' ').substring(0, 8);
          console.log(`│ ${idCell} │ ${nombreCell} │ ${rutCell} │ ${sexoCell} │`);
        });
        console.log('└──────┴──────────────────────────────────────────────┴──────────────┴──────────┘');
      } else if (format === 'list') {
        console.log('\n👥 DIPUTADOS VIGENTES (LISTA):');
        console.log('─'.repeat(60));
        sortedIds.forEach((id, idx) => {
          const doc = docs[id];
          console.log(`\n${idx + 1}. ${doc.nombreCompleto}`);
          console.log(`   📌 ID: ${doc.id}`);
          console.log(`   🧾 RUT: ${doc.rut}`);
          console.log(`   🚻 Sexo: ${doc.sexo}`);
          console.log(`   🏛️ Militancias: ${doc.militancias.length}`);
        });
      } else {
        console.log('\n🔥 ESTRUCTURA FIRESTORE:');
        console.log('─'.repeat(60));
        console.log('Colección: diputados\n');
        sortedIds.forEach((id, index) => {
          const doc = docs[id];
          console.log(`📄 /diputados/${id}`);
          console.log(`{`);
          console.log(`  id: "${doc.id}",`);
          console.log(`  nombreCompleto: "${doc.nombreCompleto}",`);
          console.log(`  rut: "${doc.rut}",`);
          console.log(`  sexo: "${doc.sexo}",`);
          console.log(`  militancias: [`);
          doc.militancias.forEach((m, mIdx) => {
            const comma = mIdx < doc.militancias.length - 1 ? ',' : '';
            console.log(`    { partidoId: "${m.partidoId}", partidoNombre: "${m.partidoNombre}", alias: "${m.alias}", fechaInicio: "${m.fechaInicio}", fechaTermino: ${m.fechaTermino ? '"' + m.fechaTermino + '"' : 'null'} }${comma}`);
          });
          console.log(`  ]`);
          console.log(`}`);
          if (index < sortedIds.length - 1) {
            console.log('');
          }
        });

        console.log('\n📋 RESUMEN:');
        console.log('─'.repeat(60));
        console.log(`📄 Total documentos: ${sortedIds.length}`);
      }

      (global as any).diputadosVigentesFirestore = docs;
      (global as any).diputadosVigentesArray = sortedIds.map(id => docs[id]);
      (global as any).diputadosVigentesRaw = response.data;

      console.log('\n🎯 OBJETO CONSOLIDADO DISPONIBLE:');
      console.log('─'.repeat(60));
      console.log(`- Total documentos: ${sortedIds.length}`);
      console.log(`- Claves: [${sortedIds.slice(0, 10).join(', ')}${sortedIds.length > 10 ? ', ...' : ''}]`);

      console.log('\n💾 DATOS GUARDADOS EN MEMORIA:');
      console.log('─'.repeat(60));
      console.log('• global.diputadosVigentesFirestore (documentos formato Firestore)');
      console.log('• global.diputadosVigentesArray (array de documentos)');
      console.log('• global.diputadosVigentesRaw (respuesta completa de la API)');
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
        console.log(`🔗 URL intentada: ${params?.base_url}/diputados/vigentes`);
      } else {
        console.log(`⚠️ Error: ${error.message}`);
      }
      throw error;
    }
  },
};
