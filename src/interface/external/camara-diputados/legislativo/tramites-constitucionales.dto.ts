import { SingleOrArray } from '../diputados/diputados.types';

export interface TramiteConstitucionalDto {
  Id: string;
  _: string;
}

export interface TramitesConstitucionalesColeccionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  TramiteConstitucional: SingleOrArray<TramiteConstitucionalDto>;
}

export interface TramitesConstitucionalesDto {
  TramitesConstitucionalesColeccion: TramitesConstitucionalesColeccionDto;
}

