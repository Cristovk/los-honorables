import axios from 'axios';
import { ManualFunction } from '../types';
import { SesionesXAnnoDto, SesionResumenDto } from '@interface/external/camara-diputados/sala/sesiones-x-anno.dto';
import { SesionAsistenciaDto, AsistenciaDto, DiputadoDto } from '@interface/external/camara-diputados/sala/sesion-asistencia.dto';

type AnyObj = Record<string, any>;

const toArray = <T>(v: T | T[] | undefined): T[] => (v ? (Array.isArray(v) ? v : [v]) : []);

// Extrae texto del estado considerando transformaciones del parser
const getEstadoText = (estado: any): string => {
  if (!estado) return '';
  if (typeof estado === 'string') return estado.trim();
  if (typeof estado._ === 'string') return estado._.trim();
  const values = Object.values(estado).filter((v) => typeof v === 'string');
  if (values.length > 0) return String(values[0]).trim();
  return '';
};

// Extrae el código de TipoAsistencia: "0" | "1" | "2"
const getTipoAsistenciaCode = (tipo: any): string => {
  if (!tipo) return '';
  if (typeof tipo === 'string') {
    const m = tipo.match(/[0-2]/);
    return m ? m[0] : '';
  }
  if (typeof tipo.Valor === 'string') return tipo.Valor;
  if (tipo.$ && typeof tipo.$.Valor === 'string') return tipo.$.Valor;
  const keys = Object.keys(tipo).filter((k) => /^(0|1|2)$/.test(k));
  if (keys.length > 0) return keys[0];
  return '';
};

const validateYear = (year: number): number => {
  if (!Number.isInteger(year)) throw new Error('El año debe ser número entero');
  if (year < 1990 || year > 2025) throw new Error('Año fuera de límites [1990, 2025]');
  return year;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Ejecuta análisis de asistencia del diputado 857 en sesiones de Sala
 * - Solicita rango de años y consulta sesiones por año
 * - Filtra sesiones celebradas y obtiene asistencia por sesión
 * - Clasifica asistencia del diputado en Asiste/Justificado/No Asiste
 * - Calcula porcentajes y construye resumen
 *
 * Comentarios explicativos incluidos para facilitar depuración y mantenimiento.
 */
export const consultarAsistenciaDiputadoSala: ManualFunction = {
  id: 'consultar-asistencia-diputado-sala',
  name: 'Asistencia Diputado Sala (1990-2025)',
  description: 'Analiza asistencia del diputado 857 en sesiones de Sala por rango de años',
  category: 'diputados',
  inputs: [
    { name: 'base_url', type: 'string', description: 'URL base del servidor', required: false, defaultValue: 'http://localhost:6000' },
    { name: 'start_year', type: 'number', description: 'Año de inicio (número)', required: true },
    { name: 'end_year', type: 'number', description: 'Año final (número)', required: true },
    { name: 'diputado_id', type: 'number', description: 'ID de Diputado', required: true },
    { name: 'show_full_response', type: 'boolean', description: 'Mostrar estructura final completa', required: false, defaultValue: false },
  ],
  execute: async (params?: AnyObj) => {
    const baseUrl: string = params?.base_url || 'http://localhost:6000';
    const startYearInput: number = params?.start_year;
    const endYearInput: number = params?.end_year;
    const diputadoIdInput: number = params?.diputado_id;
    const showFull: boolean = !!params?.show_full_response;

    console.log('\n🧮 ANÁLISIS DE ASISTENCIA - SALA');
    console.log('─'.repeat(60));
    console.log(`🔗 Base URL: ${baseUrl}`);
    console.log(`📅 Inicio: ${startYearInput} | Fin: ${endYearInput}`);
    console.log(`🆔 Diputado: ${diputadoIdInput}`);
    console.log('─'.repeat(60));

    let startYear = 0;
    let endYear = 0;
    try {
      startYear = validateYear(Number(startYearInput));
      endYear = validateYear(Number(endYearInput));
      if (startYear > endYear) [startYear, endYear] = [endYear, startYear];
    } catch (e: any) {
      console.log(`❌ Error en años: ${e.message}`);
      throw e;
    }

    const targetDiputadoId = String(diputadoIdInput);
    let diputadoInfo: DiputadoDto | null = null;
    let totalCelebradas = 0;
    let asiste = 0;
    let justificado = 0;
    let noAsiste = 0;

    for (let year = startYear; year <= endYear; year++) {
      try {
        const urlSesiones = `${baseUrl}/servicioSala/sesionesXAnno`;
        const respSesiones = await axios.get<SesionesXAnnoDto | { SesionesSalaColeccion: any }>(urlSesiones, { params: { year: String(year) }, timeout: 20000 });
        await sleep(5000);
        const sesionesRoot: any = respSesiones.data as any;
        const coleccion = sesionesRoot?.SesionesSalaColeccion || sesionesRoot?.data?.SesionesSalaColeccion;
        const sesiones: SesionResumenDto[] = toArray<SesionResumenDto>(coleccion?.Sesion);

        console.log(`Año ${year}: ${sesiones.length} sesiones`);

        const celebradas = sesiones.filter((s) => getEstadoText(s?.Estado).toLowerCase() === 'celebrada');
        console.log(`Año ${year}: ${celebradas.length} celebradas`);

        for (const sesion of celebradas) {
          totalCelebradas += 1;
          const sesionId = sesion?.Id;
          if (!sesionId) continue;
          try {
            const urlAsistencia = `${baseUrl}/servicioSala/sesionAsistencia`;
            const respAsistencia = await axios.get<SesionAsistenciaDto | { SesionSala: any }>(urlAsistencia, { params: { id: String(sesionId) }, timeout: 20000 });
            await sleep(5000);
            const asistenciaRoot: any = respAsistencia.data as any;
            const sesionSala = asistenciaRoot?.SesionSala || asistenciaRoot?.data?.SesionSala;
            const listado = sesionSala?.ListadoAsistencia;
            const registros = toArray<AsistenciaDto>(listado?.Asistencia);

            const registroDip = registros.find((r) => r?.Diputado?.Id === targetDiputadoId);
            if (!registroDip) {
              console.log(`⚠️ Sesión ${sesionId}: diputado ${targetDiputadoId} no encontrado en asistencia`);
              continue;
            }

            if (!diputadoInfo && registroDip.Diputado) {
              diputadoInfo = registroDip.Diputado;
            }

            const code = getTipoAsistenciaCode(registroDip.TipoAsistencia);
            if (code === '1') asiste += 1;
            else if (code === '2') justificado += 1;
            else if (code === '0') noAsiste += 1;
          } catch (err: any) {
            console.log(`❌ Error asistencia sesión ${sesionId}: ${err?.message || err}`);
          }
        }
      } catch (e: any) {
        console.log(`❌ Error consultas año ${year}: ${e?.message || e}`);
      }
    }

    const denom = totalCelebradas || 1;
    const resultado = {
      xmlns: 'http://opendata.camara.cl/camaradiputados/v1',
      Diputado: {
        Id: targetDiputadoId,
        Nombre: diputadoInfo?.Nombre || 'N/D',
        ApellidoPaterno: diputadoInfo?.ApellidoPaterno || 'N/D',
        ApellidoMaterno: diputadoInfo?.ApellidoMaterno || 'N/D',
      },
      Estadisticas: {
        TotalSesiones: totalCelebradas,
        PorcentajeAsistencia: {
          Asiste: Number(((asiste / denom) * 100).toFixed(2)),
          Justificado: Number(((justificado / denom) * 100).toFixed(2)),
          NoAsiste: Number(((noAsiste / denom) * 100).toFixed(2)),
        },
      },
    };

    console.log('\n📊 RESUMEN DE ASISTENCIA');
    console.log('─'.repeat(60));
    console.log(`Diputado ID: ${resultado.Diputado.Id}`);
    console.log(`Nombre: ${resultado.Diputado.Nombre} ${resultado.Diputado.ApellidoPaterno} ${resultado.Diputado.ApellidoMaterno}`);
    console.log(`Total sesiones celebradas: ${resultado.Estadisticas.TotalSesiones}`);
    console.log(`Asiste: ${resultado.Estadisticas.PorcentajeAsistencia.Asiste}% | Justificado: ${resultado.Estadisticas.PorcentajeAsistencia.Justificado}% | No Asiste: ${resultado.Estadisticas.PorcentajeAsistencia.NoAsiste}%`);

    if (showFull) {
      console.log('\n🔍 ESTRUCTURA COMPLETA:');
      console.log(JSON.stringify(resultado, null, 2));
    }

    (global as any).asistenciaDiputadoSalaResumen = resultado;
  },
};

export default consultarAsistenciaDiputadoSala;