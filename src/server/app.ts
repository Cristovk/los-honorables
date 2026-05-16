import express, { Application } from "express";
import projectsRoute from "@diputadosRoutes/Proyectos/projectsRoute";
import periodosLegislativosRouter from "@diputadosRoutes/PeriodosLegislativos/periodosLegislativosRouter";
// import senadoresRoute from "@senadoresRoutes/Senadores/senadoresRoute";
import diputadosRoute from "@diputadosRoutes/Diputados/diputadosRoute";
import legislativosRoute from "@diputadosRoutes/Legislativo/legislativo.router";
import salaRoute from "@diputadosRoutes/Sala/servicioSala.router";
import votacionesRoute from "@diputadosRoutes/Votaciones/votaciones.router";
// Nuevas rutas
import comisionesRoute from "@diputadosRoutes/Comisiones/comisiones.router";
import proyectosAcuerdoRoute from "@diputadosRoutes/ProyectosAcuerdo/proyectosAcuerdo.router";
import proyectosResolucionRoute from "@diputadosRoutes/ProyectosResolucion/proyectosResolucion.router";
import comunesRoute from "@diputadosRoutes/Comunes/comunes.router";

const app: Application = express();

app.use(express.json());

// Rutas existentes
app.use("/projects", projectsRoute);
app.use("/periodosLegislativos", periodosLegislativosRouter);
// app.use("/senadores", senadoresRoute);  // Pendiente implementación
app.use("/diputados", diputadosRoute);
app.use("/legislativos", legislativosRoute);
app.use("/servicioSala", salaRoute);
app.use("/votaciones", votacionesRoute);

// Nuevas rutas - Cobertura completa de endpoints
app.use("/comisiones", comisionesRoute);
app.use("/proyectosAcuerdo", proyectosAcuerdoRoute);
app.use("/proyectosResolucion", proyectosResolucionRoute);
app.use("/comunes", comunesRoute);


export default app;
