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

export interface MateriaDto {
  Id: string;
  Nombre: string;
}

export interface MateriasDto {
  Materia: SingleOrArray<MateriaDto>;
}

export interface VotacionProyectoLeyDto {
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
  TipoVotacionProyectoLey: Record<string, string>;
  Articulo?: string | null;
  TramiteConstitucional: { Id: string; _: string };
  TramiteReglamentario: { Id: string; _: string };
}

export interface VotacionesDto {
  VotacionProyectoLey: SingleOrArray<VotacionProyectoLeyDto>;
}

export interface ProyectoLeyDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  Id: string;
  NumeroBoletin: string;
  Nombre: string;
  FechaIngreso: ISODateString;
  TipoIniciativa: Record<string, string>;
  CamaraOrigen: Record<string, string>;
  Autores: AutoresDto;
  Votaciones: VotacionesDto;
  Materias: MateriasDto;
  Admisible: string;
}

export interface VotacionesXProyectoLeyDto {
  ProyectoLey: ProyectoLeyDto;
}

