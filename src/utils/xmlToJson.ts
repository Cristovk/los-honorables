import { processXmlData } from './dataTransformations';

/**
 * Parser XML nativo para Node.js sin dependencias externas
 * Utiliza regex y parsing manual para convertir XML a JSON
 */
class SimpleXmlParser {
  private explicitArray: boolean;
  private ignoreAttrs: boolean;
  private mergeAttrs: boolean;
  private normalize: boolean;
  private explicitRoot: boolean;

  constructor(options: {
    explicitArray?: boolean;
    ignoreAttrs?: boolean;
    mergeAttrs?: boolean;
    normalize?: boolean;
    explicitRoot?: boolean;
  }) {
    this.explicitArray = options.explicitArray ?? true;
    this.ignoreAttrs = options.ignoreAttrs ?? true;
    this.mergeAttrs = options.mergeAttrs ?? false;
    this.normalize = options.normalize ?? false;
    this.explicitRoot = options.explicitRoot ?? true;
  }

  parseString(xmlString: string, callback: (error: Error | null, result?: any) => void): void {
    try {
      const result = this.parse(xmlString);
      callback(null, result);
    } catch (error) {
      callback(error as Error);
    }
  }

  private parse(xmlString: string): any {
    // Limpiar el XML de declaraciones y comentarios
    let cleanXml = xmlString
      .replace(/<\?xml[^?]*\?>/g, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();

    // Parsear el XML
    const result = this.parseElement(cleanXml);

    if (!result) {
      throw new Error('Error parsing XML: Invalid XML structure');
    }

    return result;
  }

  private parseElement(xml: string): any {
    xml = xml.trim();

    // Extraer el tag raíz (soportando namespaces)
    const tagMatch = xml.match(/^<([^\s>\/]+)/);
    if (!tagMatch) return null;

    const tagName = tagMatch[1];
    
    // Escapar caracteres especiales en el tagName para usarlo en regex
    const escapedTagName = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Extraer atributos (soportando namespaces como xmlns:xsi)
    // Buscar hasta el primer > que no esté precedido por /
    const openTagMatch = xml.match(/^<[^>]+>/);
    const attributes: Record<string, string> = {};

    if (openTagMatch) {
      const openTag = openTagMatch[0];
      // Regex actualizado para soportar atributos con : (namespaces)
      const attrRegex = /([\w:]+)=["']([^"']*)["']/g;
      let attrMatch;

      while ((attrMatch = attrRegex.exec(openTag)) !== null) {
        attributes[attrMatch[1]] = attrMatch[2];
      }
    }

    // Verificar si es un tag auto-cerrado
    if (xml.match(/\/>$/)) {
      const obj: any = {};

      if (!this.ignoreAttrs && Object.keys(attributes).length > 0) {
        if (this.mergeAttrs) {
          Object.assign(obj, attributes);
        } else {
          obj.$ = attributes;
        }
      }

      const result = Object.keys(obj).length > 0 ? obj : '';

      if (this.explicitRoot) {
        return { [tagName]: result };
      }
      return result;
    }

    // Extraer el contenido entre tags usando el tagName escapado
    const contentRegex = new RegExp(`^<${escapedTagName}(?:\\s[^>]*)?>(.*)<\\/${escapedTagName}>$`, 's');
    const contentMatch = xml.match(contentRegex);

    if (!contentMatch) {
      console.error('DEBUG - Failed to match:', {
        tagName,
        escapedTagName,
        xmlLength: xml.length,
        xmlStart: xml.substring(0, 100),
        xmlEnd: xml.substring(xml.length - 100),
        regexPattern: `^<${escapedTagName}(?:\\s[^>]*)?>(.*)<\\/${escapedTagName}>$`
      });
      throw new Error(`Malformed XML: closing tag not found for ${tagName}`);
    }

    const content = contentMatch[1];

    // Verificar si tiene solo texto (sin tags hijos)
    if (!content.includes('<')) {
      const textContent = this.normalize ? content.trim() : content;

      const obj: any = {};

      if (!this.ignoreAttrs && Object.keys(attributes).length > 0) {
        if (this.mergeAttrs) {
          // Cuando mergeAttrs es true, agregar atributos al objeto y el texto como "_"
          Object.assign(obj, attributes);
          obj._ = textContent;
        } else {
          obj.$ = attributes;
          obj._ = textContent;
        }
      } else {
        if (this.explicitRoot) {
          return { [tagName]: textContent };
        }
        return textContent;
      }

      if (this.explicitRoot) {
        return { [tagName]: obj };
      }
      return obj;
    }

    // Parsear elementos hijos
    const children = this.parseChildren(content);
    const result: any = {};

    // Agregar atributos
    if (!this.ignoreAttrs && Object.keys(attributes).length > 0) {
      if (this.mergeAttrs) {
        Object.assign(result, attributes);
      } else {
        result.$ = attributes;
      }
    }

    // Agregar elementos hijos
    for (const child of children) {
      const childTagMatch = child.match(/^<([^\s>\/]+)/);
      if (!childTagMatch) continue;

      const childTagName = childTagMatch[1];
      const childValue = this.parseElement(child);
      const childContent = childValue[childTagName];

      if (result[childTagName] !== undefined) {
        // Ya existe, convertir a array
        if (!Array.isArray(result[childTagName])) {
          result[childTagName] = [result[childTagName]];
        }
        result[childTagName].push(childContent);
      } else {
        // Primera ocurrencia
        if (this.explicitArray) {
          result[childTagName] = [childContent];
        } else {
          result[childTagName] = childContent;
        }
      }
    }

    if (this.explicitRoot) {
      return { [tagName]: result };
    }

    return result;
  }

  private parseChildren(content: string): string[] {
    const children: string[] = [];
    let i = 0;
    
    // Saltar espacios en blanco iniciales
    while (i < content.length && /\s/.test(content[i])) {
      i++;
    }

    while (i < content.length) {
      // Si encontramos un tag de apertura
      if (content[i] === '<' && content[i + 1] !== '/' && content[i + 1] !== '!' && content[i + 1] !== '?') {
        // Extraer el nombre del tag
        const tagNameMatch = content.substring(i).match(/^<([^\s>\/]+)/);
        if (!tagNameMatch) {
          i++;
          continue;
        }
        
        const tagName = tagNameMatch[1];
        const startPos = i;
        let depth = 1;
        i++; // Saltar el '<' inicial
        
        // Buscar el cierre de este elemento
        while (i < content.length && depth > 0) {
          if (content[i] === '<') {
            if (content.substring(i).startsWith(`</${tagName}>`)) {
              depth--;
              if (depth === 0) {
                // Incluir el tag de cierre completo
                i += `</${tagName}>`.length;
                children.push(content.substring(startPos, i));
                break;
              }
            } else if (content.substring(i).match(new RegExp(`^<${tagName}[\\s>]`))) {
              // Encontramos otro tag con el mismo nombre (anidado)
              depth++;
            }
          }
          i++;
        }
        
        // Saltar espacios en blanco
        while (i < content.length && /\s/.test(content[i])) {
          i++;
        }
      } else {
        i++;
      }
    }

    return children;
  }
}

export const convertXmlToJson = async (xmlData: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const parser = new SimpleXmlParser({
      explicitArray: false,
      ignoreAttrs: false,
      mergeAttrs: true,
      normalize: true,
      explicitRoot: true
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
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    console.log('XML recibido:', xmlText.substring(0, 500));
    
    const jsonData = await convertXmlToJson(xmlText);
    console.log('JSON parseado:', JSON.stringify(jsonData, null, 2));
    
    // Aplicar transformaciones automáticas a los datos
    const transformed = processXmlDataRecursively(jsonData);
    console.log('JSON transformado:', JSON.stringify(transformed, null, 2));
    
    return transformed;
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