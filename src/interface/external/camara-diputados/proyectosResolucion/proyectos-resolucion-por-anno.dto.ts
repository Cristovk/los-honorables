import { ISODateString, SingleOrArray } from '../diputados/diputados.types';

export interface ProyectoResolucionResumenDto {
  Id: string;
  Numero: string;
  Materia: string;
  FechaIngreso: ISODateString;
  Estado: Record<string, string>;
}

export interface ProyectosResolucionColeccionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  ProyectoResolucion: SingleOrArray<ProyectoResolucionResumenDto>;
}

export interface ProyectosResolucionPorAnnoDto {
  ProyectosResolucionColeccion: ProyectosResolucionColeccionDto;
}

