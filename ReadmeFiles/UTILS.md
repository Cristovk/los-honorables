## Utils

### **1. Funciones conversiones XML a JSON**

El archivo utils/xmlToJson.ts contiene funciones diseñadas para convertir datos en formato XML a objetos JSON de manera flexible y reutilizable. Está compuesto por dos funciones principales:

processNode: Es una función recursiva que procesa nodos individuales del XML. Si un nodo no tiene hijos, retorna su contenido de texto; si tiene hijos, los procesa recursivamente para construir un objeto JSON. Además, maneja casos donde varias etiquetas con el mismo nombre están presentes, agrupándolas en un array.

extractDataFromXml: Esta función toma el XML completo y un nombre de nodo raíz (rootTag). Utiliza JSDOM para parsear el XML y busca el nodo raíz especificado. Luego, aplica processNode para convertir los nodos encontrados en objetos JSON. Si hay múltiples nodos raíz (como en el caso de una lista de elementos), los procesa como un array de objetos.

fetchAndProcessXml: Es una función auxiliar que realiza una solicitud HTTP a una URL dada, obtiene el XML como respuesta, y lo pasa a extractDataFromXml para procesarlo. Combina la obtención de datos remotos con la conversión a JSON, lo que la hace ideal para integrarse con APIs externas.

El propósito general de este archivo es abstraer el trabajo de procesar XML en aplicaciones basadas en TypeScript. Esto lo hace reutilizable para diferentes endpoints o estructuras de XML, ya que el nodo raíz que se desea procesar puede configurarse dinámicamente. Ideal para trabajar con APIs que devuelven respuestas en XML y convertirlas a un formato más manejable (JSON) en una aplicación moderna.

---
