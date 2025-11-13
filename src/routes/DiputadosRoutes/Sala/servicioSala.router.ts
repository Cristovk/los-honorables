import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "@utils/xmlToJson";
import { CONFIG } from "@config/endpoints-config";
import { SesionAsistenciaRequest, SesionesXAnnoRequest, SesionesXLegislaturaRequest } from "@interface/request.interface";
import { SesionAsistenciaDto } from "@interface/external/camara-diputados/sala/sesion-asistencia.dto";
import { SesionesXAnnoDto } from "@interface/external/camara-diputados/sala/sesiones-x-anno.dto";
import { SesionesXLegislaturaDto } from "@interface/external/camara-diputados/sala/sesiones-x-legislatura.dto";

const router = Router();


router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Servicio Sala API endpoint" });
});

/* Asistencia a Sesiones */
router.get("/sesionAsistencia", async (req: Request<{}, {}, SesionAsistenciaRequest>, res: Response) => {
  const { id } = req.body;
  try {
    const endpoint = CONFIG.getEndpoint("Sala", "sala_sesion_asistencia");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
    }
    const url = CONFIG.buildUrl(endpoint, { prmSesionId: id });
    console.log(url);
    const data: SesionAsistenciaDto = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching sesionAsistencia", error: error.message });
  }
});



/* Sesiones de Asistencia */
router.get("/sesionesXAnno", async (req: Request<{}, {}, SesionesXAnnoRequest>, res: Response) => {
  const { year } = req.body;
  try {
    const endpoint = CONFIG.getEndpoint("Sala", "sala_sesiones_por_anno");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
    }
    const url = CONFIG.buildUrl(endpoint, { prmAnno: year });
    console.log(url);
    const data: SesionesXAnnoDto = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching sesiones", error: error.message });
  }
});

/* Sesiones por Legislatura */
router.get("/sesionesXLegislatura", async (req: Request<{}, {}, SesionesXLegislaturaRequest>, res: Response) => {
  const { id } = req.body;
  try {
    const endpoint = CONFIG.getEndpoint("Sala", "sala_sesiones_por_legislatura");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
    }
    const url = CONFIG.buildUrl(endpoint, { prmLegislaturaId: id });
    console.log(url);
    const data: SesionesXLegislaturaDto = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching sesiones", error: error.message });
  }
});


export default router;
