import express, { Application } from "express";
import projectsRoute from "../routes/Proyectos/projectsRoute.ts";
import periodosLegislativosRouter from "../routes/PeriodosLegislativos/periodosLegislativosRouter.ts";
import senadoresRoute from "../routes/Senadores/senadoresRoute.ts";
import diputadosRoute from "../routes/Diputados/diputadosRoute.ts";
import legislativosRoute from "../routes/Legislativo/legislativo.router.ts";
import salaRoute from "../routes/Sala/servicioSala.router.ts";
import votacionesRoute from "../routes/Votaciones/votaciones.router.ts";

const app: Application = express();

app.use(express.json());

app.use("/projects", projectsRoute);
app.use("/periodosLegislativos", periodosLegislativosRouter);
app.use("/senadores", senadoresRoute);
app.use("/diputados", diputadosRoute);
app.use("/legislativos", legislativosRoute);
app.use("/servicioSala", salaRoute);
app.use("/votaciones", votacionesRoute);


export default app;
