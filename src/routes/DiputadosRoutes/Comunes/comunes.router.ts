import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "@utils/xmlToJson";
import { CONFIG } from "@config/endpoints-config";
import {
  ComunasResponse,
  DistritosResponse,
  ProvinciasResponse,
  RegionesResponse,
  MinisteriosResponse,
  TiposCamaraOrigenResponse,
  TiposAsistenciaResponse,
  TiposEstadoSesionComisionResponse,
  TiposEstadoSesionSalaResponse,
  TiposTitularAsistenciaResponse,
  TiposEstadoResponse,
  TiposEstadoAcuerdosResolucionesResponse,
  TiposIniciativaProyectoLeyResponse
} from "@interface/external/camara-diputados/comunes";

const router = Router();

router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Datos Comunes API endpoint" });
});

/* Comunas */
router.get("/comunas", async (req: Request, res: Response<ComunasResponse>) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_comunas");
    console.log(endpoint);
    if (!endpoint) {
      res.status(404).json({
        success: false,
        endpoint: "comun_comunas",
        url: "",
        timestamp: new Date().toISOString(),
        data: { ComunasColeccion: { xmlns: "", xmlns_xsi: "", xmlns_xsd: "", Comuna: [] } }
      });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);

    const response: ComunasResponse = {
      success: true,
      endpoint: "comun_comunas",
      url: url,
      timestamp: new Date().toISOString(),
      data: data
    };

    res.status(200).json(response);
  } catch (error: any) {
    const errorResponse: ComunasResponse = {
      success: false,
      endpoint: "comun_comunas",
      url: "",
      timestamp: new Date().toISOString(),
      data: { ComunasColeccion: { xmlns: "", xmlns_xsi: "", xmlns_xsd: "", Comuna: [] } }
    };

    res.status(500).json(errorResponse);
  }
});

/* Distritos */
router.get("/distritos", async (req: Request, res: Response<DistritosResponse>) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_distritos");
    if (!endpoint) {
      res.status(404).json({
        success: false,
        endpoint: "comun_distritos",
        url: "",
        timestamp: new Date().toISOString(),
        data: { DistritosColeccion: { "xmlns": "", "xmlns:xsi": "", "xmlns:xsd": "", Distrito: [] } }
      });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);

    const response: DistritosResponse = {
      success: true,
      endpoint: "comun_distritos",
      url: url,
      timestamp: new Date().toISOString(),
      data: data
    };

    res.status(200).json(response);
  } catch (error: any) {
    const errorResponse: DistritosResponse = {
      success: false,
      endpoint: "comun_distritos",
      url: "",
      timestamp: new Date().toISOString(),
      data: { DistritosColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", Distrito: [] } }
    };

    res.status(500).json(errorResponse);
  }
});

/* Provincias */
router.get("/provincias", async (req: Request, res: Response<ProvinciasResponse>) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_provincias");
    if (!endpoint) {
      res.status(404).json({
        success: false,
        endpoint: "comun_provincias",
        url: "",
        timestamp: new Date().toISOString(),
        data: { ProvinciasColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", Provincia: [] } }
      });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);

    const response: ProvinciasResponse = {
      success: true,
      endpoint: "comun_provincias",
      url: url,
      timestamp: new Date().toISOString(),
      data: data
    };

    res.status(200).json(response);
  } catch (error: any) {
    const errorResponse: ProvinciasResponse = {
      success: false,
      endpoint: "comun_provincias",
      url: "",
      timestamp: new Date().toISOString(),
      data: { ProvinciasColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", Provincia: [] } }
    };

    res.status(500).json(errorResponse);
  }
});

/* Regiones */
router.get("/regiones", async (req: Request, res: Response<RegionesResponse>) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_regiones");
    if (!endpoint) {
      res.status(404).json({
        success: false,
        endpoint: "comun_regiones",
        url: "",
        timestamp: new Date().toISOString(),
        data: { RegionesColeccion: { xmlns: "", xmlns_xsi: "", xmlns_xsd: "", Region: [] } }
      });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);

    const response: RegionesResponse = {
      success: true,
      endpoint: "comun_regiones",
      url: url,
      timestamp: new Date().toISOString(),
      data: data
    };

    res.status(200).json(response);
  } catch (error: any) {
    const errorResponse: RegionesResponse = {
      success: false,
      endpoint: "comun_regiones",
      url: "",
      timestamp: new Date().toISOString(),
      data: { RegionesColeccion: { xmlns: "", xmlns_xsi: "", xmlns_xsd: "", Region: [] } }
    };

    res.status(500).json(errorResponse);
  }
});

/* Ministerios */
router.get("/ministerios", async (req: Request, res: Response<MinisteriosResponse>) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_ministerios");
    if (!endpoint) {
      res.status(404).json({
        success: false,
        endpoint: "comun_ministerios",
        url: "",
        timestamp: new Date().toISOString(),
        data: { MinisteriosColeccion: { xmlns: "", xmlns_xsi: "", xmlns_xsd: "", Ministerio: [] } }
      });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);

    const response: MinisteriosResponse = {
      success: true,
      endpoint: "comun_ministerios",
      url: url,
      timestamp: new Date().toISOString(),
      data: data
    };

    res.status(200).json(response);
  } catch (error: any) {
    const errorResponse: MinisteriosResponse = {
      success: false,
      endpoint: "comun_ministerios",
      url: "",
      timestamp: new Date().toISOString(),
      data: { MinisteriosColeccion: { xmlns: "", xmlns_xsi: "", xmlns_xsd: "", Ministerio: [] } }
    };

    res.status(500).json(errorResponse);
  }
});

/* Tipos de Cámara de Origen */
router.get("/tiposCamaraOrigen", async (req: Request, res: Response<TiposCamaraOrigenResponse>) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_camara_origen");
    if (!endpoint) {
      res.status(404).json({
        success: false,
        endpoint: "comun_tipos_camara_origen",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposCamaraOrigenColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoCamaraOrigen: { '1': '', '2': '' } } }
      });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);

    const response: TiposCamaraOrigenResponse = {
      success: true,
      endpoint: "comun_tipos_camara_origen",
      url: url,
      timestamp: new Date().toISOString(),
      data: data
    };

    res.status(200).json(response);
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        endpoint: "comun_tipos_camara_origen",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposCamaraOrigenColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoCamaraOrigen: { '1': '', '2': '' } } }
      });
  }
});

/* Tipos de Asistencia */
router.get("/tiposAsistencia", async (req: Request, res: Response<TiposAsistenciaResponse>) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_asistencia");
    if (!endpoint) {
      res.status(404).json({
        success: false,
        endpoint: "comun_tipos_asistencia",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposAsistenciaColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoAsistencia: { '0': '', '1': '', '2': '' } } }
      });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);
    console.log('tiposAsistencia', JSON.stringify(data, null, 2));
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        endpoint: "comun_tipos_asistencia",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposAsistenciaColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoAsistencia: { '0': '', '1': '', '2': '' } } }
      });
  }
});

/* Tipos de Estado de Sesión de Comisión */
router.get("/tiposEstadoSesionComision", async (req: Request, res: Response<TiposEstadoSesionComisionResponse>) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_estado_sesion_comision");
    if (!endpoint) {
      res.status(404).json({
        success: false,
        endpoint: "comun_tipos_estado_sesion_comision",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposEstadoSesionComisionColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoEstadoSesionComision: {} } }
      });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        endpoint: "comun_tipos_estado_sesion_comision",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposEstadoSesionComisionColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoEstadoSesionComision: {} } }
      });
  }
});

/* Tipos de Estado de Sesión de Sala */
router.get("/tiposEstadoSesionSala", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_estado_sesion_sala");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching tipos estado sesión sala", error: error.message });
  }
});

/* Tipos de Titular de Asistencia */
router.get("/tiposTitularAsistencia", async (req: Request, res: Response<TiposTitularAsistenciaResponse>) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_titular_asistencia");
    if (!endpoint) {
      res.status(404).json({
        success: false,
        endpoint: "comun_tipos_titular_asistencia",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposTitularAsistenciaColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoTitularAsistencia: {} } }
      });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        endpoint: "comun_tipos_titular_asistencia",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposTitularAsistenciaColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoTitularAsistencia: {} } }
      });
  }
});

/* Tipos de Estado */
router.get("/tiposEstado", async (req: Request, res: Response<TiposEstadoResponse>) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_estado");
    if (!endpoint) {
      res.status(404).json({
        success: false,
        endpoint: "comun_tipos_estado",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposEstadoColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoEstado: {} } }
      });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        endpoint: "comun_tipos_estado",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposEstadoColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoEstado: {} } }
      });
  }
});

/* Tipos de Estado de Acuerdos y Resoluciones */
router.get("/tiposEstadoAcuerdosResoluciones", async (req: Request, res: Response<TiposEstadoAcuerdosResolucionesResponse>) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_estado_acuerdos_resoluciones");
    if (!endpoint) {
      res.status(404).json({
        success: false,
        endpoint: "comun_tipos_estado_acuerdos_resoluciones",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposEstadoAcuerdosResolucionesColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoEstadoAcuerdosResoluciones: {} } }
      });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        endpoint: "comun_tipos_estado_acuerdos_resoluciones",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposEstadoAcuerdosResolucionesColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoEstadoAcuerdosResoluciones: {} } }
      });
  }
});
//<TiposIniciativaProyectoLeyResponse
/* Tipos de Iniciativa de Proyecto de Ley */
// Tipos de Iniciativa de Proyecto de Ley
router.get("/tiposIniciativaProyectoLey", async (req: Request, res: Response<TiposIniciativaProyectoLeyResponse>) => {
  try {
    console.log("comun_tipos_iniciativa_proyecto_ley");
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_iniciativa_proyecto_ley");
    if (!endpoint) {
      res.status(404).json({
        success: false,
        endpoint: "comun_tipos_iniciativa_proyecto_ley",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposIniciativaProyectoLeyColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoIniciativaProyectoLey: {} } }
      });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        endpoint: "comun_tipos_iniciativa_proyecto_ley",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposIniciativaProyectoLeyColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoIniciativaProyectoLey: {} } }
      });
  }
});

/* Tipos de Sesión de Sala */
router.get("/tiposSesionSala", async (req: Request, res: Response<TiposEstadoSesionSalaResponse>) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_sesion_sala");
    if (!endpoint) {
      res.status(404).json({
        success: false,
        endpoint: "comun_tipos_sesion_sala",
        url: "",
        timestamp: new Date().toISOString(),
        // Se devuelve estructura vacía para mantener contrato estable durante pruebas
        data: { TiposEstadoSesionSalaColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoEstadoSesionSala: {} } }
      });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({
        success: false,
        endpoint: "comun_tipos_sesion_sala",
        url: "",
        timestamp: new Date().toISOString(),
        data: { TiposEstadoSesionSalaColeccion: { xmlns: "", "xmlns:xsi": "", "xmlns:xsd": "", TipoEstadoSesionSala: {} } }
      });
  }
});

export default router;