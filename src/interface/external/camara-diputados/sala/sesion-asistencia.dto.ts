import { ISODateString, SingleOrArray } from '../diputados/diputados.types';

export interface DiputadoDto {
  Id: string;
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
}

export interface JustificacionDto {
  Valor: string;
  Nombre: string;
  RebajaAsistencia: string;
  RebajaQuorum: string;
}

export interface AsistenciaDto {
  TipoAsistencia: Record<string, string>;
  Justificacion?: JustificacionDto;
  Diputado: DiputadoDto;
}

export interface ListadoAsistenciaDto {
  Asistencia: SingleOrArray<AsistenciaDto>;
}

export interface SesionSalaDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  Id: string;
  Numero: string;
  FechaInicio: ISODateString;
  FechaTermino: ISODateString;
  Tipo: Record<string, string>;
  Estado: Record<string, string>;
  ListadoAsistencia: ListadoAsistenciaDto;
}

export interface SesionAsistenciaDto {
  SesionSala: SesionSalaDto;
}

