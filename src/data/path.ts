import { config } from "dotenv";

config();

const BASE_URL =
  process.env.BASE_URL ||
  "https://opendata.camara.cl/camaradiputados/WServices/";

interface ServicePaths {
  COMISION: {
    sesionesXComisionYAnno: string;
    comision: string;
    comisionesVigentes: string;
    comisionesXPeriodo: string;
  };
  DIPUTADO: {
    diputado: string;
    diputados: string;
    diputadosPeriodoActual: string;
    diputadosXPeriodo: string;
  };
  PROYECTO_ACUERDO: {
    proyectoAcuerdo: string;
    proyectosAcuerdoXAnno: string;
  };
  PROYECTO_RESOLUCION: {
    proyectoResolucion: string;
    proyectosResolucionXAnno: string;
  };
  SALA: {
    sesionAsistencia: string;
    sesionesXAnno: string;
    sesionesXLegislatura: string;
  };
  LEGISLATIVO: {
    legislaturaActual: string;
    legislaturas: string;
    materias: string;
    mensajesXAnno: string;
    mocionesXAnno: string;
    proyectoLey: string;
    tramitesConstitucionales: string;
    tramitesReglamentarios: string;
    votacionDetalle: string;
    votacionesXAnno: string;
    votacionesXProyectoLey: string;
  };
  COMUN: {
    comunas: string;
    distritos: string;
    provincias: string;
    regiones: string;
    ministerios: string;
    tiposCamaraOrigen: string;
    tiposAsistencia: string;
    tiposEstadoSesionComision: string;
    tiposEstadoSesionSala: string;
    tiposTitularAsistencia: string;
    tiposEstado: string;
    tiposEstadoAcuerdosResoluciones: string;
    tiposIniciativaProyectoLey: string;
    tiposLegislatura: string;
    tiposQuorumVotacion: string;
    tiposResultadoVotacion: string;
    tiposVotacion: string;
    tiposVotacionProyectoLey: string;
    tiposJustificacionesInasistencia: string;
    tiposSexo: string;
  };
}

export const PATHS: ServicePaths = {
  COMISION: {
    sesionesXComisionYAnno: `${BASE_URL}WSComision.asmx/retornarSesionesXComisionYAnno`,
    comision: `${BASE_URL}WSComision.asmx/retornarComision`,
    comisionesVigentes: `${BASE_URL}WSComision.asmx/retornarComisionesVigentes`,
    comisionesXPeriodo: `${BASE_URL}WSComision.asmx/retornarComisionesXPeriodo`,
  },
  DIPUTADO: {
    diputado: `${BASE_URL}WSDiputado.asmx/retornarDiputado?prmDiputadoId=`,
    diputados: `${BASE_URL}WSDiputado.asmx/retornarDiputados`,
    diputadosPeriodoActual: `${BASE_URL}WSDiputado.asmx/retornarDiputadosPeriodoActual?`,
    diputadosXPeriodo: `${BASE_URL}WSDiputado.asmx/retornarDiputadosXPeriodo?prmPeriodoId=`,
  },
  PROYECTO_ACUERDO: {
    proyectoAcuerdo: `${BASE_URL}WSProyectoAcuerdo.asmx/retornarProyectoAcuerdo`,
    proyectosAcuerdoXAnno: `${BASE_URL}WSProyectoAcuerdo.asmx/retornarProyectosAcuerdoXAnno`,
  },
  PROYECTO_RESOLUCION: {
    proyectoResolucion: `${BASE_URL}WSProyectoResolucion.asmx/retornarProyectoResolucion`,
    proyectosResolucionXAnno: `${BASE_URL}WSProyectoResolucion.asmx/retornarProyectosResolucionXAnno`,
  },
  SALA: {
    sesionAsistencia: `${BASE_URL}WSSala.asmx/retornarSesionAsistencia`,
    sesionesXAnno: `${BASE_URL}WSSala.asmx/retornarSesionesXAnno`,
    sesionesXLegislatura: `${BASE_URL}WSSala.asmx/retornarSesionesXLegislatura`,
  },
  LEGISLATIVO: {
    legislaturaActual: `${BASE_URL}WSLegislativo.asmx/retornarLegislaturaActual`,
    legislaturas: `${BASE_URL}WSLegislativo.asmx/retornarLegislaturas`,
    materias: `${BASE_URL}WSLegislativo.asmx/retornarMaterias`,
    mensajesXAnno: `${BASE_URL}WSLegislativo.asmx/retornarMensajesXAnno`,
    mocionesXAnno: `${BASE_URL}WSLegislativo.asmx/retornarMocionesXAnno`,
    proyectoLey: `${BASE_URL}WSLegislativo.asmx/retornarProyectoLey`,
    tramitesConstitucionales: `${BASE_URL}WSLegislativo.asmx/retornarTramitesConstitucionales`,
    tramitesReglamentarios: `${BASE_URL}WSLegislativo.asmx/retornarTramitesReglamentarios`,
    votacionDetalle: `${BASE_URL}WSLegislativo.asmx/retornarVotacionDetalle`,
    votacionesXAnno: `${BASE_URL}WSLegislativo.asmx/retornarVotacionesXAnno`,
    votacionesXProyectoLey: `${BASE_URL}WSLegislativo.asmx/retornarVotacionesXProyectoLey`,
  },
  COMUN: {
    comunas: `${BASE_URL}WSComunes.asmx/retornarComunas`,
    distritos: `${BASE_URL}WSComunes.asmx/retornarDistritos`,
    provincias: `${BASE_URL}WSComunes.asmx/retornarProvincias`,
    regiones: `${BASE_URL}WSComunes.asmx/retornarRegiones`,
    ministerios: `${BASE_URL}WSComunes.asmx/retornarMinisterios`,
    tiposCamaraOrigen: `${BASE_URL}WSComunes.asmx/retornarTiposCamaraOrigen`,
    tiposAsistencia: `${BASE_URL}WSComunes.asmx/retornarTiposAsistencia`,
    tiposEstadoSesionComision: `${BASE_URL}WSComunes.asmx/retornarTiposEstadoSesionComision`,
    tiposEstadoSesionSala: `${BASE_URL}WSComunes.asmx/retornarTiposEstadoSesionSala`,
    tiposTitularAsistencia: `${BASE_URL}WSComunes.asmx/retornarTiposTitularAsistencia`,
    tiposEstado: `${BASE_URL}WSComunes.asmx/retornarTiposEstado`,
    tiposEstadoAcuerdosResoluciones: `${BASE_URL}WSComunes.asmx/retornarTiposEstadoAcuerdosResoluciones`,
    tiposIniciativaProyectoLey: `${BASE_URL}WSComunes.asmx/retornarTiposIniciativaProyectoLey`,
    tiposLegislatura: `${BASE_URL}WSComunes.asmx/retornarTiposLegislatura`,
    tiposQuorumVotacion: `${BASE_URL}WSComunes.asmx/retornarTiposQuorumVotacion`,
    tiposResultadoVotacion: `${BASE_URL}WSComunes.asmx/retornarTiposResultadoVotacion`,
    tiposVotacion: `${BASE_URL}WSComunes.asmx/retornarTiposVotacion`,
    tiposVotacionProyectoLey: `${BASE_URL}WSComunes.asmx/retornarTiposVotacionProyectoLey`,
    tiposJustificacionesInasistencia: `${BASE_URL}WSComunes.asmx/retornarTiposJustificacionesInasistencia`,
    tiposSexo: `${BASE_URL}WSComunes.asmx/retornarrTiposSexo`,
  },
};
