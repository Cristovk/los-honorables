import { ISODateString, SingleOrArray } from '../diputados/diputados.types';

export interface LegislaturaDto {
  Id: string;
  Numero: string;
  FechaInicio: ISODateString;
  FechaTermino: ISODateString;
  Tipo: Record<string, string>;
}

export interface LegislaturasDto {
  Legislatura: SingleOrArray<LegislaturaDto>;
}

export interface PeriodoLegislativoDto {
  Id: string;
  Nombre: string;
  FechaInicio: ISODateString;
  FechaTermino: ISODateString;
  Legislaturas: LegislaturasDto | null;
}

export interface PeriodosLegislativosColeccionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  PeriodoLegislativo: SingleOrArray<PeriodoLegislativoDto>;
}

export interface PeriodosLegislativosDto {
  PeriodosLegislativosColeccion: PeriodosLegislativosColeccionDto;
}

