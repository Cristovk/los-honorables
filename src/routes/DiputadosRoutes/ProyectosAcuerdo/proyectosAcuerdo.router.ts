import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "@utils/xmlToJson";
import { CONFIG } from "@config/endpoints-config";
import {
  ProyectoAcuerdoDetalleRequest,
  ProyectoAcuerdoPorAnnoRequest
} from "@interface/request.interface";
import { ProyectosAcuerdoPorAnnoDto } from "@interface/external/camara-diputados/proyectosAcuerdo/proyectos-acuerdo-por-anno.dto";
import { ProyectoAcuerdoDetalleDto } from "@interface/external/camara-diputados/proyectosAcuerdo/proyecto-acuerdo-detalle.dto";

const router = Router();

router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Proyectos de Acuerdo API endpoint" });
});

/* Detalle de un proyecto de acuerdo */
router.get("/detalle", async (req: Request<{}, {}, ProyectoAcuerdoDetalleRequest>, res: Response) => {
  const { idProyectoAcuerdo } = req.body;
  try {
    if (!idProyectoAcuerdo) {
      res.status(400).json({ message: "El parámetro 'idProyectoAcuerdo' es requerido" });
      return;
    }
    const endpoint = CONFIG.getEndpoint("ProyectoAcuerdo", "proyecto_acuerdo_detalle");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { idProyectoAcuerdo });
    console.log(url);
    const data: ProyectoAcuerdoDetalleDto = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching detalle proyecto de acuerdo", error: error.message });
  }
});

/* Proyectos de acuerdo por año */
router.get("/porAnno", async (req: Request<{}, {}, ProyectoAcuerdoPorAnnoRequest>, res: Response) => {
  const { anno } = req.body;
  try {
    if (!anno) {
      res.status(400).json({ message: "El parámetro 'anno' es requerido" });
      return;
    }
    const endpoint = CONFIG.getEndpoint("ProyectoAcuerdo", "proyecto_acuerdo_por_anno");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { anno });
    console.log(url);
    const data: ProyectosAcuerdoPorAnnoDto = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching proyectos de acuerdo por año", error: error.message });
  }
});

export default router;
