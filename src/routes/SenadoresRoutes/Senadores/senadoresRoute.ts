// import { Router, Request, Response } from "express";
// import { fetchAndProcessXml } from "@utils/xmlToJson";
// import { CONFIG } from "@config/endpoints-config";

// const router = Router();

// router.get("/on", (req: Request, res: Response) => {
//   res.status(200).json({ message: "Senadores API endpoint" });
// });

// router.get("/vigentes", async (req: Request, res: Response) => {
//   try {
//     const endpoint = CONFIG.getEndpoint("Senadores", "senadores_vigentes");
//     if (!endpoint) {
//       return res.status(404).json({ message: "Endpoint not found" });
//     }
//     const url = CONFIG.buildUrl(endpoint, {}, "senado");
//     const data = await fetchAndProcessXml(url);
//     res.status(200).json(data);
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: "Error fetching project votes", error: error.message });
//   }
// });

// export default router;
