import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "@utils/xmlToJson";
import CONFIG from "@config/endpoints-config";
import { MensajesXAnnoRequest, MocionesXAnnoRequest, ProyectoLeyRequest } from "@interface/external/camara-diputados/comunes";
import { MocionesXAnnoDto } from "@interface/external/camara-diputados/legislativo/mociones-x-anno.dto";
import { MensajesXAnnoDto } from "@interface/external/camara-diputados/legislativo/mensajes-x-anno.dto";
import { MateriasDto } from "@interface/external/camara-diputados/legislativo/materias.dto";
import { LegislaturasDto } from "@interface/external/camara-diputados/legislativo/legislaturas.dto";
import { ProyectoLeyResponseDto } from "@interface/external/camara-diputados/legislativo/proyecto-ley.dto";
import { TramitesConstitucionalesDto } from "@interface/external/camara-diputados/legislativo/tramites-constitucionales.dto";
import { TramitesReglamentariosDto } from "@interface/external/camara-diputados/legislativo/tramites-reglamentarios.dto";

const router = Router();


router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Legislativo API endpoint" });
});


/* Mociones de proyectos legislativos presentados por Diputados o Senadores */
router.get("/mocionesXAnno", async (req: Request, res: Response) => {
  const { year } = req.query as { year: string };
  try {
    const endpoint = CONFIG.getEndpoint("Legislativo", "legislativo_mociones_x_anno");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { prmAnno: year });
    console.log(url);
    const data: MocionesXAnnoDto = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching mociones", error: error.message });
  }
});

/* Mensajes de proyectos legislativos presentados por Ejecutivo */
router.get("/mensajesXAnno", async (req: Request, res: Response) => {
  const { year } = req.query as { year: string };
  try {
    const endpoint = CONFIG.getEndpoint("Legislativo", "legislativo_mensajes_x_anno");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { prmAnno: year });
    console.log(url);
    const data: MensajesXAnnoDto = await fetchAndProcessXml(url);
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
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data: MateriasDto = await fetchAndProcessXml(url);
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
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data: LegislaturasDto = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching legislaturas", error: error.message });
  }
});

/* Proyecto de Ley por boletín */
router.get("/proyectoLey", async (req: Request, res: Response) => {
  const { numeroBoletin } = req.query as { numeroBoletin: string };
  try {
    if (!numeroBoletin) {
      res.status(400).json({ message: "El parámetro 'numeroBoletin' es requerido" });
      return;
    }
    const endpoint = CONFIG.getEndpoint("Legislativo", "legislativo_proyecto_ley");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { prmNumeroBoletin: numeroBoletin });
    console.log(url);
    const data: ProyectoLeyResponseDto = await fetchAndProcessXml(url);
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
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data: TramitesConstitucionalesDto = await fetchAndProcessXml(url);
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
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint);
    console.log(url);
    const data: TramitesReglamentariosDto = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching trámites reglamentarios", error: error.message });
  }
});

export default router;
