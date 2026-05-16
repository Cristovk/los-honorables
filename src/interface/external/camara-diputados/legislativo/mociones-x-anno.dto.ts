import { ISODateString, SingleOrArray } from '../diputados/diputados.types';

export interface ProyectoLeyResumenDto {
  Id: string;
  NumeroBoletin: string;
  Nombre: string;
  FechaIngreso: ISODateString;
  TipoIniciativa: Record<string, string>;
  CamaraOrigen: Record<string, string>;
  Admisible: string;
}

export interface ProyectosLeyColeccionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  ProyectoLey: SingleOrArray<ProyectoLeyResumenDto>;
}

export interface MocionesXAnnoDto {
  ProyectosLeyColeccion: ProyectosLeyColeccionDto;
}

