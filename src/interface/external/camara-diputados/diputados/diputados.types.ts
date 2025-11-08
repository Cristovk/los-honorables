/**
 * Comentario: Este archivo define tipos utilitarios para los DTOs de la API de la Cámara de Diputados.
 * Se concentra en representar variaciones comunes del conversor XML→JSON
 * (elemento único vs. arreglo) para mantener compatibilidad a través de distintos endpoints.
 */

/**
 * Comentario: En algunos endpoints, el conversor XML→JSON puede entregar un único elemento
 * o un arreglo de elementos, dependiendo de la cardinalidad. Este tipo genérico permite modelar
 * ambos casos con una sola definición, evitando duplicación y facilitando el consumo seguro.
 */
export type SingleOrArray<T> = T | T[];

/**
 * Comentario: Alias para fechas en formato ISO (por ejemplo, "YYYY-MM-DD" o ISO 8601 completo),
 * usado con fines de documentación. No valida formato en tiempo de ejecución.
 */
export type ISODateString = string;

/**
 * Comentario: Género según el texto estandarizado que devuelve la API (observado: "Femenino" | "Masculino").
 * Se usa para restringir el campo `_text` en el objeto `Sexo` cuando sea posible.
 */
export enum GenderText {
  Femenino = 'Femenino',
  Masculino = 'Masculino',
}