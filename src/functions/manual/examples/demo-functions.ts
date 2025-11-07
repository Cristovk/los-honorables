import { ManualFunction } from '../types';

// Función ejemplo: Saludo personalizado
export const greetingFunction: ManualFunction = {
  id: 'greeting',
  name: 'Saludo Personalizado',
  description: 'Genera un saludo personalizado con nombre y edad',
  category: 'examples',
  inputs: [
    {
      name: 'name',
      type: 'string',
      description: 'Nombre de la persona',
      required: true,
    },
    {
      name: 'age',
      type: 'number',
      description: 'Edad de la persona',
      required: false,
      defaultValue: 25,
    },
    {
      name: 'greeting_type',
      type: 'select',
      description: 'Tipo de saludo',
      required: true,
      options: ['formal', 'casual', 'enthusiastic'],
      defaultValue: 'casual',
    },
  ],
  execute: async (params) => {
    const { name, age, greeting_type } = params || {};
    
    const greetings = {
      formal: `Buenos días, ${name}. Es un placer conocerle.`,
      casual: `¡Hola ${name}! ¿Cómo estás?`,
      enthusiastic: `¡¡¡HOLA ${name}!!! ¡Qué emoción verte!`,
    };

    const greeting = greetings[greeting_type as keyof typeof greetings] || greetings.casual;
    const ageText = age ? ` Tienes ${age} años.` : '';

    console.log('\n🎉 RESULTADO:');
    console.log('─'.repeat(50));
    console.log(greeting + ageText);
    console.log('─'.repeat(50));
  },
};

// Función ejemplo: Calculadora
export const calculatorFunction: ManualFunction = {
  id: 'calculator',
  name: 'Calculadora Básica',
  description: 'Realiza operaciones matemáticas básicas',
  category: 'examples',
  inputs: [
    {
      name: 'number1',
      type: 'number',
      description: 'Primer número',
      required: true,
    },
    {
      name: 'number2',
      type: 'number',
      description: 'Segundo número',
      required: true,
    },
    {
      name: 'operation',
      type: 'select',
      description: 'Operación a realizar',
      required: true,
      options: ['suma', 'resta', 'multiplicacion', 'division'],
    },
  ],
  execute: async (params) => {
    const { number1, number2, operation } = params || {};
    
    let result: number;
    let symbol: string;

    switch (operation) {
      case 'suma':
        result = number1 + number2;
        symbol = '+';
        break;
      case 'resta':
        result = number1 - number2;
        symbol = '-';
        break;
      case 'multiplicacion':
        result = number1 * number2;
        symbol = '×';
        break;
      case 'division':
        if (number2 === 0) {
          console.log('\n❌ ERROR: División por cero no permitida');
          return;
        }
        result = number1 / number2;
        symbol = '÷';
        break;
      default:
        console.log('\n❌ ERROR: Operación no válida');
        return;
    }

    console.log('\n🧮 RESULTADO:');
    console.log('─'.repeat(50));
    console.log(`${number1} ${symbol} ${number2} = ${result}`);
    console.log('─'.repeat(50));
  },
};

// Función ejemplo: Información del sistema
export const systemInfoFunction: ManualFunction = {
  id: 'system-info',
  name: 'Información del Sistema',
  description: 'Muestra información básica del sistema y proyecto',
  category: 'utils',
  execute: async () => {
    const packageJson = require('../../../../package.json');
    
    console.log('\n💻 INFORMACIÓN DEL SISTEMA:');
    console.log('─'.repeat(50));
    console.log(`📦 Proyecto: ${packageJson.name || 'N/A'}`);
    console.log(`🏷️  Versión: ${packageJson.version || 'N/A'}`);
    console.log(`📅 Fecha: ${new Date().toLocaleDateString('es-ES')}`);
    console.log(`⏰ Hora: ${new Date().toLocaleTimeString('es-ES')}`);
    console.log(`🌐 Node.js: ${process.version}`);
    console.log(`📂 Directorio: ${process.cwd()}`);
    console.log('─'.repeat(50));
  },
};