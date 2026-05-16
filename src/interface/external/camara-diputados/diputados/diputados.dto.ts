import { ISODateString, SingleOrArray, GenderText } from './diputados.types';

/**
 * Comentario: DTO del Partido político. Refleja el esquema externo tal como es entregado por la API.
 * "Por qué": mantener una capa anticorrupción estable al mapear exactamente los campos de origen.
 */
export interface PartidoDto {
  Id: string;
  Nombre: string;
  Alias: string;
}

/**
 * Comentario: DTO de una militancia específica, incluyendo el partido y el rango de fechas.
 * "Por qué": las fechas de inicio/término son críticas para reconstruir el historial político.
 */
export interface MilitanciaDto {
  FechaInicio: ISODateString;
  FechaTermino: ISODateString;
  Partido: PartidoDto;
}

/**
 * Comentario: Contenedor de militancias. El conversor XML→JSON puede entregar uno o varios elementos.
 * "Por qué": usamos SingleOrArray para soportar ambos escenarios sin duplicar modelos.
 */
export interface MilitanciasDto {
  Militancia: SingleOrArray<MilitanciaDto>;
}

/**
 * Comentario: Información base de un diputado, reutilizada por respuestas de lista, período e individual.
 * "Por qué": centraliza atributos personales y de militancias para reducir inconsistencias entre endpoints.
 */
export interface DiputadoBaseDto {
  Id: string;
  Nombre: string;
  Nombre2: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  FechaNacimiento?: ISODateString;
  RUT: string;
  RUTDV: string;
  Sexo: {
    Valor: string;
    _text: GenderText; // restringimos al texto conocido de la API
  };
  Militancias: MilitanciasDto;
}

/**
 * Comentario: Asociación de un diputado a un período, con fechas de vigencia.
 * "Por qué": modela el vínculo temporal necesario para endpoints de período y vigentes.
 */
export interface DiputadoPeriodoDto {
  FechaInicio: ISODateString;
  FechaTermino: ISODateString | null;
  Diputado: DiputadoBaseDto;
}

/**
 * Comentario: Colección de objetos DiputadoPeriodo.
 * "Por qué": algunos responses pueden devolver uno o varios elementos; usamos SingleOrArray por robustez.
 */
export interface DiputadosPeriodoColeccionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  DiputadoPeriodo: SingleOrArray<DiputadoPeriodoDto>;
}

/**
 * Comentario: Envoltorio de respuesta estándar para endpoints de período (por período y vigentes).
 * "Por qué": uniforme para log y trazabilidad (endpoint, url, timestamp).
 */
export interface DiputadosPeriodoResponseDto {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: ISODateString;
  data: {
    DiputadosPeriodoColeccion: DiputadosPeriodoColeccionDto;
  };
}

/**
 * Comentario: Colección de diputados sin información de período.
 * "Por qué": algunos endpoints entregan el listado histórico completo.
 */
export interface DiputadosColeccionDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  Diputado: SingleOrArray<DiputadoBaseDto>;
}

/**
 * Comentario: Envoltorio de respuesta para listados sin período.
 * "Por qué": homogeneiza el consumo y logging.
 */
export interface DiputadosResponseDto {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: ISODateString;
  data: {
    DiputadosColeccion: DiputadosColeccionDto;
  };
}

/**
 * Comentario: DTO individual de un diputado. Incluye los atributos base y espacios de nombres del XML.
 * "Por qué": se mantiene el esquema externo para permitir mapeos posteriores sin pérdida de información.
 */
export interface DiputadoIndividualDto {
  'xmlns:xsi': string;
  'xmlns:xsd': string;
  'xmlns': string;
  Id: string;
  Nombre: string;
  Nombre2: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  FechaNacimiento?: ISODateString;
  RUT: string;
  RUTDV: string;
  Sexo: {
    Valor: string;
    _text: GenderText;
  };
  Militancias: MilitanciasDto;
}

/**
 * Comentario: Envoltorio de respuesta para detalle de diputado.
 * "Por qué": alinea el contrato de salida con el patrón general de respuestas.
 */
export interface DiputadoResponseDto {
  success: boolean;
  endpoint: string;
  url: string;
  timestamp: ISODateString;
  data: {
    Diputado: DiputadoIndividualDto;
  };
}

/**
 * Comentario: Aliases de conveniencia para mantener coherencia con la documentación original.
 * "Por qué": facilitan el uso directo por endpoint manteniendo una sola fuente de verdad.
 */
export type DiputadosXPeriodoResponseDto = DiputadosPeriodoResponseDto;
export type DiputadosCompletosResponseDto = DiputadosResponseDto;
export type DiputadoIndividualResponseDto = DiputadoResponseDto;