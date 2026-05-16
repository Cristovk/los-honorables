import axios from 'axios';
import { ManualFunction } from '../types';
import { isAfterChileNow, normalizeIsoNoTz } from '@utils/dateFormatt.utils';

interface MilitanciaDto {
  FechaInicio: string;
  FechaTermino: string | { [k: string]: string } | null;
  Partido: { Id: string; Nombre: string; Alias: string };
}

interface MilitanciasDto { Militancia: MilitanciaDto | MilitanciaDto[] }

interface DiputadoBaseDto {
  Id: string;
  Nombre: string;
  Nombre2: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  FechaNacimiento?: string;
  RUT: string;
  RUTDV: string;
  Sexo?: any;
  Militancias: MilitanciasDto;
}

interface VigenteItemDto {
  FechaInicio: string;
  FechaTermino?: any;
  Diputado: DiputadoBaseDto;
}

interface DiputadosPeriodoColeccionDto { DiputadoPeriodo: VigenteItemDto | VigenteItemDto[] }
interface EnvelopePeriodoResponse { data?: { DiputadosPeriodoColeccion: DiputadosPeriodoColeccionDto } }

interface DiputadosColeccionDto { Diputado: DiputadoBaseDto | DiputadoBaseDto[] }
interface EnvelopeListaResponse { data?: { DiputadosColeccion: DiputadosColeccionDto } }

const normalizeToArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const isXsiNilTrue = (obj: any): boolean => {
  if (!obj || typeof obj !== 'object') return false;
  const keys = Object.keys(obj);
  return keys.some(k => k.toLowerCase().includes('xsi:nil') && String(obj[k]).toLowerCase() === 'true');
};

export const consultarDiputadosVigenciaLista: ManualFunction = {
  id: 'consultar-diputados-vigencia-lista',
  name: 'Consultar Vigentes y Lista con Vigencia',
  description: 'Consulta /vigentes y /lista, cruza por Id y agrega campos de vigencia',
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
      description: '¿Mostrar respuestas completas?',
      required: false,
      defaultValue: false,
    },
  ],
  execute: async (params) => {
    const { base_url, show_full_response } = params || {};

    console.log('\n🔗 CONSULTA DE VIGENTES Y LISTA (DIPUTADOS)');
    console.log('═'.repeat(60));
    console.log(`Base URL: ${base_url}`);
    console.log('═'.repeat(60));

    try {
      const urlVigentes = `${base_url}/diputados/vigentes`;
      const urlLista = `${base_url}/diputados/lista`;

      console.log('\n➡️ Llamando /diputados/vigentes ...');
      const resVigentes = await axios.get<EnvelopePeriodoResponse | { DiputadosPeriodoColeccion: DiputadosPeriodoColeccionDto }>(urlVigentes, { timeout: 15000 });
      const vigRoot: any = resVigentes.data;
      const vigColeccion: DiputadosPeriodoColeccionDto = vigRoot?.data?.DiputadosPeriodoColeccion || vigRoot?.DiputadosPeriodoColeccion;
      const vigentes = normalizeToArray(vigColeccion?.DiputadoPeriodo);

      if (show_full_response) {
        console.log('\n📦 Respuesta /vigentes (completa):');
        console.log(JSON.stringify(resVigentes.data, null, 2));
      }

      const seleccionVigentes = vigentes.filter(item => isXsiNilTrue(item.FechaTermino));
      console.log(`\n✅ Vigentes detectados: ${seleccionVigentes.length}`);

      const idsYVigencias = seleccionVigentes.map(item => {
        const diputadoId = item.Diputado.Id;
        const terminoVigencia = normalizeIsoNoTz(item.FechaInicio);
        const militancias = normalizeToArray(item.Diputado.Militancias?.Militancia);
        const militanciaMatch = militancias.find(m => typeof m.FechaTermino === 'string' && normalizeIsoNoTz(m.FechaTermino) === terminoVigencia);
        const inicioVigencia = militanciaMatch ? normalizeIsoNoTz(militanciaMatch.FechaInicio) : undefined;
        return { id: diputadoId, inicioVigencia, terminoVigencia };
      }).filter(x => x.inicioVigencia);

      console.log(`🧩 Ids con vigencia resuelta: ${idsYVigencias.length}`);

      console.log('\n➡️ Llamando /diputados/lista ...');
      const resLista = await axios.get<EnvelopeListaResponse | { DiputadosColeccion: DiputadosColeccionDto }>(urlLista, { timeout: 20000 });
      const listRoot: any = resLista.data;
      const listColeccion: DiputadosColeccionDto = listRoot?.data?.DiputadosColeccion || listRoot?.DiputadosColeccion;
      const lista = normalizeToArray(listColeccion?.Diputado);

      if (show_full_response) {
        console.log('\n📦 Respuesta /lista (completa):');
        console.log(JSON.stringify(resLista.data, null, 2));
      }

      const idsMap: Record<string, { inicio: string; termino: string }> = {};
      idsYVigencias.forEach(v => { idsMap[v.id] = { inicio: v.inicioVigencia!, termino: v.terminoVigencia! }; });

      const docs = lista.map(d => {
        const id = d.Id;
        const nombreCompleto = `${d.Nombre} ${d.Nombre2} ${d.ApellidoPaterno} ${d.ApellidoMaterno}`.replace(/\s+/g, ' ').trim();
        const rut = `${d.RUT}-${d.RUTDV}`;
        const genero = (() => {
          if (!d.Sexo) return '';
          if (typeof d.Sexo === 'object') {
            const vals = Object.values(d.Sexo).filter(v => typeof v === 'string');
            if (vals.length > 0) return String(vals[0]);
          }
          return '';
        })();
        const militanciasSrc = normalizeToArray(d.Militancias?.Militancia);
        const militancias = militanciasSrc.map(m => ({
          fechaInicio: normalizeIsoNoTz(typeof m.FechaInicio === 'string' ? m.FechaInicio : String(m.FechaInicio)),
          fechaTermino: typeof m.FechaTermino === 'string' ? normalizeIsoNoTz(m.FechaTermino) : null,
          partido: { id: m.Partido.Id, nombre: m.Partido.Nombre, alias: m.Partido.Alias },
        }));

        const v = idsMap[id];
        const inicioVigencia = v ? v.inicio : null;
        const terminoVigencia = v ? v.termino : null;
        const vigente = terminoVigencia ? isAfterChileNow(terminoVigencia) : false;

        return {
          id,
          nombreCompleto,
          nombre: d.Nombre,
          segundoNombre: d.Nombre2,
          primerApellido: d.ApellidoPaterno,
          segundoApellido: d.ApellidoMaterno,
          fechaNacimiento: d.FechaNacimiento || '',
          genero,
          rut,
          inicioVigencia,
          terminoVigencia,
          vigente,
          militancias,
        };
      });

      console.log('\n🔥 ESTRUCTURA FIRESTORE - DIPUTADOS');
      console.log('═'.repeat(60));
      console.log('📁 Colección: diputados\n');
      docs.forEach((doc, index) => {
        console.log(`📄 /diputados/${doc.id}`);
        console.log(`{`);
        console.log(`  id: "${doc.id}",`);
        console.log(`  nombreCompleto: "${doc.nombreCompleto}",`);
        console.log(`  nombre: "${doc.nombre}",`);
        console.log(`  segundoNombre: "${doc.segundoNombre}",`);
        console.log(`  primerApellido: "${doc.primerApellido}",`);
        console.log(`  segundoApellido: "${doc.segundoApellido}",`);
        console.log(`  fechaNacimiento: "${doc.fechaNacimiento}",`);
        console.log(`  genero: "${doc.genero}",`);
        console.log(`  rut: "${doc.rut}",`);
        console.log(`  inicioVigencia: ${doc.inicioVigencia ? '"' + doc.inicioVigencia + '"' : 'null'},`);
        console.log(`  terminoVigencia: ${doc.terminoVigencia ? '"' + doc.terminoVigencia + '"' : 'null'},`);
        console.log(`  vigente: ${doc.vigente},`);
        console.log(`  militancias: [`);
        doc.militancias.forEach((m, mIdx) => {
          const comma = mIdx < doc.militancias.length - 1 ? ',' : '';
          console.log(`    { fechaInicio: "${m.fechaInicio}", fechaTermino: ${m.fechaTermino ? '"' + m.fechaTermino + '"' : 'null'}, partido: { id: "${m.partido.id}", nombre: "${m.partido.nombre}", alias: "${m.partido.alias}" } }${comma}`);
        });
        console.log(`  ]`);
        console.log(`}`);
        if (index < docs.length - 1) console.log('');
      });

      const consolidated = docs.reduce((acc, d) => { acc[d.id] = d; return acc; }, {} as Record<string, any>);
      (global as any).diputadosVigencia = consolidated;
      (global as any).diputadosVigenciaArray = docs;
      (global as any).diputadosVigentesResponse = resVigentes.data;
      (global as any).diputadosListaResponse = resLista.data;
      (global as any).diputadosVigentesSeleccion = seleccionVigentes;
      (global as any).diputadosIdsVigencias = idsYVigencias;

      console.log('\n🎯 OBJETO CONSOLIDADO DISPONIBLE:');
      console.log('─'.repeat(60));
      console.log(`- Total documentos: ${docs.length}`);
      console.log(`- Claves: [${docs.slice(0, 10).map(d => d.id).join(', ')}${docs.length > 10 ? ', ...' : ''}]`);
      console.log('\n💾 DATOS GUARDADOS EN MEMORIA:');
      console.log('─'.repeat(60));
      console.log('• global.diputadosVigencia (documentos formato Firestore)');
      console.log('• global.diputadosVigenciaArray (array de documentos)');
      console.log('• global.diputadosVigentesResponse (respuesta completa /vigentes)');
      console.log('• global.diputadosListaResponse (respuesta completa /lista)');
      console.log('• global.diputadosVigentesSeleccion (items vigentes filtrados)');
      console.log('• global.diputadosIdsVigencias (ids con fechas inicio/termino)');
      console.log('\n✅ Consulta completada exitosamente');
      console.log('═'.repeat(60));
    } catch (error: any) {
      console.log('\n❌ ERROR EN LA CONSULTA');
      console.log('─'.repeat(60));
      if (error.response) {
        console.log(`📡 Status: ${error.response.status}`);
        console.log(`📄 Mensaje: ${error.response.data?.message || 'Sin mensaje'}`);
        console.log(`🔗 URL: ${error.config?.url || 'N/A'}`);
      } else if (error.request) {
        console.log('🚫 No se recibió respuesta del servidor');
        console.log(`🔗 URL base: ${base_url}`);
      } else {
        console.log(`⚠️ Error: ${error.message}`);
      }
      throw error;
    }
  },
};
