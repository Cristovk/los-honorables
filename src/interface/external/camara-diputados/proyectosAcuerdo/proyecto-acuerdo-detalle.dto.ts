import { ISODateString, SingleOrArray } from '../diputados/diputados.types';

export interface DiputadoDto {
  Id: string;
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
}

export interface ParlamentarioAutorDto {
  Orden: string;
  Diputado?: DiputadoDto;
  Senador?: DiputadoDto;
}

export interface AutoresDto {
  ParlamentarioAutor: SingleOrArray<ParlamentarioAutorDto>;
}

export interface PeriodoMinDto {
  Id: string;
  Nombre: string;
}

export interface RespuestaDto {
  Id: string;
  Numero: string;
  Fecha: ISODateString;
  Remitente: string;
  RemitenteId: string;
}

export interface RespuestasRecibidasDto {
  Respuesta: SingleOrArray<RespuestaDto>;
}

export interface ProyectoAcuerdoDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  Id: string;
  Numero: string;
  Materia: string;
  FechaIngreso: ISODateString;
  Estado: Record<string, string>;
  Autores: AutoresDto;
  Periodo: PeriodoMinDto;
  RespuestasRecibidas?: RespuestasRecibidasDto;
}

export interface ProyectoAcuerdoDetalleDto {
  ProyectoAcuerdo: ProyectoAcuerdoDto;
}

