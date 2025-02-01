import { Router, Request, Response } from "express";
import { fetchAndProcessXml } from "../utils/xmlToJson.ts";

const router = Router();

router.get("/on", (req: Request, res: Response) => {
  res.status(200).json({ message: "Votaciones API endpoint" });
});