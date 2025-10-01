import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "@utils/xmlToJson";
import CONFIG from "@config/endpoints-config";
import { MocionesXAnnoRequest, MensajesXAnnoRequest, LegislativoProyectoLeyRequest } from "@interface/request.interface";
import { MensajesXAnnoRequest, MocionesXAnnoRequest } from "@interface/request.interface";

const router = Router();


router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Legislativo API endpoint" });
});


/* Mociones de proyectos legislativos presentados por Diputados o Senadores */
router.get("/mocionesXAnno", async (req: Request<{}, {}, MocionesXAnnoRequest>, res: Response) => {
  const { year } = req.body;
  try {
    const endpoint = CONFIG.getEndpoint("Legislativo", "legislativo_mociones_x_anno");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
    }
    const url = CONFIG.buildUrl(endpoint, { prmAnno: year });
    console.log(url);
    const data = await fetchAndProcessXml(url); // Cambia 'Mocion' según el nodo raíz del XML
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching mociones" });
  }
});

/* Mensajes de proyectos legislativos presentados por Ejecutivo */
router.get("/mensajesXAnno", async (req: Request<{}, {}, MensajesXAnnoRequest>, res: Response) => {
  const { year } = req.body;
  try {
    const endpoint = CONFIG.getEndpoint("Legislativo", "legislativo_mensajes_x_anno");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
    }
    const url = CONFIG.buildUrl(endpoint, { prmAnno: year });
    console.log(url);
    const data = await fetchAndProcessXml(url); // Cambia 'Mensaje' según el nodo raíz del XML
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching mensajes", error: error.message });
  }
});

// MATERIAS
router.get("/materias", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Legislativo", "legislativo_materias");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url); // Cambia 'Material' según el nodo raíz del XML
    const totalMaterias = data.length;
    res.status(200).json({ totalMaterias, data });
  }
  catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching materias", error: error.message });
    }
  });

/* Legislaturas */
router.get("/legislaturas", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Legislativo", "legislativo_legislaturas");
    if (!endpoint) {
      return res.status(404).json({ message: "Endpoint not found" });
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching legislaturas", error: error.message });
  }
});

/* Proyecto de Ley por boletín */
router.get("/proyectoLey", async (req: Request<{}, {}, LegislativoProyectoLeyRequest>, res: Response) => {
  const { numeroBoletin } = req.body;
  try {
    if (!numeroBoletin) {
      return res.status(400).json({ message: "El parámetro 'numeroBoletin' es requerido" });
    }
    const endpoint = CONFIG.getEndpoint("Legislativo", "legislativo_proyecto_ley");
    if (!endpoint) {
      return res.status(404).json({ message: "Endpoint not found" });
    }
    const url = CONFIG.buildUrl(endpoint, { prmNumeroBoletin: numeroBoletin });
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching proyecto de ley", error: error.message });
  }
});

/* Trámites constitucionales */
router.get("/tramitesConstitucionales", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Legislativo", "legislativo_tramites_constitucionales");
    if (!endpoint) {
      return res.status(404).json({ message: "Endpoint not found" });
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching trámites constitucionales", error: error.message });
  }
});

/* Trámites reglamentarios */
router.get("/tramitesReglamentarios", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Legislativo", "legislativo_tramites_reglamentarios");
    if (!endpoint) {
      return res.status(404).json({ message: "Endpoint not found" });
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching trámites reglamentarios", error: error.message });
  }
});

export default router;
