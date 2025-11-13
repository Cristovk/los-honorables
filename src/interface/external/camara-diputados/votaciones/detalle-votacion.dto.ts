import { ISODateString, SingleOrArray } from '../diputados/diputados.types';

export interface DiputadoDto {
  Id: string;
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
}

export interface VotoDto {
  Diputado: DiputadoDto;
  OpcionVoto: Record<string, string>;
}

export interface VotosDto {
  Voto: SingleOrArray<VotoDto>;
}

export interface VotacionDetalleDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
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
  Votos: VotosDto;
}

export interface DetalleVotacionDto {
  Votacion: VotacionDetalleDto;
}

