import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "@utils/xmlToJson";
import { CONFIG } from "@config/endpoints-config";
import { PeriodosLegislativosDto } from "@interface/external/camara-diputados/periodosLegislativos/periodos-legislativos.dto";
import { PeriodoLegislativoResponseDto } from "@interface/external/camara-diputados/periodosLegislativos/periodo-actual.dto";

const router = Router();


router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Periodos legislativos API endpoint" });
});

router.get("/periodosLegislativos", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Legislativo_periodo", "legislativo_periodos");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
    }
    const url = CONFIG.buildUrl(endpoint);

    // Aquí corregimos el rootTag
    const data: PeriodosLegislativosDto = await fetchAndProcessXml(url);

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching periodos legislativos",
      error: error.message,
    });
  }
});

router.get("/periodoActual", async (req: Request, res: Response) => {
  try {
    const endpoint = CONFIG.getEndpoint("Legislativo_periodo", "legislativo_periodo_actual");
    if (!endpoint) {
      res.status(404).json({ message: "Endpoint not found" });
    }
    const url = CONFIG.buildUrl(endpoint);
    // Aquí corregimos el rootTag
    const data: PeriodoLegislativoResponseDto = await fetchAndProcessXml(url);

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching periodos legislativos",
      error: error.message,
    });
  }
});

export default router;
