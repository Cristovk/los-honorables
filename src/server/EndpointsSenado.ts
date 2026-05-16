export const EndpointsSenado = {
  Senadores: {
    senadores_vigentes: {
      titulo: "SENADORES_VIGENTES",
      url: "senadores_vigentes.php",
      urlEjemplo: "https://tramitacion.senado.cl/wspublico/senadores_vigentes.php",
    },
  },
  Votaciones: {
    votaciones_por_boletin: {
        titulo: "VOTACIONES_POR_BOLETIN",
        url: "invoca_votacion.html",
        urlEjemplo: "https://tramitacion.senado.cl/wspublico/invoca_votacion.html?prmBoletin=1234-56",
    },
  },
  Proyectos: {
    proyectos_por_fecha: {
        titulo: "PROYECTOS_POR_FECHA",
        url: "invoca_tramitacion_fecha.html",
        urlEjemplo: "https://tramitacion.senado.cl/wspublico/invoca_tramitacion_fecha.html?prmFechaDesde=01/01/2024&prmFechaHasta=31/12/2024",
    },
    proyecto_detalle: {
        titulo: "PROYECTO_DETALLE",
        url: "invoca_proyecto.html",
        urlEjemplo: "https://tramitacion.senado.cl/wspublico/invoca_proyecto.html?prmBoletin=1234-56",
    },
  },
};