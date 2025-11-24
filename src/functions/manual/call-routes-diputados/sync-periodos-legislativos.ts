import axios from 'axios';
import { ManualFunction } from '../types';
import { supabaseAdmin } from '@config/supabase.config';

type AnyObj = Record<string, any>;

const toArray = <T>(v: T | T[] | undefined | null): T[] => (v ? (Array.isArray(v) ? v : [v]) : []);
const firstEntry = (obj: Record<string, string> | undefined | null): { key: string | null; value: string | null } => {
  if (!obj) return { key: null, value: null };
  const k = Object.keys(obj)[0];
  return k ? { key: k, value: obj[k] } : { key: null, value: null };
};
const toDateOnly = (iso: string | undefined | null): string | null => {
  if (!iso) return null;
  const i = iso.indexOf('T');
  return i > 0 ? iso.substring(0, i) : iso;
};
const chunk = <T>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};
const mapTipoClase = (valor: string | number | null | undefined): string => {
  const v = valor == null ? null : String(valor);
  if (v === '1') return 'Ordinaria';
  if (v === '2') return 'Extraordinaria';
  return '-';
};

export const syncPeriodosLegislativos: ManualFunction = {
  id: 'sync-periodos-legislativos',
  name: 'Sincronizar Períodos y Legislaturas a Supabase',
  description: 'Consulta /periodosLegislativos y guarda en periodos_legislativos y legislaturas',
  category: 'diputados',
  inputs: [
    { name: 'base_url', type: 'string', description: 'URL base del servidor', required: false, defaultValue: 'http://localhost:6000' },
    { name: 'batch_size', type: 'number', description: 'Tamaño de lote para upsert', required: false, defaultValue: 200 }
  ],
  execute: async (params?: AnyObj) => {
    const baseUrl: string = params?.base_url || 'http://localhost:6000';
    const batchSize: number = Math.max(1, params?.batch_size ?? 200);

    const url = `${baseUrl}/periodosLegislativos/periodosLegislativos`;
    const resp = await axios.get(url);
    const root: AnyObj = resp.data || {};
    const periodos: AnyObj[] = toArray(root?.PeriodosLegislativosColeccion?.PeriodoLegislativo);

    const periodosRecords = periodos.map((p) => ({
      id: String(p?.Id),
      nombre: String(p?.Nombre || ''),
      fecha_inicio: toDateOnly(p?.FechaInicio),
      fecha_termino: toDateOnly(p?.FechaTermino),
      raw_data: p,
    }));

    const legislaturasRecords: AnyObj[] = [];
    for (const p of periodos) {
      const periodoId = String(p?.Id);
      const legs = toArray<AnyObj>(p?.Legislaturas?.Legislatura);
      for (const l of legs) {
        const tipo = firstEntry(l?.Tipo as Record<string, string> | undefined);
        legislaturasRecords.push({
          id: String(l?.Id),
          periodo_id: periodoId,
          numero: String(l?.Numero || ''),
          fecha_inicio: toDateOnly(l?.FechaInicio),
          fecha_termino: toDateOnly(l?.FechaTermino),
          tipo_valor: tipo.key,
          tipo_texto: tipo.value,
          tipo_clase: mapTipoClase(tipo.key),
          raw_data: l,
        });
      }
    }

    const admin: any = supabaseAdmin as any;

    let insertedPeriodos = 0;
    for (const part of chunk(periodosRecords, batchSize)) {
      const { error, count } = await admin.from('periodos_legislativos').upsert(part, { onConflict: 'id', count: 'exact' });
      if (error) throw new Error(`Error upsert periodos_legislativos: ${error.message}`);
      insertedPeriodos += count || part.length;
    }

    let insertedLegislaturas = 0;
    for (const part of chunk(legislaturasRecords, batchSize)) {
      const { error, count } = await admin.from('legislaturas').upsert(part, { onConflict: 'id', count: 'exact' });
      if (error) throw new Error(`Error upsert legislaturas: ${error.message}`);
      insertedLegislaturas += count || part.length;
    }

    await admin.from('legislaturas').update({ tipo_clase: 'Ordinaria' }).eq('tipo_valor', '1').is('tipo_clase', null);
    await admin.from('legislaturas').update({ tipo_clase: 'Extraordinaria' }).eq('tipo_valor', '2').is('tipo_clase', null);
    await admin.from('legislaturas').update({ tipo_clase: '-' }).eq('tipo_valor', '3').is('tipo_clase', null);

    const { count: totalPeriodos } = await admin.from('periodos_legislativos').select('id', { count: 'exact', head: true });
    const { count: totalLegislaturas } = await admin.from('legislaturas').select('id', { count: 'exact', head: true });

    console.log('SYNC PERIODOS LEGISLATIVOS');
    console.log(`Periodos recibidos: ${periodosRecords.length}`);
    console.log(`Legislaturas recibidas: ${legislaturasRecords.length}`);
    console.log(`Upsert periodos: ${insertedPeriodos}`);
    console.log(`Upsert legislaturas: ${insertedLegislaturas}`);
    console.log(`Total periodos en DB: ${typeof totalPeriodos === 'number' ? totalPeriodos : 'N/A'}`);
    console.log(`Total legislaturas en DB: ${typeof totalLegislaturas === 'number' ? totalLegislaturas : 'N/A'}`);

    (global as any).periodosLegislativos = periodosRecords;
    (global as any).legislaturas = legislaturasRecords;
  }
};

export default syncPeriodosLegislativos;