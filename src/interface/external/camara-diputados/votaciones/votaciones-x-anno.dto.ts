import { ISODateString, SingleOrArray } from '../diputados/diputados.types';

export interface VotacionResumenDto {
  Id: string;
  Descripcion: string;
  Fecha: ISODateString;
  TotalSi: string;
  TotalNo: string;
  TotalAbstencion: string;
  TotalDispensado: string;
  Quorum: Record<string, string>;
  Resultado: Record<string, string>;
  Tipo: Record<string, string>;
}

export interface VotacionesColeccionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  Votacion: SingleOrArray<VotacionResumenDto>;
}

export interface VotacionesXAnnoDto {
  VotacionesColeccion: VotacionesColeccionDto;
}

