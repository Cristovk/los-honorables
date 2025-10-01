import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "@utils/xmlToJson";
import { CONFIG } from "@config/endpoints-config";

const router = Router();

router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Datos Comunes API endpoint" });
});

/* Comunas */
router.get("/comunas", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_comunas");
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
      .json({ message: "Error fetching comunas", error: error.message });
  }
});

/* Distritos */
router.get("/distritos", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_distritos");
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
      .json({ message: "Error fetching distritos", error: error.message });
  }
});

/* Provincias */
router.get("/provincias", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_provincias");
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
      .json({ message: "Error fetching provincias", error: error.message });
  }
});

/* Regiones */
router.get("/regiones", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_regiones");
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
      .json({ message: "Error fetching regiones", error: error.message });
  }
});

/* Ministerios */
router.get("/ministerios", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_ministerios");
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
      .json({ message: "Error fetching ministerios", error: error.message });
  }
});

/* Tipos de Cámara de Origen */
router.get("/tiposCamaraOrigen", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_camara_origen");
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
      .json({ message: "Error fetching tipos cámara origen", error: error.message });
  }
});

/* Tipos de Asistencia */
router.get("/tiposAsistencia", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_asistencia");
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
      .json({ message: "Error fetching tipos asistencia", error: error.message });
  }
});

/* Tipos de Estado de Sesión de Comisión */
router.get("/tiposEstadoSesionComision", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_estado_sesion_comision");
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
      .json({ message: "Error fetching tipos estado sesión comisión", error: error.message });
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
router.get("/tiposTitularAsistencia", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_titular_asistencia");
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
      .json({ message: "Error fetching tipos titular asistencia", error: error.message });
  }
});

/* Tipos de Estado */
router.get("/tiposEstado", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_estado");
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
      .json({ message: "Error fetching tipos estado", error: error.message });
  }
});

/* Tipos de Estado de Acuerdos y Resoluciones */
router.get("/tiposEstadoAcuerdosResoluciones", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_estado_acuerdos_resoluciones");
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
      .json({ message: "Error fetching tipos estado acuerdos resoluciones", error: error.message });
  }
});

/* Tipos de Iniciativa de Proyecto de Ley */
router.get("/tiposIniciativaProyectoLey", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comun", "comun_tipos_iniciativa_proyecto_ley");
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
      .json({ message: "Error fetching tipos iniciativa proyecto ley", error: error.message });
  }
});

export default router;