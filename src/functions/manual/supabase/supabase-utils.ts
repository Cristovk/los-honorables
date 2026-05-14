import { ManualFunction } from '../types';
import { supabase, supabaseAdmin, testSupabaseConnection } from '@config/supabase.config';

/** Verifica la conexión con Supabase y muestra estadísticas por tabla */
export const checkSupabaseConnection: ManualFunction = {
  id: 'check-supabase-connection',
  name: 'Verificar Conexión Supabase',
  description: 'Verifica la conexión con Supabase y muestra el conteo de registros por tabla',
  category: 'supabase',
  inputs: [],
  execute: async () => {
    console.log('\n🗄️  VERIFICACIÓN DE CONEXIÓN SUPABASE:');
    console.log('─'.repeat(50));

    const connected = await testSupabaseConnection();

    if (!connected) {
      console.error('❌ No se pudo conectar a Supabase. Verifica las variables SUPABASE_URL y SUPABASE_ANON_KEY en .env');
      return;
    }

    console.log('✅ Conexión exitosa\n');

    const tables = ['diputados', 'sesiones', 'asistencias', 'sincronizacion'];

    console.log('📊 Registros por tabla:');
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`  • ${table}: ❌ ${error.message}`);
      } else {
        console.log(`  • ${table}: ${count ?? 0} registros`);
      }
    }

    console.log('─'.repeat(50));
  },
};

/** Ejecuta una query de inspección sobre una tabla de Supabase */
export const inspectSupabaseTable: ManualFunction = {
  id: 'inspect-supabase-table',
  name: 'Inspeccionar Tabla Supabase',
  description: 'Muestra los primeros registros de una tabla para verificar estructura y datos',
  category: 'supabase',
  inputs: [
    {
      name: 'table_name',
      type: 'select',
      description: 'Tabla a inspeccionar',
      required: true,
      options: ['diputados', 'sesiones', 'asistencias', 'sincronizacion'],
    },
    {
      name: 'limit',
      type: 'number',
      description: 'Cantidad de registros a mostrar (máx. 20)',
      required: false,
      defaultValue: 5,
    },
  ],
  execute: async (params) => {
    const { table_name, limit = 5 } = params || {};
    const safeLimit = Math.min(Number(limit), 20);

    console.log(`\n🗄️  INSPECCIÓN DE TABLA: ${table_name}`);
    console.log('─'.repeat(50));

    const { data, error } = await supabaseAdmin
      .from(table_name)
      .select('*')
      .limit(safeLimit);

    if (error) {
      console.error(`❌ Error al consultar ${table_name}: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      console.log('ℹ️  La tabla está vacía o no contiene registros.');
      return;
    }

    console.log(`📋 Primeros ${data.length} registros:\n`);
    data.forEach((row, idx) => {
      console.log(`  [${idx + 1}] ${JSON.stringify(row, null, 2)}`);
    });

    console.log('─'.repeat(50));
  },
};
