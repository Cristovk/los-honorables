import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "@utils/xmlToJson";
import CONFIG from "@config/endpoints-config";
import { DiputadoDetalleRequest, DiputadoPorPeriodoRequest } from "@interface/request.interface";

const router = Router();

router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Diputados API endpoint" });
});

router.get("/vigentes", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Diputato", "diputado_periodo_actual");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
    }
    const url = CONFIG.buildUrl(endpoint);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching diputados vigentes", error: error.message });
  }
});

/* Detalle de un diputado */
router.get("/detalle", async (req: Request<{}, {}, DiputadoDetalleRequest>, res: Response) => {
  const { diputadoId } = req.body;
  try {
    if (!diputadoId) {
      res.status(400).json({ message: "El parámetro 'diputadoId' es requerido" });
      return;
    }
    const endpoint = CONFIG.getEndpoint("Diputato", "diputado_detalle");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { prmDiputadoId: diputadoId });
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching detalle diputado", error: error.message });
  }
});

/* Lista de todos los diputados */
router.get("/lista", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Diputato", "diputado_lista");
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
      .json({ message: "Error fetching lista diputados", error: error.message });
  }
});

/* Diputados por período */
router.get("/porPeriodo", async (req: Request<{}, {}, DiputadoPorPeriodoRequest>, res: Response) => {
  const { periodoId } = req.body;
  try {
    if (!periodoId) {
      res.status(400).json({ message: "El parámetro 'periodoId' es requerido" });
      return;
    }
    const endpoint = CONFIG.getEndpoint("Diputato", "diputado_por_periodo");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { prmPeriodoID: periodoId });
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching diputados por período", error: error.message });
  }
});

export default router;
