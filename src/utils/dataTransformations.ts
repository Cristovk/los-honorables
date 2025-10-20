/**
 * Utilidades para transformaciones de datos específicas del proyecto Los Honorables
 * Procesamiento de estructuras de datos provenientes de APIs XML
 */

/**
 * Transforma un array de objetos con estructura { _: string, Valor: string } o { _: string, $: { Valor: string } }
 * en un objeto donde las claves son los valores de "Valor" y los valores son los de "_"
 * 
 * @example
 * // Input:
 * [
 *   { "_": "No Asiste", "Valor": "0" },
 *   { "_": "Asiste", "Valor": "1" },
 *   { "_": "Justificado", "Valor": "2" }
 * ]
 * 
 * // Output:
 * {
 *   "0": "No Asiste",
 *   "1": "Asiste", 
 *   "2": "Justificado"
 * }
 */
export const transformKeyValuePairs = (
  data: Array<{ _: string; Valor: string } | { _: string; $: { Valor: string } }> | 
        { _: string; Valor: string } | { _: string; $: { Valor: string } }
): Record<string, string> => {
  // Si es un objeto individual, lo convertimos a array
  const dataArray = Array.isArray(data) ? data : [data];
  
  const result: Record<string, string> = {};
  
  dataArray.forEach(item => {
    let valor: string | undefined;
    
    // Manejar ambas estructuras: { Valor: string } y { $: { Valor: string } }
    if ('Valor' in item) {
      valor = item.Valor;
    } else if (item.$?.Valor !== undefined) {
      valor = item.$.Valor;
    }
    
    if (valor !== undefined && item._ !== undefined) {
      result[valor] = item._;
    }
  });
  
  return result;
};

/**
 * Versión alternativa que mantiene el nombre "ValorEnUso" como clave
 * Transforma { _: string, Valor: string } o { _: string, $: { Valor: string } } a { ValorEnUso: string }
 * 
 * @example
 * // Input:
 * [
 *   { "_": "No Asiste", "Valor": "0" },
 *   { "_": "Asiste", "Valor": "1" },
 *   { "_": "Justificado", "Valor": "2" }
 * ]
 * 
 * // Output:
 * [
 *   { "ValorEnUso": "No Asiste" },
 *   { "ValorEnUso": "Asiste" },
 *   { "ValorEnUso": "Justificado" }
 * ]
 */
export const transformToValorEnUso = (
  data: Array<{ _: string; Valor: string } | { _: string; $: { Valor: string } }> | 
        { _: string; Valor: string } | { _: string; $: { Valor: string } }
): Array<{ ValorEnUso: string }> => {
  const dataArray = Array.isArray(data) ? data : [data];
  
  return dataArray.map(item => ({
    ValorEnUso: item._
  }));
};

/**
 * Procesa datos XML convertidos a JSON que pueden venir como objeto o array
 * y aplica la transformación correspondiente según el tipo de salida deseada
 */
export const processXmlData = (
  xmlData: any,
  transformType: 'keyValue' | 'valorEnUso' = 'keyValue'
): any => {
  if (!xmlData) return xmlData;
  
  // Si los datos tienen la estructura esperada { _, Valor: string } o { _, $: { Valor: string } }
  const hasValidStructure = (item: any) => 
    item._ !== undefined && (item.Valor !== undefined || item.$?.Valor !== undefined);
  
  if (hasValidStructure(xmlData)) {
    return transformType === 'keyValue' 
      ? transformKeyValuePairs(xmlData)
      : transformToValorEnUso(xmlData);
  }
  
  // Si es un array donde cada elemento tiene la estructura válida
  if (Array.isArray(xmlData) && xmlData.length > 0 && hasValidStructure(xmlData[0])) {
    return transformType === 'keyValue'
      ? transformKeyValuePairs(xmlData)
      : transformToValorEnUso(xmlData);
  }
  
  // Si no tiene la estructura esperada, devolver los datos originales
  return xmlData;
};