import { SingleOrArray } from '../diputados/diputados.types';

export interface MateriaDto {
  Id: string;
  Nombre: string | null;
}

export interface MateriasColeccionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  Materia: SingleOrArray<MateriaDto>;
}

export interface MateriasDto {
  MateriasColeccion: MateriasColeccionDto;
}

