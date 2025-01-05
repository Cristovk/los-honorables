// src/routes/index.ts
import { Router } from "express";
import diputadosModule from "./Diputado";
import projectsRoute from "./projectsRoute";
import periodosLegislativosRouter from "./periodosLegislativosRouter";

const router = Router();

// Define una interfaz para la estructura de las rutas
interface RouteModule {
  path: string;
  router: Router;
}

// Asegúrate que todos los módulos sigan la misma estructura
const routes: RouteModule[] = [
  { path: "/diputados", router: diputadosModule.router }, // Asumiendo que diputadosModule tiene {path, router}
  { path: "/projects", router: projectsRoute },
  { path: "/periodosLegislativos", router: periodosLegislativosRouter },
];

// Monta cada módulo de rutas
routes.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
