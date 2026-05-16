import { SingleOrArray } from '../diputados/diputados.types';

export interface TramiteReglamentarioDto {
  Id: string;
  _: string;
}

export interface TramitesReglamentariosColeccionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  TramiteReglamentario: SingleOrArray<TramiteReglamentarioDto>;
}

export interface TramitesReglamentariosDto {
  TramitesReglamentariosColeccion: TramitesReglamentariosColeccionDto;
}

