import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "@utils/xmlToJson";
import { CONFIG } from "@config/endpoints-config";
import {
  ProyectoResolucionDetalleRequest,
  ProyectoResolucionPorAnnoRequest
} from "@interface/request.interface";
import { ProyectoResolucionDetalleDto } from "@interface/external/camara-diputados/ProyectosResolucion/proyecto-resolucion-detalle.dto";
import { ProyectosResolucionPorAnnoDto } from "@interface/external/camara-diputados/ProyectosResolucion/proyectos-resolucion-por-anno.dto";

const router = Router();

router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Proyectos de Resolución API endpoint" });
});

/* Detalle de un proyecto de resolución */
router.get("/detalle", async (req: Request<{}, {}, ProyectoResolucionDetalleRequest>, res: Response) => {
  const { idProyectoResolucion } = req.body;
  try {
    if (!idProyectoResolucion) {
      res.status(400).json({ message: "El parámetro 'idProyectoResolucion' es requerido" });
      return;
    }
    const endpoint = CONFIG.getEndpoint("ProyectoResolucion", "proyecto_resolucion_detalle");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { idProyectoResolucion });
    console.log(url);
    const data: ProyectoResolucionDetalleDto = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching detalle proyecto de resolución", error: error.message });
  }
});

/* Proyectos de resolución por año */
router.get("/porAnno", async (req: Request<{}, {}, ProyectoResolucionPorAnnoRequest>, res: Response) => {
  const { anno } = req.body;
  try {
    if (!anno) {
      res.status(400).json({ message: "El parámetro 'anno' es requerido" });
      return;
    }
    const endpoint = CONFIG.getEndpoint("ProyectoResolucion", "proyecto_resolucion_por_anno");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { anno });
    console.log(url);
    const data: ProyectosResolucionPorAnnoDto = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching proyectos de resolución por año", error: error.message });
  }
});

export default router;
