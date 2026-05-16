import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "@utils/xmlToJson";
import { CONFIG } from "@config/endpoints-config";
import { DetalleVotacionRequest, VotacionesXAnnoRequest, VotacionesXProyectoLeyRequest } from "@interface/request.interface";
import { DetalleVotacionDto } from "@interface/external/camara-diputados/votaciones/detalle-votacion.dto";
import { VotacionesXAnnoDto } from "@interface/external/camara-diputados/votaciones/votaciones-x-anno.dto";
import { VotacionesXProyectoLeyDto } from "@interface/external/camara-diputados/votaciones/votaciones-x-proyecto-ley.dto";

const router = Router();

router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Votaciones API endpoint" });
});

/* Detalle de Votaciones */
router.get("/detalleVotacion", async (req: Request<{}, {}, DetalleVotacionRequest>, res: Response): Promise<void> => {
  const id = (req.query?.id as string) || (req.body as any)?.id;
  try {
    if (!id) {
      res.status(400).json({ message: "El parámetro 'id' es requerido" });
      return;
    }
    const endpoint = CONFIG.getEndpoint("Legislativo", "legislativo_votacion_detalle");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { prmVotacionId: id });
    console.log(url);
    const data: DetalleVotacionDto = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching detalleVotacion", error: error.message });
  }
});


/* Votaciones por Año */
router.get("/votacionesXAnno", async (req: Request<{}, {}, VotacionesXAnnoRequest>, res: Response): Promise<void> => {
  const year = (req.query?.year as string) || (req.body as any)?.year;
  try {
    if (!year) {
      res.status(400).json({ message: "El parámetro 'year' es requerido" });
      return;
    }
    const endpoint = CONFIG.getEndpoint("Legislativo", "legislativo_votaciones_x_anno");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { prmAnno: year });
    console.log(url);
    const data: VotacionesXAnnoDto = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching votaciones", error: error.message });
  }
});

/* Votaciones por Proyecto de Ley */
router.get("/votacionesXProyectoLey", async (req: Request<{}, {}, VotacionesXProyectoLeyRequest>, res: Response): Promise<void> => {
  const id = (req.query?.id as string) || (req.body as any)?.id;
  try {
    console.log('ID recibido:', id);
    if (!id) {
      res.status(400).json({ message: "El parámetro 'id' es requerido" });
      return;
    }
    const endpoint = CONFIG.getEndpoint("Legislativo", "legislativo_votaciones_x_proyecto_ley");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { prmNumeroBoletin: id });
    console.log(url);
    const data: VotacionesXProyectoLeyDto = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching votaciones", error: error.message });
  }
});


export default router;
