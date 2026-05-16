import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "@utils/xmlToJson";
import CONFIG from "@config/endpoints-config";
import { BoletinRequest } from "@interface/request.interface";
import { VotacionesXProyectoLeyDto } from "@interface/external/camara-diputados/proyectos/proyecto-ley-votaciones.dto";

const router = Router();

router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Projects API endpoint" });
});

router.get("/boletin", async (req: Request<{}, {}, BoletinRequest>, res: Response) => {
  const { boletin } = req.body;

  console.log(boletin);
  try {
    const endpoint = CONFIG.getEndpoint("Legislativo", "legislativo_votaciones_x_proyecto_ley");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
    }
    const url = CONFIG.buildUrl(endpoint, { prmNumeroBoletin: boletin });
    const data: VotacionesXProyectoLeyDto = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching project votes", error: error.message });
  }
});

export default router;
