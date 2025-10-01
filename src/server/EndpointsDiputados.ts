/**
 * Define una interfaz para un solo endpoint, con una URL de ejemplo.
 * @property {string} titulo - El nombre del endpoint.
 * @property {string} url - La parte de la URL específica para el endpoint.
 * @property {string} urlEjemplo - Una URL completa de ejemplo, incluyendo el nombre de los parámetros si existen.
 */
export interface Endpoint {
  titulo: string;
  url: string;
  urlEjemplo: string;
}

/**
 * Define una interfaz para agrupar los endpoints por categoría.
 * @property {string} categoria - El nombre de la categoría (p. ej., "Comisión", "Diputado").
 * @property {Endpoint[]} endpoints - Un array de objetos Endpoint.
 */
export interface CategoriaEndpoints {
  categoria: string;
  endpoints: Endpoint[];
}

/**
 * Un array que contiene todas las categorías y sus respectivos endpoints.
 * Cada objeto en el array representa una categoría con un nombre y una lista de endpoints,
 * con la URL de ejemplo actualizada para incluir los nombres de los parámetros.
 */
export const EndpointsDiputados = {
  Comisión: {
    comision_sesiones_x_comision_y_anno: {
      titulo: "COMISION_SESIONES_X_COMISION_Y_ANNO",
      url: "WSComision.asmx/retornarSesionesXComisionYAnno",
      urlEjemplo:
        "WSComision.asmx/retornarSesionesXComisionYAnno?prmComisionId=&prmAnno=",
    },
    comision_detalle: {
      titulo: "COMISION_DETALLE",
      url: "WSComision.asmx/retornarComision",
      urlEjemplo: "WSComision.asmx/retornarComision?prmComisionId=",
    },
    comision_vigentes: {
      titulo: "COMISION_VIGENTES",
      url: "WSComision.asmx/retornarComisionesVigentes",
      urlEjemplo: "WSComision.asmx/retornarComisionesVigentes",
    },
    comision_por_periodo: {
      titulo: "COMISION_POR_PERIODO",
      url: "WSComision.asmx/retornarComisionesXPeriodo",
      urlEjemplo: "WSComision.asmx/retornarComisionesXPeriodo?prmPeriodoId=",
    },
  },
  Diputato: {
    diputado_detalle: {
      titulo: "DIPUTADO_DETALLE",
      url: "WSDiputado.asmx/retornarDiputado",
      urlEjemplo: "WSDiputado.asmx/retornarDiputado?prmDiputadoId=",
    },
    diputado_lista: {
      titulo: "DIPUTADO_LISTA",
      url: "WSDiputado.asmx/retornarDiputados",
      urlEjemplo: "WSDiputado.asmx/retornarDiputados",
    },
    diputado_periodo_actual: {
      titulo: "DIPUTADO_PERIODO_ACTUAL",
      url: "WSDiputado.asmx/retornarDiputadosPeriodoActual",
      urlEjemplo: "WSDiputado.asmx/retornarDiputadosPeriodoActual",
    },
    diputado_por_periodo: {
      titulo: "DIPUTADO_POR_PERIODO",
      url: "WSDiputado.asmx/retornarDiputadosXPeriodo",
      urlEjemplo: "WSDiputado.asmx/retornarDiputadosXPeriodo?prmPeriodoID=",
    },
  },
  ProyectoAcuerdo: {
    proyecto_acuerdo_detalle: {
      titulo: "PROYECTO_ACUERDO_DETALLE",
      url: "WSProyectoAcuerdo.asmx/retornarProyectoAcuerdo",
      urlEjemplo:
        "WSProyectoAcuerdo.asmx/retornarProyectoAcuerdo?idProyectoAcuerdo=",
    },
    proyecto_acuerdo_por_anno: {
      titulo: "PROYECTO_ACUERDO_POR_ANNO",
      url: "WSProyectoAcuerdo.asmx/retornarProyectosAcuerdoXAnno",
      urlEjemplo: "WSProyectoAcuerdo.asmx/retornarProyectosAcuerdoXAnno?anno=",
    },
  },
  ProyectoResolucion: {
    proyecto_resolucion_detalle: {
      titulo: "PROYECTO_RESOLUCION_DETALLE",
      url: "WSProyectoResolucion.asmx/retornarProyectoResolucion",
      urlEjemplo:
        "WSProyectoResolucion.asmx/retornarProyectoResolucion?idProyectoResolucion=",
    },
    proyecto_resolucion_por_anno: {
      titulo: "PROYECTO_RESOLUCION_POR_ANNO",
      url: "WSProyectoResolucion.asmx/retornarProyectosResolucionXAnno",
      urlEjemplo:
        "WSProyectoResolucion.asmx/retornarProyectosResolucionXAnno?anno=",
    },
  },
  Sala: {
    sala_sesion_asistencia: {
      titulo: "SALA_SESION_ASISTENCIA",
      url: "WSSala.asmx/retornarSesionAsistencia",
      urlEjemplo: "WSSala.asmx/retornarSesionAsistencia?prmSesionId=",
    },
    sala_sesiones_por_anno: {
      titulo: "SALA_SESIONES_POR_ANNO",
      url: "WSSala.asmx/retornarSesionesXAnno",
      urlEjemplo: "WSSala.asmx/retornarSesionesXAnno?prmAnno=",
    },
    sala_sesiones_por_legislatura: {
      titulo: "SALA_SESIONES_POR_LEGISLATURA",
      url: "WSSala.asmx/retornarSesionesXLegislatura",
      urlEjemplo: "WSSala.asmx/retornarSesionesXLegislatura?prmLegislaturaId=",
    },
  },
  Legislativo_periodo: {
    legislativo_legislatura_actual: {
      titulo: "LEGISLATIVO_LEGISLATURA_ACTUAL",
      url: "WSLegislativo.asmx/retornarLegislaturaActual",
      urlEjemplo: "WSLegislativo.asmx/retornarLegislaturaActual",
    },
    legislativo_periodo_actual: {
      titulo: "LESGISLATIVO_PERIODO_LEGISLATURA_ACTUAL",
      url: "WSLegislativo.asmx/retornarPeriodoLegislativoActual",
      urlEjemplo: "WSLegislativo.asmx/retornarPeriodoLegislativoActual",
    },
    legislativo_periodos: {
      titulo: "LESGISLATIVO_PERIODO_LEGISLATURA_TODOS",
      url: "WSLegislativo.asmx/retornarPeriodosLegislativos",
      urlEjemplo: "WSLegislativo.asmx/retornarPeriodosLegislativos",
    },
  },
  Legislativo: {
    legislativo_legislaturas: {
      titulo: "LEGISLATIVO_LEGISLATURAS",
      url: "WSLegislativo.asmx/retornarLegislaturas",
      urlEjemplo: "WSLegislativo.asmx/retornarLegislaturas",
    },
    legislativo_materias: {
      titulo: "LEGISLATIVO_MATERIAS",
      url: "WSLegislativo.asmx/retornarMaterias",
      urlEjemplo: "WSLegislativo.asmx/retornarMaterias",
    },
    legislativo_mensajes_x_anno: {
      titulo: "LEGISLATIVO_MENSAJES_POR_ANNO",
      url: "WSLegislativo.asmx/retornarMensajesXAnno",
      urlEjemplo: "WSLegislativo.asmx/retornarMensajesXAnno?prmAnno=",
    },
    legislativo_mociones_x_anno: {
      titulo: "LEGISLATIVO_MOCIONES_POR_ANNO",
      url: "WSLegislativo.asmx/retornarMocionesXAnno",
      urlEjemplo: "WSLegislativo.asmx/retornarMocionesXAnno?prmAnno=",
    },
    legislativo_proyecto_ley: {
      titulo: "LEGISLATIVO_PROYECTO_LEY",
      url: "WSLegislativo.asmx/retornarProyectoLey",
      urlEjemplo: "WSLegislativo.asmx/retornarProyectoLey?prmNumeroBoletin=",
    },
    legislativo_tramites_constitucionales: {
      titulo: "LEGISLATIVO_TRAMITES_CONSTITUCIONALES",
      url: "WSLegislativo.asmx/retornarTramitesConstitucionales",
      urlEjemplo: "WSLegislativo.asmx/retornarTramitesConstitucionales",
    },
    legislativo_tramites_reglamentarios: {
      titulo: "LEGISLATIVO_TRAMITES_REGLAMENTARIOS",
      url: "WSLegislativo.asmx/retornarTramitesReglamentarios",
      urlEjemplo: "WSLegislativo.asmx/retornarTramitesReglamentarios",
    },
    legislativo_votacion_detalle: {
      titulo: "LEGISLATIVO_VOTACION_DETALLE",
      url: "WSLegislativo.asmx/retornarVotacionDetalle",
      urlEjemplo: "WSLegislativo.asmx/retornarVotacionDetalle?prmVotacionId=",
    },
    legislativo_votaciones_x_anno: {
      titulo: "LEGISLATIVO_VOTACIONES_POR_ANNO",
      url: "WSLegislativo.asmx/retornarVotacionesXAnno",
      urlEjemplo: "WSLegislativo.asmx/retornarVotacionesXAnno?prmAnno=",
    },
    legislativo_votaciones_x_proyecto_ley: {
      titulo: "LEGISLATIVO_VOTACIONES_POR_PROYECTO_LEY",
      url: "WSLegislativo.asmx/retornarVotacionesXProyectoLey",
      urlEjemplo:
        "WSLegislativo.asmx/retornarVotacionesXProyectoLey?prmNumeroBoletin=",
    },
  },
  Comun: {
    comun_comunas: {
      titulo: "COMUN_COMUNAS",
      url: "WSComunes.asmx/retornarComunas",
      urlEjemplo: "WSComunes.asmx/retornarComunas",
    },
    comun_distritos: {
      titulo: "COMUN_DISTRITOS",
      url: "WSComunes.asmx/retornarDistritos",
      urlEjemplo: "WSComunes.asmx/retornarDistritos",
    },
    comun_provincias: {
      titulo: "COMUN_PROVINCIAS",
      url: "WSComunes.asmx/retornarProvincias",
      urlEjemplo: "WSComunes.asmx/retornarProvincias",
    },
    comun_regiones: {
      titulo: "COMUN_REGIONES",
      url: "WSComunes.asmx/retornarRegiones",
      urlEjemplo: "WSComunes.asmx/retornarRegiones",
    },
    comun_ministerios: {
      titulo: "COMUN_MINISTERIOS",
      url: "WSComunes.asmx/retornarMinisterios",
      urlEjemplo: "WSComunes.asmx/retornarMinisterios",
    },
    comun_tipos_camara_origen: {
      titulo: "COMUN_TIPOS_CAMARA_ORIGEN",
      url: "WSComunes.asmx/retornarTiposCamaraOrigen",
      urlEjemplo: "WSComunes.asmx/retornarTiposCamaraOrigen",
    },
    comun_tipos_asistencia: {
      titulo: "COMUN_TIPOS_ASISTENCIA",
      url: "WSComunes.asmx/retornarTiposAsistencia",
      urlEjemplo: "WSComunes.asmx/retornarTiposAsistencia",
    },
    comun_tipos_estado_sesion_comision: {
      titulo: "COMUN_TIPOS_ESTADO_SESION_COMISION",
      url: "WSComunes.asmx/retornarTiposEstadoSesionComision",
      urlEjemplo: "WSComunes.asmx/retornarTiposEstadoSesionComision",
    },
    comun_tipos_estado_sesion_sala: {
      titulo: "COMUN_TIPOS_ESTADO_SESION_SALA",
      url: "WSComunes.asmx/retornarTiposEstadoSesionSala",
      urlEjemplo: "WSComunes.asmx/retornarTiposEstadoSesionSala",
    },
    comun_tipos_titular_asistencia: {
      titulo: "COMUN_TIPOS_TITULAR_ASISTENCIA",
      url: "WSComunes.asmx/retornarTiposTitularAsistencia",
      urlEjemplo: "WSComunes.asmx/retornarTiposTitularAsistencia",
    },
    comun_tipos_estado: {
      titulo: "COMUN_TIPOS_ESTADO",
      url: "WSComunes.asmx/retornarTiposEstado",
      urlEjemplo: "WSComunes.asmx/retornarTiposEstado",
    },
    comun_tipos_estado_acuerdos_resoluciones: {
      titulo: "COMUN_TIPOS_ESTADO_ACUERDOS_RESOLUCIONES",
      url: "WSComunes.asmx/retornarTiposEstadoAcuerdosResoluciones",
      urlEjemplo: "WSComunes.asmx/retornarTiposEstadoAcuerdosResoluciones",
    },
    comun_tipos_iniciativa_proyecto_ley: {
      titulo: "COMUN_TIPOS_INICIATIVA_PROYECTO_LEY",
      url: "WSComunes.asmx/retornarTiposIniciativaProyectoLey",
      urlEjemplo: "WSComunes.asmx/retornarTiposIniciativaProyectoLey",
    },
  },
};
