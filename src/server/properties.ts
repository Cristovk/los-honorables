import 'dotenv/config';
import { readFileSync } from 'fs';
import path from 'path';

const env = (key: string) => {
  return process.env[key];
};

// Función para leer el archivo JSON de Firebase
const getFirebaseConfig = () => {
  const firebaseConfigPath = env('FIREBASE_CREDENTIALS') ?? 'horonables-firebase.json';
  try {
    return JSON.parse(
      readFileSync(path.join(process.cwd(), firebaseConfigPath), 'utf8')
    );
  } catch (error) {
    console.error('Error loading Firebase config:', error);
    return {};
  }
};
interface Properties {
  BASE_URL: string;
  PORT: number;
  FIREBASE_CREDENTIALS: any;
  SERVICES: {
    COMISION: {
      SESIONES_X_COMISION_Y_ANNO: string;
      DETALLE: string;
      VIGENTES: string;
      POR_PERIODO: string;
    };
    DIPUTADO: {
      DETALLE: string;
      LISTA: string;
      PERIODO_ACTUAL: string;
      POR_PERIODO: string;
    };
    PROYECTO_ACUERDO: {
      DETALLE: string;
      POR_ANNO: string;
    };
    PROYECTO_RESOLUCION: {
      DETALLE: string;
      POR_ANNO: string;
    };
    SALA: {
      SESION_ASISTENCIA: string;
      SESIONES_POR_ANNO: string;
      SESIONES_POR_LEGISLATURA: string;
    };
    LEGISLATIVO: {
      LEGISLATURAS: string;
      MATERIAS: string;
      MENSAJES_POR_ANNO: string;
      MOCIONES_POR_ANNO: string;
      PROYECTO_LEY: string;
      TRAMITES_CONSTITUCIONALES: string;
      TRAMITES_REGLAMENTARIOS: string;
      VOTACION_DETALLE: string;
      VOTACIONES_POR_ANNO: string;
      VOTACIONES_POR_PROYECTO_LEY: string;
    };
    PERIODO_LEGISLATIVO: {
      LEGISLATURA_ACTUAL: string;
      PERIODO_LEGISLATURA_ACTUAL: string;
      PERIODO_LEGISLATURA_TODOS: string;
    };
    COMUN: {
      COMUNAS: string;
      DISTRITOS: string;
      PROVINCIAS: string;
      REGIONES: string;
      MINISTERIOS: string;
      TIPOS_CAMARA_ORIGEN: string;
      TIPOS_ASISTENCIA: string;
      TIPOS_ESTADO_SESION_COMISION: string;
      TIPOS_ESTADO_SESION_SALA: string;
      TIPOS_TITULAR_ASISTENCIA: string;
      TIPOS_ESTADO: string;
      TIPOS_ESTADO_ACUERDOS_RESOLUCIONES: string;
      TIPOS_INICIATIVA_PROYECTO_LEY: string;
    };
  };
}

const properties: Properties = {
  BASE_URL: env('BASE_URL') ?? 'https://opendata.camara.cl/camaradiputados/WServices/',
  PORT: Number(env('PORT') ?? 6000),
  FIREBASE_CREDENTIALS: getFirebaseConfig(),
  SERVICES: {
    COMISION: {
      SESIONES_X_COMISION_Y_ANNO: env('COMISION_SESIONES_X_COMISION_Y_ANNO') ?? 'WSComision.asmx/retornarSesionesXComisionYAnno',
      DETALLE: env('COMISION_DETALLE') ?? 'WSComision.asmx/retornarComision',
      VIGENTES: env('COMISION_VIGENTES') ?? 'WSComision.asmx/retornarComisionesVigentes',
      POR_PERIODO: env('COMISION_POR_PERIODO') ?? 'WSComision.asmx/retornarComisionesXPeriodo',
    },
    DIPUTADO: {
      DETALLE: env('DIPUTADO_DETALLE') ?? 'WSDiputado.asmx/retornarDiputado',
      LISTA: env('DIPUTADO_LISTA') ?? 'WSDiputado.asmx/retornarDiputados',
      PERIODO_ACTUAL: env('DIPUTADO_PERIODO_ACTUAL') ?? 'WSDiputado.asmx/retornarDiputadosPeriodoActual',
      POR_PERIODO: env('DIPUTADO_POR_PERIODO') ?? 'WSDiputado.asmx/retornarDiputadosXPeriodo',
    },
    PROYECTO_ACUERDO: {
      DETALLE: env('PROYECTO_ACUERDO_DETALLE') ?? 'WSProyectoAcuerdo.asmx/retornarProyectoAcuerdo',
      POR_ANNO: env('PROYECTO_ACUERDO_POR_ANNO') ?? 'WSProyectoAcuerdo.asmx/retornarProyectosAcuerdoXAnno',
    },
    PROYECTO_RESOLUCION: {
      DETALLE: env('PROYECTO_RESOLUCION_DETALLE') ?? 'WSProyectoResolucion.asmx/retornarProyectoResolucion',
      POR_ANNO: env('PROYECTO_RESOLUCION_POR_ANNO') ?? 'WSProyectoResolucion.asmx/retornarProyectosResolucionXAnno',
    },
    SALA: {
      SESION_ASISTENCIA: env('SALA_SESION_ASISTENCIA') ?? 'WSSala.asmx/retornarSesionAsistencia',
      SESIONES_POR_ANNO: env('SALA_SESIONES_POR_ANNO') ?? 'WSSala.asmx/retornarSesionesXAnno',
      SESIONES_POR_LEGISLATURA: env('SALA_SESIONES_POR_LEGISLATURA') ?? 'WSSala.asmx/retornarSesionesXLegislatura',
    },
    LEGISLATIVO: {
      LEGISLATURAS: env('LEGISLATIVO_LEGISLATURAS') ?? 'WSLegislativo.asmx/retornarLegislaturas',
      MATERIAS: env('LEGISLATIVO_MATERIAS') ?? 'WSLegislativo.asmx/retornarMaterias',
      MENSAJES_POR_ANNO: env('LEGISLATIVO_MENSAJES_POR_ANNO') ?? 'WSLegislativo.asmx/retornarMensajesXAnno',
      MOCIONES_POR_ANNO: env('LEGISLATIVO_MOCIONES_POR_ANNO') ?? 'WSLegislativo.asmx/retornarMocionesXAnno',
      PROYECTO_LEY: env('LEGISLATIVO_PROYECTO_LEY') ?? 'WSLegislativo.asmx/retornarProyectoLey',
      TRAMITES_CONSTITUCIONALES: env('LEGISLATIVO_TRAMITES_CONSTITUCIONALES') ?? 'WSLegislativo.asmx/retornarTramitesConstitucionales',
      TRAMITES_REGLAMENTARIOS: env('LEGISLATIVO_TRAMITES_REGLAMENTARIOS') ?? 'WSLegislativo.asmx/retornarTramitesReglamentarios',
      VOTACION_DETALLE: env('LEGISLATIVO_VOTACION_DETALLE') ?? 'WSLegislativo.asmx/retornarVotacionDetalle',
      VOTACIONES_POR_ANNO: env('LEGISLATIVO_VOTACIONES_POR_ANNO') ?? 'WSLegislativo.asmx/retornarVotacionesXAnno',
      VOTACIONES_POR_PROYECTO_LEY: env('LEGISLATIVO_VOTACIONES_POR_PROYECTO_LEY') ?? 'WSLegislativo.asmx/retornarVotacionesXProyectoLey',
    },
    PERIODO_LEGISLATIVO: { 
      LEGISLATURA_ACTUAL: env('LEGISLATIVO_LEGISLATURA_ACTUAL') ?? 'WSLegislativo.asmx/retornarLegislaturaActual',
      PERIODO_LEGISLATURA_ACTUAL: env('LEGISLATIVO_PERIODO_LEGISLATURA_ACTUAL') ?? 'WSLegislativo.asmx/retornarPeriodoLegislativoActual',
      PERIODO_LEGISLATURA_TODOS: env('LEGISLATIVO_PERIODO_LEGISLATURA_TODOS') ?? 'WSLegislativo.asmx/retornarPeriodosLegislativos',
    },
    COMUN: {
      COMUNAS: env('COMUN_COMUNAS') ?? 'WSComunes.asmx/retornarComunas',
      DISTRITOS: env('COMUN_DISTRITOS') ?? 'WSComunes.asmx/retornarDistritos',
      PROVINCIAS: env('COMUN_PROVINCIAS') ?? 'WSComunes.asmx/retornarProvincias',
      REGIONES: env('COMUN_REGIONES') ?? 'WSComunes.asmx/retornarRegiones',
      MINISTERIOS: env('COMUN_MINISTERIOS') ?? 'WSComunes.asmx/retornarMinisterios',
      TIPOS_CAMARA_ORIGEN: env('COMUN_TIPOS_CAMARA_ORIGEN') ?? 'WSComunes.asmx/retornarTiposCamaraOrigen',
      TIPOS_ASISTENCIA: env('COMUN_TIPOS_ASISTENCIA') ?? 'WSComunes.asmx/retornarTiposAsistencia',
      TIPOS_ESTADO: env('COMUN_TIPOS_ESTADO') ?? 'WSComunes.asmx/retornarTiposEstado',
      TIPOS_INICIATIVA_PROYECTO_LEY: env('COMUN_TIPOS_INICIATIVA_PROYECTO_LEY') ?? 'WSComunes.asmx/retornarTiposIniciativaProyectoLey',
      TIPOS_ESTADO_ACUERDOS_RESOLUCIONES: env('COMUN_TIPOS_ESTADO_ACUERDOS_RESOLUCIONES') ?? 'WSComunes.asmx/retornarTiposEstadoAcuerdosResoluciones',
      TIPOS_ESTADO_SESION_COMISION: env('COMUN_TIPOS_ESTADO_SESION_COMISION') ?? 'WSComunes.asmx/retornarTiposEstadoSesionComision',
      TIPOS_ESTADO_SESION_SALA: env('COMUN_TIPOS_ESTADO_SESION_SALA') ?? 'WSComunes.asmx/retornarTiposEstadoSesionSala',
      TIPOS_TITULAR_ASISTENCIA: env('COMUN_TIPOS_TITULAR_ASISTENCIA') ?? 'WSComunes.asmx/retornarTiposTitularAsistencia',
      
    }
  }
};

export default properties;
