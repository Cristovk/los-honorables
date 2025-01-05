import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "@/utils/xmlToJson.js";
import { getPath } from "@/data";

const router = Router();

router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Projects API endpoint" });
});

// retornarDiputadosPeriodoActual
router.get("/diputadosVigentes", async (req: Request, res: Response) => {
  try {
    const url = getPath("DIPUTADO", "diputadosPeriodoActual");
    const data = await fetchAndProcessXml(url, "DiputadoPeriodo");
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching project votes", error: error.message });
  }
});

// retornarDiputado
router.get("/diputado/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const url = getPath("DIPUTADO", "diputado", id);
    console.log(url);
    const data = await fetchAndProcessXml(url, "Diputado");
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching diputado", error: error.message });
  }
});

// retornarDiputados
router.get("/diputadosAll", async (req: Request, res: Response) => {
  try {
    const url = getPath("DIPUTADO", "diputados");
    const data = await fetchAndProcessXml(url, "Diputado");
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching project votes", error: error.message });
  }
});

// retornarDiputadosXPeriodo
router.get(
  "/diputadosPeriodo/:periodo",
  async (req: Request, res: Response) => {
    try {
      const { periodo } = req.params;
      const url = getPath("DIPUTADO", "diputadosXPeriodo", periodo);
      const data = await fetchAndProcessXml(url, "DiputadoPeriodo");
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({
        message: "Error fetching project votes",
        error: error.message,
      });
    }
  }
);

export default router;
