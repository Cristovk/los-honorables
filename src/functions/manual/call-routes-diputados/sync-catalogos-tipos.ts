import axios from 'axios';
import { ManualFunction } from '../types';
import { supabaseAdmin } from '@config/supabase.config';

type AnyObj = Record<string, any>;

// One entry per comun_tipos_* endpoint.
// 'categoria' is the value stored in catalogos.categoria.
const TIPO_ENDPOINTS: Array<{ path: string; categoria: string }> = [
  { path: 'tiposAsistencia',                categoria: 'tipos_asistencia' },
  { path: 'tiposCamaraOrigen',              categoria: 'tipos_camara_origen' },
  { path: 'tiposEstadoSesionComision',       categoria: 'tipos_estado_sesion_comision' },
  { path: 'tiposEstadoSesionSala',           categoria: 'tipos_estado_sesion_sala' },
  { path: 'tiposTitularAsistencia',          categoria: 'tipos_titular_asistencia' },
  { path: 'tiposEstado',                    categoria: 'tipos_estado' },
  { path: 'tiposEstadoAcuerdosResoluciones', categoria: 'tipos_estado_acuerdos_resoluciones' },
  { path: 'tiposIniciativaProyectoLey',      categoria: 'tipos_iniciativa_proyecto_ley' },
  { path: 'tiposSesionSala',                categoria: 'tipos_sesion_sala' },
  { path: 'tiposSesionComision',            categoria: 'tipos_sesion_comision' },
  { path: 'tiposOpcionVoto',                categoria: 'tipos_opcion_voto' },
  { path: 'tiposVotacion',                  categoria: 'tipos_votacion' },
  { path: 'tiposVotacionProyectoLey',        categoria: 'tipos_votacion_proyecto_ley' },
  { path: 'tiposQuorumVotacion',            categoria: 'tipos_quorum_votacion' },
  { path: 'tiposResultadoVotacion',          categoria: 'tipos_resultado_votacion' },
  { path: 'tiposJustificacionesInasistencia', categoria: 'tipos_justificaciones_inasistencia' },
  { path: 'tiposSexo',                      categoria: 'tipos_sexo' },
  { path: 'tiposLegislatura',               categoria: 'tipos_legislatura' },
];

// All comun_tipos_* responses share the same shape:
//   { *Coleccion: { xmlns, "xmlns:xsi", "xmlns:xsd", Tipo*: { "0": "name", "1": "name" } } }
// This extractor finds the *Coleccion key and then the first non-xmlns key inside it.
function extractKVMap(data: AnyObj): Record<string, string> | null {
  const root: AnyObj = data?.data ?? data;

  const colKey = Object.keys(root).find(k => k.endsWith('Coleccion'));
  if (!colKey) return null;

  const coleccion = root[colKey];
  if (!coleccion || typeof coleccion !== 'object') return null;

  const mapKey = Object.keys(coleccion).find(k => !k.startsWith('xmlns'));
  if (!mapKey) return null;

  const map = coleccion[mapKey];
  // Must be a plain key-value object, not an array
  if (!map || typeof map !== 'object' || Array.isArray(map)) return null;

  return map as Record<string, string>;
}

export const syncCatalogosTipos: ManualFunction = {
  id: 'sync-catalogos-tipos',
  name: 'Sincronizar catálogos de tipos a Supabase',
  description: 'Llama los 18 endpoints comun_tipos_* y guarda todos en la tabla catalogos',
  category: 'diputados',
  inputs: [
    { name: 'base_url', type: 'string', description: 'URL base del servidor', required: false, defaultValue: 'http://localhost:6000' },
  ],
  execute: async (params?: AnyObj) => {
    const baseUrl: string = params?.base_url || 'http://localhost:6000';
    const admin = supabaseAdmin as any;

    let totalRows = 0;
    const errores: string[] = [];

    console.log('SYNC CATÁLOGOS DE TIPOS');
    console.log('─'.repeat(60));

    for (const { path, categoria } of TIPO_ENDPOINTS) {
      try {
        const resp = await axios.get(`${baseUrl}/comunes/${path}`, { timeout: 15000 });
        const kvMap = extractKVMap(resp.data);

        if (!kvMap) {
          errores.push(`${path}: no se pudo extraer el mapa clave-valor`);
          console.log(`  ⚠ ${path} → sin datos`);
          continue;
        }

        const rows = Object.entries(kvMap)
          .filter(([, v]) => typeof v === 'string' && v.trim() !== '')
          .map(([codigo, nombre]) => ({ categoria, codigo, nombre, updated_at: new Date().toISOString() }));

        if (rows.length === 0) {
          console.log(`  ⚠ ${path} → mapa vacío`);
          continue;
        }

        const { error } = await admin
          .from('catalogos')
          .upsert(rows, { onConflict: 'categoria,codigo' });

        if (error) {
          errores.push(`${path}: ${error.message}`);
          console.log(`  ✗ ${categoria} → ${error.message}`);
        } else {
          totalRows += rows.length;
          console.log(`  ✓ ${categoria} → ${rows.length} códigos`);
        }
      } catch (e: any) {
        errores.push(`${path}: ${e.message}`);
        console.log(`  ✗ ${path} → ${e.message}`);
      }
    }

    console.log('─'.repeat(60));
    console.log(`Exitosos: ${TIPO_ENDPOINTS.length - errores.length}/${TIPO_ENDPOINTS.length}`);
    console.log(`Total filas upserted: ${totalRows}`);

    if (errores.length) {
      console.log('Errores:');
      errores.forEach(e => console.log(`  · ${e}`));
    }
  },
};

export default syncCatalogosTipos;
