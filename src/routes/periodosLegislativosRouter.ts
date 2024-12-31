import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "../utils/xmlToJson.ts";

const router = Router();

router.get("/periodosLegislativos", async (req: Request, res: Response) => {
  try {
    const url = `https://opendata.camara.cl/wscamaradiputados.asmx/getPeriodosLegislativos`;

    // Aquí corregimos el rootTag
    const data = await fetchAndProcessXml(url, "PeriodoLegislativo");

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
    const url = `https://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarPeriodoLegislativoActual?`;

    // Aquí corregimos el rootTag
    const data = await fetchAndProcessXml(url, "PeriodoLegislativo");

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching periodos legislativos",
      error: error.message,
    });
  }
});

export default router;
