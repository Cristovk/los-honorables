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

export interface AsistenciaItemDto {
  TipoAsistencia: Record<string, string>;
  Justificacion?: JustificacionDto;
  Diputado: DiputadoDto;
  TipoTitularAsistencia: Record<string, string>;
}

export interface AsistenciaDto {
  Asistencia: SingleOrArray<AsistenciaItemDto> | null;
}

export interface PeriodoLegislativoMinDto {
  Id: string;
  Nombre: string;
}

export interface SesionComisionDto {
  Id: string;
  Numero: string;
  Tipo: Record<string, string>;
  FechaInicio: ISODateString;
  FechaTermino: ISODateString;
  Estado: Record<string, string>;
  PeriodoLegislativo: PeriodoLegislativoMinDto;
  Asistencia?: AsistenciaDto | null;
}

export interface SesionesDto {
  SesionComision: SingleOrArray<SesionComisionDto>;
}

export interface ComisionSesionesDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  Id: string;
  Nombre: string;
  Sesiones: SesionesDto;
}

export interface SesionesXComisionYAnnoDto {
  Comision: ComisionSesionesDto;
}

