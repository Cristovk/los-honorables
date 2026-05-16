import axios from 'axios';
import { ManualFunction } from '../types';
import { supabaseAdmin } from '@config/supabase.config';

type AnyObj = Record<string, any>;

const toArray = <T>(v: T | T[] | undefined | null): T[] =>
  v == null ? [] : Array.isArray(v) ? v : [v];

export const syncReferenciasLegislativas: ManualFunction = {
  id: 'sync-referencias-legislativas',
  name: 'Sincronizar referencias legislativas a Supabase',
  description: 'Guarda materias, trámites constitucionales y reglamentarios en sus tablas de referencia',
  category: 'diputados',
  inputs: [
    { name: 'base_url', type: 'string', description: 'URL base del servidor', required: false, defaultValue: 'http://localhost:6000' },
  ],
  execute: async (params?: AnyObj) => {
    const baseUrl: string = params?.base_url || 'http://localhost:6000';
    const admin = supabaseAdmin as any;

    console.log('SYNC REFERENCIAS LEGISLATIVAS');
    console.log('─'.repeat(60));

    // ── 1. Materias ──────────────────────────────────────────────
    // Route: GET /legislativos/materias
    // Response: { totalMaterias, data: { MateriasColeccion: { Materia: [{Id, Nombre}] } } }
    try {
      const resp = await axios.get(`${baseUrl}/legislativos/materias`, { timeout: 15000 });
      const rawMateria = resp.data?.data?.MateriasColeccion?.Materia
        ?? resp.data?.MateriasColeccion?.Materia;

      const materias = toArray<AnyObj>(rawMateria)
        .filter(m => m?.Id)
        .map(m => ({
          id: String(m.Id),
          nombre: m.Nombre ? String(m.Nombre) : null,
          raw_data: m,
          updated_at: new Date().toISOString(),
        }));

      if (materias.length === 0) {
        console.log('  ⚠ materias → respuesta vacía');
      } else {
        const { error } = await admin
          .from('materias')
          .upsert(materias, { onConflict: 'id' });

        if (error) console.log(`  ✗ materias → ${error.message}`);
        else console.log(`  ✓ materias → ${materias.length} registros`);
      }
    } catch (e: any) {
      console.log(`  ✗ materias → ${e.message}`);
    }

    // ── 2. Trámites constitucionales ─────────────────────────────
    // Route: GET /legislativos/tramitesConstitucionales
    // Response: { TramitesConstitucionalesColeccion: { TramiteConstitucional: [{Id, _}] } }
    // Note: the text field is '_' (xml2js mergeAttrs artifact), not 'Nombre'
    try {
      const resp = await axios.get(`${baseUrl}/legislativos/tramitesConstitucionales`, { timeout: 15000 });
      const rawTramite = resp.data?.TramitesConstitucionalesColeccion?.TramiteConstitucional;

      const tramites = toArray<AnyObj>(rawTramite)
        .filter(t => t?.Id)
        .map(t => ({
          id: String(t.Id),
          nombre: t._ ? String(t._) : null,
          raw_data: t,
          updated_at: new Date().toISOString(),
        }));

      if (tramites.length === 0) {
        console.log('  ⚠ tramites_constitucionales → respuesta vacía');
      } else {
        const { error } = await admin
          .from('tramites_constitucionales')
          .upsert(tramites, { onConflict: 'id' });

        if (error) console.log(`  ✗ tramites_constitucionales → ${error.message}`);
        else console.log(`  ✓ tramites_constitucionales → ${tramites.length} registros`);
      }
    } catch (e: any) {
      console.log(`  ✗ tramites_constitucionales → ${e.message}`);
    }

    // ── 3. Trámites reglamentarios ───────────────────────────────
    // Route: GET /legislativos/tramitesReglamentarios
    // Response: { TramitesReglamentariosColeccion: { TramiteReglamentario: [{Id, _}] } }
    try {
      const resp = await axios.get(`${baseUrl}/legislativos/tramitesReglamentarios`, { timeout: 15000 });
      const rawTramite = resp.data?.TramitesReglamentariosColeccion?.TramiteReglamentario;

      const tramites = toArray<AnyObj>(rawTramite)
        .filter(t => t?.Id)
        .map(t => ({
          id: String(t.Id),
          nombre: t._ ? String(t._) : null,
          raw_data: t,
          updated_at: new Date().toISOString(),
        }));

      if (tramites.length === 0) {
        console.log('  ⚠ tramites_reglamentarios → respuesta vacía');
      } else {
        const { error } = await admin
          .from('tramites_reglamentarios')
          .upsert(tramites, { onConflict: 'id' });

        if (error) console.log(`  ✗ tramites_reglamentarios → ${error.message}`);
        else console.log(`  ✓ tramites_reglamentarios → ${tramites.length} registros`);
      }
    } catch (e: any) {
      console.log(`  ✗ tramites_reglamentarios → ${e.message}`);
    }

    console.log('─'.repeat(60));
    console.log('Sync referencias legislativas completado');
  },
};

export default syncReferenciasLegislativas;
