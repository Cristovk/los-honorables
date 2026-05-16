import { ISODateString, SingleOrArray } from '../diputados/diputados.types';

export interface PeriodoMinDto {
  Id: string;
  Nombre: string;
}

export interface ProyectoAcuerdoResumenDto {
  Id: string;
  Numero: string;
  Materia: string;
  FechaIngreso: ISODateString;
  Estado: Record<string, string>;
  Periodo: PeriodoMinDto;
}

export interface ProyectosAcuerdosColeccionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  ProyectoAcuerdo?: SingleOrArray<ProyectoAcuerdoResumenDto>;
}

export interface ProyectosAcuerdoPorAnnoDto {
  ProyectosAcuerdosColeccion: ProyectosAcuerdosColeccionDto;
}

