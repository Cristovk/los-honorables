import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Helper para obtener la ruta del directorio actual en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processEndpoints() {
  // Construye la ruta absoluta al archivo JSON y lo lee
  const jsonPath = path.join(__dirname, '..', 'EndpointDiputadosAPI.json');
  const fileContent = fs.readFileSync(jsonPath, 'utf8');
  const endpointsData = JSON.parse(fileContent);

  // Copia profunda para no modificar el objeto original
  const processedEndpoints = JSON.parse(JSON.stringify(endpointsData));

  for (const endpoint of processedEndpoints) {
    // Solo procesa endpoints que tienen un array de parámetros no vacío
    if (endpoint.parametros_necesarios && endpoint.parametros_necesarios.length > 0) {
      try {
        // Realiza la llamada POST. Esperamos que falle con un error 500.
        // Se cambia el Content-Type a uno más estándar para evitar errores de "formato no válido".
        await axios.post(endpoint.url_completa, null, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        // Si la llamada tiene éxito (código 2xx), lo registramos, ya que es inesperado.
        console.log(`Endpoint ${endpoint.endpoint} respondió con éxito, no se procesará.`);
      } catch (error) {
        // Verifica si es un error de axios con una respuesta y un estado 500
        if (axios.isAxiosError(error) && error.response && error.response.status === 500) {
          const text = error.response.data;
          
          // Decodifica la entidad HTML '&#225;' a 'á'
          const decodedText = text.replace(/par&#225;metro/g, 'parámetro');
          // Busca el nombre del parámetro, permitiendo espacios adicionales
          const match = decodedText.match(/Falta el parámetro:\s*([\w\d]+)\./);

          if (match && match[1]) {
            const parameterName = match[1];
            // Actualiza los parámetros necesarios
            for (const param of endpoint.parametros_necesarios) {
              delete param.ubicacion;
              param.nombre = `${parameterName}=`;
            }
          } else {
            console.error(`Error en endpoint ${endpoint.endpoint}: No se encontró el patrón del parámetro en la respuesta 500. Respuesta: ${text}`);
          }
        } else {
          // Registra cualquier otro tipo de error (de red, otros códigos HTTP, etc.)
          const errorMessage = error.response ? `status ${error.response.status}` : error.message;
          console.error(`Error procesando el endpoint ${endpoint.endpoint}: ${errorMessage}`);
        }
      }
    }
  }

  // Retorna el JSON modificado
  return processedEndpoints;
}

// Llama a la función y muestra el resultado en la consola
processEndpoints().then(result => {
  console.log("JSON Modificado:");
  console.log(JSON.stringify(result, null, 2));
});