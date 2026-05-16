#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import http from 'http';

// Configuración
const BASE_URL = 'http://localhost:6000';
const OUTPUT_DIR = path.join(process.cwd(), 'respuestasServicios');

// Lista de endpoints COMUNES a llamar (extraídos del archivo de comandos curl)
const endpointsComunes = [
  'comunas',
  'distritos', 
  'provincias',
  'regiones',
  'ministerios',
  'tiposCamaraOrigen',
  'tiposAsistencia',
  'tiposEstadoSesionComision',
  'tiposEstadoSesionSala',
  'tiposTitularAsistencia',
  'tiposEstado',
  'tiposEstadoAcuerdosResoluciones',
  'tiposIniciativaProyectoLey'
];

// Función para hacer peticiones HTTP
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    console.log(`📡 Realizando petición a: ${url}`);
    
    const req = http.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        console.log(`✅ Respuesta recibida de: ${url} - Status: ${response.statusCode}`);
        resolve(data);
      });
      
    }).on('error', (error) => {
      console.error(`❌ Error en petición a ${url}:`, error.message);
      reject(error);
    });
    
    // Timeout de 10 segundos
    req.setTimeout(10000, () => {
      console.error(`⏰ Timeout en petición a: ${url}`);
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Función para guardar la respuesta en archivo
function saveResponse(endpointName, responseData) {
  try {
    // Crear directorio de salida si no existe
    if (!fs.existsSync(OUTPUT_DIR)) {
      console.log(`📁 Creando directorio: ${OUTPUT_DIR}`);
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Crear nombre de archivo
    const fileName = `${endpointName}_${Date.now()}.json`;
    const filePath = path.join(OUTPUT_DIR, fileName);
    
    // Parsear la respuesta si es JSON
    let parsedData = responseData;
    try {
      parsedData = JSON.parse(responseData);
    } catch (e) {
      // Si no es JSON válido, mantener como texto
      console.log(`ℹ️  Respuesta de ${endpointName} no es JSON válido, guardando como texto`);
    }
    
    // Guardar archivo
    fs.writeFileSync(filePath, JSON.stringify({
      success: true,
      endpoint: endpointName,
      url: `${BASE_URL}/comunes/${endpointName}`,
      timestamp: new Date().toISOString(),
      data: parsedData
    }, null, 2));
    
    console.log(`💾 Respuesta guardada en: ${filePath}`);
    return { success: true, filePath };
    
  } catch (error) {
    console.error(`❌ Error guardando respuesta de ${endpointName}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Función principal para procesar un endpoint
async function procesarEndpoint(endpointName) {
  try {
    console.log(`\n🔷 Iniciando procesamiento de: ${endpointName}`);
    
    // Construir URL completa
    const url = `${BASE_URL}/comunes/${endpointName}`;
    
    // Hacer la petición
    const responseData = await fetchUrl(url);
    
    // Guardar respuesta
    const saveResult = await saveResponse(endpointName, responseData);
    
    if (saveResult.success) {
      console.log(`✅ ${endpointName} procesado exitosamente`);
      return { success: true, endpointName };
    } else {
      console.error(`❌ Error guardando ${endpointName}`);
      return { success: false, endpointName, error: saveResult.error };
    }
    
  } catch (error) {
    console.error(`❌ Error procesando ${endpointName}:`, error.message);
    return { success: false, endpointName, error: error.message };
  }
}

// Función principal
async function main() {
  console.log('🚀 INICIANDO COLECCIÓN DE RESPUESTAS DE SERVICIOS');
  console.log('DEBUG: Función main ejecutándose');
  console.log('================================================');
  console.log(`📊 Base URL: ${BASE_URL}`);
  console.log(`📁 Directorio de salida: ${OUTPUT_DIR}`);
  console.log(`📋 Total de endpoints a procesar: ${endpointsComunes.length}`);
  console.log('📋 Endpoints:');
  endpointsComunes.forEach((ep, index) => {
    console.log(`  ${index + 1}. ${ep}`);
  });
  console.log('================================================\n');
  
  let exitosos = 0;
  let errores = 0;
  
  // Procesar todos los endpoints
  for (const endpointName of endpointsComunes) {
    const resultado = await procesarEndpoint(endpointName);
    
    if (resultado.success) {
      exitosos++;
    } else {
      errores++;
    }
    
    // Pequeña pausa para no saturar el servidor
    console.log('⏰ Esperando 500ms antes del próximo endpoint...\n');
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('================================================');
  console.log('🎯 COLECCIÓN COMPLETADA');
  console.log('================================================');
  console.log(`📊 Resultados:`);
  console.log(`   ✅ Exitosos: ${exitosos}`);
  console.log(`   ❌ Errores: ${errores}`);
  console.log(`   📂 Archivos guardados en: ${OUTPUT_DIR}`);
  console.log('================================================');
}

// Ejecutar siempre la función principal
main().catch(error => {
  console.error('❌ ERROR FATAL:', error);
  process.exit(1);
});