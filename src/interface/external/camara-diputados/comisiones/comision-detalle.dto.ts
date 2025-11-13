import { ISODateString, SingleOrArray } from '../diputados/diputados.types';

export interface DiputadoDto {
  Id: string;
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
}

export interface DiputadoIntegranteDto {
  FechaInicio: ISODateString;
  FechaTermino: ISODateString | null;
  Diputado: DiputadoDto;
}

export interface PresidentesHistoricoDto {
  DiputadoIntegrante: SingleOrArray<DiputadoIntegranteDto>;
}

export interface ComisionDetalleDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  Id: string;
  Nombre: string;
  NombreWeb: string;
  Alias: string;
  Tipo: Record<string, string>;
  FechaInicio: ISODateString | null;
  FechaConstitucion: ISODateString | null;
  FechaTermino: ISODateString | null;
  Correo: string | null;
  Telefono: string | null;
  Fax: string | null;
  Numero: string;
  PresidentesHistorico?: PresidentesHistoricoDto;
  Presidente?: DiputadoDto;
}

export interface ComisionResponseDto {
  Comision: ComisionDetalleDto;
}

