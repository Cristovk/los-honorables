import { ISODateString, SingleOrArray } from '../diputados/diputados.types';

export interface LegislaturaDto {
  Id: string;
  Numero: string;
  FechaInicio: ISODateString;
  FechaTermino: ISODateString;
  Tipo: Record<string, string>;
}

export interface LegislaturasColeccionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  Legislatura: SingleOrArray<LegislaturaDto>;
}

export interface LegislaturasDto {
  LegislaturasColeccion: LegislaturasColeccionDto;
}

