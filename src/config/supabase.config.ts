import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * Tipos de la base de datos
 * Estos tipos se pueden generar automáticamente con el CLI de Supabase
 */
export interface Database {
  public: {
    Tables: {
      diputados: {
        Row: {
          id: string;
          nombre: string;
          apellido_paterno: string;
          apellido_materno: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nombre: string;
          apellido_paterno: string;
          apellido_materno: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          apellido_paterno?: string;
          apellido_materno?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      sesiones: {
        Row: {
          id: string;
          fecha: string;
          tipo: string;
          numero_sesion: number | null;
          legislatura: number | null;
          estado: string;
          created_at: string;
        };
        Insert: {
          id: string;
          fecha: string;
          tipo: string;
          numero_sesion?: number | null;
          legislatura?: number | null;
          estado: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          fecha?: string;
          tipo?: string;
          numero_sesion?: number | null;
          legislatura?: number | null;
          estado?: string;
          created_at?: string;
        };
      };
      asistencias: {
        Row: {
          id: number;
          diputado_id: string;
          sesion_id: string;
          tipo_asistencia: string;
          tipo_asistencia_code: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          diputado_id: string;
          sesion_id: string;
          tipo_asistencia: string;
          tipo_asistencia_code: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          diputado_id?: string;
          sesion_id?: string;
          tipo_asistencia?: string;
          tipo_asistencia_code?: number;
          created_at?: string;
        };
      };
      sincronizacion: {
        Row: {
          id: number;
          tipo: string;
          ultima_sesion_procesada: string | null;
          ultima_actualizacion: string;
          años_procesados: any; // JSONB
          registros_procesados: number;
          estado: string;
        };
        Insert: {
          id?: number;
          tipo: string;
          ultima_sesion_procesada?: string | null;
          ultima_actualizacion?: string;
          años_procesados?: any;
          registros_procesados?: number;
          estado: string;
        };
        Update: {
          id?: number;
          tipo?: string;
          ultima_sesion_procesada?: string | null;
          ultima_actualizacion?: string;
          años_procesados?: any;
          registros_procesados?: number;
          estado?: string;
        };
      };
    };
    Views: {
      estadisticas_diputados: {
        Row: {
          id: string;
          nombre: string;
          apellido_paterno: string;
          apellido_materno: string;
          total_sesiones: number;
          asiste: number;
          justificado: number;
          no_asiste: number;
          porcentaje_asistencia: number;
        };
      };
    };
    Functions: {};
    Enums: {};
  };
}

/**
 * Configuración de Supabase
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

/**
 * Cliente de Supabase con permisos de usuario anónimo
 * Usar para operaciones de lectura desde el frontend
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  }
);

/**
 * Cliente de Supabase con permisos de administrador (Service Role)
 * Usar SOLO en backend para operaciones de escritura
 * ⚠️ NUNCA exponer esta clave en el frontend
 */
export const supabaseAdmin: SupabaseClient<Database> = supabaseServiceRoleKey
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

/**
 * Helper para verificar la conexión con Supabase
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('diputados').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error conectando a Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Conexión exitosa con Supabase');
    return true;
  } catch (error: any) {
    console.error('Error de red con Supabase:', error.message);
    return false;
  }
}

/**
 * Helper para obtener información del proyecto
 */
export async function getSupabaseProjectInfo() {
  return {
    url: supabaseUrl,
    hasServiceRole: !!supabaseServiceRoleKey,
    timestamp: new Date().toISOString(),
  };
}
