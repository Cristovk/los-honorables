import { Router, Request, Response } from 'express';
import { fetchAndProcessXml } from '../utils/xmlToJson.ts';

const router = Router();



router.get('/on', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Projects API endpoint' });
});

router.get('/:boletin', async (req: Request, res: Response) => {
  const { boletin } = req.params;

  try {
    const url = `https://opendata.camara.cl/pages/votacion_boletin.aspx?boletin=${boletin}`;
    const data = await fetchAndProcessXml(url, 'Votacion'); // Cambia 'Votacion' según el nodo raíz del XML
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching project votes', error: error.message });
  }
});


export default router;
