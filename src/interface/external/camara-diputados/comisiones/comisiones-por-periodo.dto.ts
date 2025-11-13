import { ISODateString, SingleOrArray } from '../diputados/diputados.types';

export interface DiputadoDto {
  Id: string;
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
}

export interface ComisionResumenDto {
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
  Presidente?: DiputadoDto;
}

export interface ComisionesColeccionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  Comision: SingleOrArray<ComisionResumenDto>;
}

export interface ComisionesPorPeriodoDto {
  ComisionesColeccion: ComisionesColeccionDto;
}

