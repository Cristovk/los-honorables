#!/usr/bin/env node

/**
 * Script ejecutable para verificar conexión con Firestore
 * Uso: bun run check-firestore
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Ejecutando verificación de conexión Firestore...\n');

try {
  // Ejecutar la versión simplificada que no depende de paths de alias
  console.log('🔍 Verificando conexión Firestore...');
  
  const checkScriptPath = path.join(__dirname, 'simple-firestore-check.js');
  
  execSync(`node ${checkScriptPath}`, { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
} catch (error) {
  console.error('❌ Error durante la verificación:', error.message);
  process.exit(1);
}