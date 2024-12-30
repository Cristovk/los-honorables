import express, { Application } from 'express';
import projectsRoute from '../routes/projectsRoute.ts'; // Agrega la extensión .ts

const app: Application = express();

app.use(express.json());


app.use('/projects', projectsRoute);

export default app;