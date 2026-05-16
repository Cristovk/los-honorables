import axios from 'axios';
import { ManualFunction } from '../types';

type AnyObj = Record<string, any>;

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const consultarComunesTodos: ManualFunction = {
  id: 'consultar-comunes-todos',
  name: 'Consultar todos los endpoints de Comunes',
  description: 'Llama todos los endpoints bajo /comunes y muestra un resumen',
  category: 'diputados',
  inputs: [
    { name: 'base_url', type: 'string', description: 'URL base del servidor', required: false, defaultValue: 'http://localhost:6000' },
    { name: 'show_full_response', type: 'boolean', description: 'Mostrar respuesta completa', required: false, defaultValue: false },
    { name: 'concurrency', type: 'number', description: 'Concurrencia de llamadas', required: false, defaultValue: 5 },
    { name: 'throttle_ms', type: 'number', description: 'Pausa entre lotes (ms)', required: false, defaultValue: 200 }
  ],
  execute: async (params?: AnyObj) => {
    const baseUrl: string = params?.base_url || 'http://localhost:6000';
    const showFull: boolean = !!params?.show_full_response;
    const concurrency: number = Math.max(1, params?.concurrency ?? 5);
    const throttleMs: number = Math.max(0, params?.throttle_ms ?? 200);

    const endpoints = [
      'comunas',
      'distritos',
      'provincias',
      'regiones',
      'ministerios',
      'tiposCamaraOrigen',
      'tiposAsistencia',
      'tiposEstadoSesionComision',
      'tiposEstadoSesionSala',
      'tiposTitularAsistencia',
      'tiposEstado',
      'tiposEstadoAcuerdosResoluciones',
      'tiposIniciativaProyectoLey',
      'tiposSesionSala',
      'tiposSesionComision',
      'tiposOpcionVoto',
      'tiposVotacion',
      'tiposVotacionProyectoLey',
      'tiposQuorumVotacion',
      'tiposResultadoVotacion',
      'tiposJustificacionesInasistencia',
      'tiposLegislatura'
    ];

    console.log('\n📂 COMUNES: CONSULTA DE ENDPOINTS');
    console.log('═'.repeat(60));
    console.log(`Base URL: ${baseUrl}`);
    console.log(`Total endpoints: ${endpoints.length}`);

    const results: Record<string, any> = {};
    const errors: { endpoint: string; error: string; status?: number }[] = [];

    let index = 0;
    while (index < endpoints.length) {
      const batch = endpoints.slice(index, index + concurrency);
      await Promise.all(
        batch.map(async (ep) => {
          const url = `${baseUrl}/comunes/${ep}`;
          const start = Date.now();
          try {
            const resp = await axios.get(url, { timeout: 15000 });
            const duration = Date.now() - start;
            results[ep] = resp.data;
            console.log(`✅ ${ep} (${resp.status}) - ${duration}ms`);
          } catch (e: any) {
            const msg = e?.response?.data?.message || e?.message || 'Error';
            const status = e?.response?.status;
            errors.push({ endpoint: ep, error: msg, status });
            console.log(`❌ ${ep} - ${status || 0} - ${msg}`);
          }
        })
      );
      index += concurrency;
      if (index < endpoints.length && throttleMs > 0) await sleep(throttleMs);
    }

    console.log('\n📊 RESUMEN');
    console.log('─'.repeat(60));
    console.log(`Exitosos: ${Object.keys(results).length}/${endpoints.length}`);
    console.log(`Errores: ${errors.length}/${endpoints.length}`);
    if (errors.length) {
      errors.forEach((er, i) => console.log(`${i + 1}. ${er.endpoint} - ${er.status || 0} - ${er.error}`));
    }

    if (showFull) {
      console.log('\n🔍 RESPUESTAS COMPLETAS');
      console.log(JSON.stringify(results, null, 2));
    }

    (global as any).comunesResultados = results;
    (global as any).comunesErrores = errors;
  }
};

export default consultarComunesTodos;