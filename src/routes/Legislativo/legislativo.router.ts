import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "../../utils/xmlToJson.ts";
import  properties  from "../../server/properties.ts";

const router = Router();


router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Legislativo API endpoint" });
});



router.get("/mocionesXAnno", async (req: Request, res: Response) => {
  const { year } = req.body;
  try {
    const url = `${properties.BASE_URL}${properties.SERVICES.LEGISLATIVO.MOCIONES_POR_ANNO}?prmAnno=${year}`;
    console.log(url);
    const data = await fetchAndProcessXml(url, "ProyectoLey"); // Cambia 'Mocion' según el nodo raíz del XML
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching mociones"  });
  }
});

router.get("/mensajesXAnno", async (req: Request, res: Response) => {
  const { year } = req.body;
  try {
    const url = `${properties.BASE_URL}${properties.SERVICES.LEGISLATIVO.MENSAJES_POR_ANNO}?prmAnno=${year}`;
    console.log(url);
    const data = await fetchAndProcessXml(url, "ProyectoLey"); // Cambia 'Mensaje' según el nodo raíz del XML
    res.status(200).json(data);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching mensajes", error: error.message });
  }
});

// MATERIAS
router.get("/materias", async (req: Request, res: Response) => {
    try {
      const url = `${properties.BASE_URL}${properties.SERVICES.LEGISLATIVO.MATERIAS}`;
      console.log(url);
      const data = await fetchAndProcessXml(url, "Materia"); // Cambia 'Material' según el nodo raíz del XML
      const totalMaterias = data.length;
      res.status(200).json( { totalMaterias, data });
    }
    catch (error: any) {
      res
        .status(500)
        .json({ message: "Error fetching materias", error: error.message });
    }
  });



export default router;