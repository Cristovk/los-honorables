import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "../utils/xmlToJson.ts";

const router = Router();

router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Projects API endpoint" });
});

router.get("/vigentes", async (req: Request, res: Response) => {
  try {
    const url = `https://opendata.camara.cl/camaradiputados/WServices/WSDiputado.asmx/retornarDiputadosPeriodoActual?`;
    const data = await fetchAndProcessXml(url, "DiputadoPeriodo");
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching project votes", error: error.message });
  }
});

export default router;
