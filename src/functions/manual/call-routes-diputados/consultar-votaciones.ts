import axios from 'axios';
import { ManualFunction } from '../types';
import { getYearsDescending } from '@utils/dateFormatt.utils';

type AnyObj = Record<string, any>;

const toArray = <T>(v: T | T[] | undefined): T[] => (v ? (Array.isArray(v) ? v : [v]) : []);

const extractBoletin = (descripcion: string): string | null => {
  const nMatch = descripcion.match(/Bolet[íi]n\s*N[°º]\s*([\d\-]+)/i);
  if (nMatch && nMatch[1]) return nMatch[1].trim();
  const fallback = descripcion.match(/(\d{4,6}-\d{2})/);
  return fallback ? fallback[1] : null;
};

export const consultarVotaciones: ManualFunction = {
  id: 'consultar-votaciones',
  name: 'Consultar Votaciones 1990-2025',
  description: 'Itera años, consulta votaciones, detalle e historial por boletín y estructura resultados',
  category: 'diputados',
  inputs: [
    { name: 'base_url', type: 'string', description: 'URL base del servidor', required: false, defaultValue: 'http://localhost:6000' },
    { name: 'start_year', type: 'number', description: 'Año de inicio', required: false, defaultValue: 2025 },
    { name: 'end_year', type: 'number', description: 'Año final', required: false, defaultValue: 1990 },
    { name: 'limit_years', type: 'number', description: 'Limitar cantidad de años', required: false, defaultValue: 0 },
    { name: 'concurrency', type: 'number', description: 'Concurrencia por año', required: false, defaultValue: 5 },
    { name: 'show_full_response', type: 'boolean', description: 'Mostrar respuestas completas', required: false, defaultValue: false },
  ],
  execute: async (params?: AnyObj) => {
    const baseUrl: string = params?.base_url || 'http://localhost:6000';
    const startYear: number = params?.start_year ?? 2025;
    const endYear: number = params?.end_year ?? 1990;
    const limitYears: number = params?.limit_years ?? 0;
    const concurrency: number = Math.max(1, params?.concurrency ?? 5);
    const showFull: boolean = !!params?.show_full_response;

    const years = getYearsDescending(startYear, endYear);
    const yearsSlice = limitYears > 0 ? years.slice(0, limitYears) : years;

    const votacionesXYear: Record<string, AnyObj[]> = {};
    const detalleVotaciones: { detalleVotacion: Record<string, AnyObj>; votacionBoletin: Record<string, AnyObj> } = {
      detalleVotacion: {},
      votacionBoletin: {},
    };

    for (const year of yearsSlice) {
      try {
        const urlAnno = `${baseUrl}/votaciones/votacionesXAnno`;
        const respAnno = await axios.get(urlAnno, { params: { year } });
        const root: AnyObj = respAnno.data || {};
        const items = toArray(root?.VotacionesColeccion?.Votacion);
        votacionesXYear[String(year)] = items;

        console.log(`Año ${year}: ${items.length} votaciones`);

        let index = 0;
        while (index < items.length) {
          const batch = items.slice(index, index + concurrency);
          await Promise.all(
            batch.map(async (v) => {
              const id = v?.Id;
              if (!id) return;
              const urlDetalle = `${baseUrl}/votaciones/detalleVotacion`;
              const respDetalle = await axios.get(urlDetalle, { params: { id } });
              const detalle = respDetalle.data?.Votacion || respDetalle.data;
              detalleVotaciones.detalleVotacion[id] = detalle;

              const descr: string = detalle?.Descripcion || v?.Descripcion || '';
              const boletin = extractBoletin(descr);
              if (boletin) {
                const urlProyecto = `${baseUrl}/votaciones/votacionesXProyectoLey`;
                const respProyecto = await axios.get(urlProyecto, { params: { id: boletin } });
                const proyecto = respProyecto.data?.ProyectoLey || respProyecto.data;
                detalleVotaciones.votacionBoletin[boletin] = proyecto;
              }
            })
          );
          index += concurrency;
        }
      } catch (e: any) {
        console.log(`Error año ${year}: ${e?.message || e}`);
      }
    }

    const collections = {
      votacionesXYear,
      detalleVotaciones,
    };

    if (showFull) {
      console.log(JSON.stringify(collections, null, 2));
    } else {
      const yearsCount = Object.keys(votacionesXYear).length;
      console.log(`Años procesados: ${yearsCount}`);
      const sampleYear = Object.keys(votacionesXYear)[0];
      if (sampleYear) console.log(`Primer año ${sampleYear}: ${votacionesXYear[sampleYear].length} votaciones`);
      const detalleCount = Object.keys(detalleVotaciones.detalleVotacion).length;
      const boletinCount = Object.keys(detalleVotaciones.votacionBoletin).length;
      console.log(`Detalles: ${detalleCount} | Proyectos por boletín: ${boletinCount}`);
    }

    (global as any).votacionesXYear = votacionesXYear;
    (global as any).detalleVotaciones = detalleVotaciones;
  },
};

export default consultarVotaciones;
