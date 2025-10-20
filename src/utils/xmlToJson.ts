import xml2js from 'xml2js';
import axios from 'axios';
import { processXmlData } from './dataTransformations';

export const convertXmlToJson = async (xmlData: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({
      explicitArray: false,      // No convierte elementos únicos en arrays
      ignoreAttrs: false,        // Mantiene los atributos
      mergeAttrs: true,          // Fusiona atributos con elementos
      normalize: true,           // Normaliza espacios en blanco
      explicitRoot: true         // Mantiene el elemento raíz
    });

    parser.parseString(xmlData, (error, result) => {
      if (error) {
        reject(new Error(`Error parsing XML: ${error.message}`));
      } else {
        resolve(result);
      }
    });
  });
};

export const fetchAndProcessXml = async (url: string): Promise<any> => {
  try {
    const response = await axios.get(url);
    const jsonData = await convertXmlToJson(response.data);
    
    // Aplicar transformaciones automáticas a los datos
    return processXmlDataRecursively(jsonData);
  } catch (error) {
    console.error('Error fetching or converting XML:', error);
    throw error;
  }
};

/**
 * Función recursiva para aplicar transformaciones a todos los niveles del objeto JSON
 * Busca estructuras { _: string, Valor: string } o { _: string, $: { Valor: string } } y las transforma automáticamente
 */
const processXmlDataRecursively = (data: any): any => {
  if (Array.isArray(data)) {
    // Si es un array, procesar cada elemento
    return data.map(item => processXmlDataRecursively(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    // Función para verificar si un objeto tiene la estructura que podemos transformar
    const hasValidStructure = (item: any) => 
      item._ !== undefined && (item.Valor !== undefined || item.$?.Valor !== undefined);
    
    // Si este objeto tiene la estructura que podemos transformar
    if (hasValidStructure(data)) {
      return processXmlData(data, 'keyValue');
    }
    
    // Buscar arrays que contengan objetos con la estructura válida
    for (const key in data) {
      if (data.hasOwnProperty(key) && Array.isArray(data[key])) {
        const array = data[key];
        if (array.length > 0 && hasValidStructure(array[0])) {
          // Si encontramos un array con la estructura válida, transformarlo
          data[key] = processXmlData(array, 'keyValue');
        } else {
          // Si no, procesar recursivamente cada elemento del array
          data[key] = array.map(item => processXmlDataRecursively(item));
        }
      } else if (data.hasOwnProperty(key) && typeof data[key] === 'object' && data[key] !== null) {
        // Procesar recursivamente objetos anidados
        data[key] = processXmlDataRecursively(data[key]);
      }
    }
    
    return data;
  }
  
  return data;
};

