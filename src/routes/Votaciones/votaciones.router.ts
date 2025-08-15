import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "../../utils/xmlToJson.ts";
import  properties  from "../../server/properties.ts";

const router = Router();

router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Votaciones API endpoint" });
});

/* Detalle de Votaciones */
router.get("/detalleVotacion", async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const url = `${properties.BASE_URL}${properties.SERVICES.LEGISLATIVO.VOTACION_DETALLE}?prmVotacionId=${id}`;
    console.log(url);
    const data = await fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching detalleVotacion", error: error.message });
  }
});


/* Votaciones por Año */
router.get("/votacionesXAnno", async (req: Request, res: Response) => {
  const { year } = req.body;
  try {
    const url = `${properties.BASE_URL}${properties.SERVICES.LEGISLATIVO.VOTACIONES_POR_ANNO}?prmAnno=${year}`;
    console.log(url);
    const data = await fetchAndProcessXml(url); // Cambia 'Votacion' según el nodo raíz del XML
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching votaciones", error: error.message });
  }
});

/* Votaciones por Proyecto de Ley */
router.get("/votacionesXProyectoLey", async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const url = `${properties.BASE_URL}${properties.SERVICES.LEGISLATIVO.VOTACIONES_POR_PROYECTO_LEY}?prmProyectoLeyId=${id}`;
    console.log(url);
    const data = await  fetchAndProcessXml(url);
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching votaciones", error: error.message });
  }
});


export default router;