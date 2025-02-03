import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "../../utils/xmlToJson.ts";
import  properties  from "../../server/properties.ts";

const router = Router();


router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Servicio Sala API endpoint" });
});

/* Asistencia a Sesiones */
router.get("/sesionAsistencia", async (req: Request, res: Response) => {
  try {
    const url = `${properties.BASE_URL}${properties.SERVICES.SALA.SESION_ASISTENCIA}`;
    console.log(url);
    const data = await fetchAndProcessXml(url, "Asistencia"); // Cambia 'SesionAsistencia' según el nodo raíz del XML
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching sesionAsistencia", error: error.message });
  }
});



/* Sesiones de Asistencia */
router.get("/sesionesXAnno", async (req: Request, res: Response) => {
  const { year } = req.body;
  try {
    const url = `${properties.BASE_URL}${properties.SERVICES.SALA.SESIONES_POR_ANNO}?prmAnno=${year}`;
    console.log(url);
    const data = await fetchAndProcessXml(url, "Sesion"); // Cambia 'SesionAsistencia' según el nodo raíz del XML
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching sesiones", error: error.message });
  }
});

/* Sesiones por Legislatura */
router.get("/sesionesXLegislatura", async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const url = `${properties.BASE_URL}${properties.SERVICES.SALA.SESIONES_POR_LEGISLATURA}?prmLegislaturaId=${id}`;
    console.log(url);
    const data = await fetchAndProcessXml(url, "Sesion"); // Cambia 'SesionAsistencia' según el nodo raíz del XML
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching sesiones", error: error.message });
  }
});


export default router;