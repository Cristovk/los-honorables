import { ISODateString, SingleOrArray } from '../diputados/diputados.types';

export interface SesionResumenDto {
  Id: string;
  Numero: string;
  FechaInicio: ISODateString;
  FechaTermino: ISODateString;
  Tipo: Record<string, string>;
  Estado: Record<string, string>;
}

export interface SesionesSalaColeccionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  Sesion: SingleOrArray<SesionResumenDto>;
}

export interface SesionesXLegislaturaDto {
  SesionesSalaColeccion: SesionesSalaColeccionDto;
}

