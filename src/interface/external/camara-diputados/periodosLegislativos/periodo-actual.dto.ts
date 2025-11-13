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

export interface PeriodoLegislativoActualDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  Id: string;
  Nombre: string;
  FechaInicio: ISODateString;
  FechaTermino: ISODateString;
  Legislaturas: LegislaturasDto;
}

export interface PeriodoLegislativoResponseDto {
  PeriodoLegislativo: PeriodoLegislativoActualDto;
}

