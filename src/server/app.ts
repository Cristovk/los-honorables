import express, { Application } from "express";
import projectsRoute from "../routes/projectsRoute.ts";
import periodosLegislativosRouter from "../routes/periodosLegislativosRouter.ts";
import senadoresRoute from "../routes/senadoresRoute.ts";

const app: Application = express();

app.use(express.json());

app.use("/projects", projectsRoute);
app.use("/periodosLegislativos", periodosLegislativosRouter);
app.use("/senadores", senadoresRoute);
// app.use('/votaciones', votacionesRoute);
// app.use('/diputados', diputadosRoute);

export default app;
