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

export interface VotoDto {
  Diputado?: DiputadoDto;
  OpcionVoto?: Record<string, string>;
}

export interface VotosDto {
  Voto: SingleOrArray<VotoDto>;
}

export interface VotacionDto {
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

export interface LegislaturaDto {
  Id?: string;
  Numero?: string;
  FechaInicio?: ISODateString;
  FechaTermino?: ISODateString;
  Tipo?: Record<string, string>;
}

export interface LegislaturasDto {
  Legislatura: SingleOrArray<LegislaturaDto>;
}

export interface DiputadoPeriodoDto {
  Id?: string;
  FechaInicio?: ISODateString;
  FechaTermino?: ISODateString;
  Diputado?: DiputadoDto;
}

export interface DiputadosPeriodoDto {
  DiputadoPeriodo: SingleOrArray<DiputadoPeriodoDto>;
}

export interface PeriodoDto {
  Id: string;
  Nombre: string;
  FechaInicio: ISODateString;
  FechaTermino: ISODateString;
  Legislaturas: LegislaturasDto;
  Diputados: DiputadosPeriodoDto;
}

export interface OficioDto {
  Id: string;
  Numero: string;
  FechaDespacho: ISODateString;
  FechaEntrega: ISODateString;
  Destinatario: string;
  DestinatarioId: string;
}

export interface OficiosEnviadosDto {
  Oficio: SingleOrArray<OficioDto>;
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

export interface ProyectoResolucionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  Id: string;
  Numero: string;
  Materia: string;
  FechaIngreso: ISODateString;
  Estado: Record<string, string>;
  Votacion: VotacionDto;
  Autores: AutoresDto;
  Periodo: PeriodoDto;
  OficiosEnviados?: OficiosEnviadosDto;
  RespuestasRecibidas?: RespuestasRecibidasDto;
}

export interface ProyectoResolucionDetalleDto {
  ProyectoResolucion: ProyectoResolucionDto;
}

