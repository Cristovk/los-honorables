import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "../../utils/xmlToJson.ts";
import  properties  from "../../server/properties.ts";

const router = Router();


router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Periodos legislativos API endpoint" });
});

router.get("/periodosLegislativos", async (req: Request, res: Response) => {
  try {
    const url = `${properties.BASE_URL}${properties.SERVICES.PERIODO_LEGISLATIVO.PERIODO_LEGISLATURA_TODOS}`;
  
    // Aquí corregimos el rootTag
    const data = await fetchAndProcessXml(url);

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
    const url = `${properties.BASE_URL}${properties.SERVICES.PERIODO_LEGISLATIVO.LEGISLATURA_ACTUAL}?`;
    // Aquí corregimos el rootTag
    const data = await fetchAndProcessXml(url);

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching periodos legislativos",
      error: error.message,
    });
  }
});

export default router;
