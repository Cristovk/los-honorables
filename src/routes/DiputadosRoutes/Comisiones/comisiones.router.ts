import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "@utils/xmlToJson";
import { CONFIG } from "@config/endpoints-config";
import { 
  ComisionSesionesXComisionYAnnoRequest, 
  ComisionDetalleRequest, 
  ComisionPorPeriodoRequest 
} from "@interface/request.interface";

const router = Router();

router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Comisiones API endpoint" });
});

/* Sesiones de una comisión en un año específico */
router.get("/sesionesXComisionYAnno", async (req: Request<{}, {}, ComisionSesionesXComisionYAnnoRequest>, res: Response) => {
  const { comisionId, anno } = req.body;
  try {
    if (!comisionId || !anno) {
      res.status(400).json({ message: "Los parámetros 'comisionId' y 'anno' son requeridos" });
      return;
    }
    const endpoint = CONFIG.getEndpoint("Comisión", "comision_sesiones_x_comision_y_anno");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { prmComisionId: comisionId, prmAnno: anno });
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching sesiones de comisión", error: error.message });
  }
});

/* Detalle de una comisión */
router.get("/detalle", async (req: Request<{}, {}, ComisionDetalleRequest>, res: Response) => {
  const { comisionId } = req.body;
  try {
    if (!comisionId) {
      res.status(400).json({ message: "El parámetro 'comisionId' es requerido" });
      return;
    }
    const endpoint = CONFIG.getEndpoint("Comisión", "comision_detalle");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { prmComisionId: comisionId });
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching detalle de comisión", error: error.message });
  }
});

/* Comisiones vigentes */
router.get("/vigentes", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Comisión", "comision_vigentes");
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
      .json({ message: "Error fetching comisiones vigentes", error: error.message });
  }
});

/* Comisiones por período */
router.get("/porPeriodo", async (req: Request<{}, {}, ComisionPorPeriodoRequest>, res: Response) => {
  const { periodoId } = req.body;
  try {
    if (!periodoId) {
      res.status(400).json({ message: "El parámetro 'periodoId' es requerido" });
      return;
    }
    const endpoint = CONFIG.getEndpoint("Comisión", "comision_por_periodo");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
      return;
    }
    const url = CONFIG.buildUrl(endpoint, { prmPeriodoId: periodoId });
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching comisiones por período", error: error.message });
  }
});

export default router;