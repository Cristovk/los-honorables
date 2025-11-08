#!/usr/bin/env node

import inquirer from 'inquirer';
import { ManualFunction, FunctionInput } from './types';
import { 
  getAllFunctions, 
  getFunctionsByCategory, 
  getFunctionById, 
  getAvailableCategories,
  searchFunctions 
} from './function-registry';

/**
 * Gestor principal de funciones manuales
 * Proporciona una interfaz CLI interactiva para ejecutar funciones
 */
class FunctionManager {
  private running = true;

  /**
   * Inicia el gestor de funciones
   */
  async start(): Promise<void> {
    console.log('\n🚀 GESTOR DE FUNCIONES MANUALES');
    console.log('═'.repeat(50));
    console.log('Bienvenido al sistema de funciones interactivas');
    console.log('Puedes ejecutar funciones y volver al menú principal');
    console.log('═'.repeat(50));

    while (this.running) {
      await this.showMainMenu();
    }
  }

  /**
   * Muestra el menú principal
   */
  private async showMainMenu(): Promise<void> {
    try {
      const answer = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: '¿Qué deseas hacer?',
          choices: [
            { name: '📋 Ver todas las funciones', value: 'list-all' },
            { name: '📁 Ver por categoría', value: 'list-by-category' },
            { name: '🔍 Buscar función', value: 'search' },
            { name: '⚡ Ejecutar función específica', value: 'execute' },
            { name: '📊 Estadísticas', value: 'stats' },
            { name: '❌ Salir', value: 'exit' },
          ],
        },
      ]);

      await this.handleMainMenuAction(answer.action);
    } catch (error) {
      console.log('\n👋 ¡Hasta luego!');
      this.running = false;
    }
  }

  /**
   * Maneja las acciones del menú principal
   */
  private async handleMainMenuAction(action: string): Promise<void> {
    switch (action) {
      case 'list-all':
        await this.listAllFunctions();
        break;
      case 'list-by-category':
        await this.listByCategory();
        break;
      case 'search':
        await this.searchFunctions();
        break;
      case 'execute':
        await this.selectAndExecuteFunction();
        break;
      case 'stats':
        await this.showStatistics();
        break;
      case 'exit':
        this.running = false;
        console.log('\\n👋 ¡Hasta luego!');
        break;
    }

    if (this.running && action !== 'exit') {
      await this.waitForUser();
    }
  }

  /**
   * Lista todas las funciones disponibles
   */
  private async listAllFunctions(): Promise<void> {
    const functions = getAllFunctions();
    
    console.log('\\n📋 FUNCIONES DISPONIBLES:');
    console.log('─'.repeat(50));
    
    functions.forEach((func, index) => {
      const categoryEmoji = this.getCategoryEmoji(func.category);
      console.log(`${index + 1}. ${categoryEmoji} ${func.name}`);
      console.log(`   ${func.description}`);
      console.log(`   ID: ${func.id} | Categoría: ${func.category}`);
      console.log('');
    });
  }

  /**
   * Lista funciones por categoría
   */
  private async listByCategory(): Promise<void> {
    const categories = getAvailableCategories();
    
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'category',
        message: 'Selecciona una categoría:',
        choices: categories.map(cat => ({
          name: `${this.getCategoryEmoji(cat)} ${cat}`,
          value: cat,
        })),
      },
    ]);

    const functions = getFunctionsByCategory(answer.category);
    
    console.log(`\\n📁 FUNCIONES EN CATEGORÍA: ${answer.category.toUpperCase()}`);
    console.log('─'.repeat(50));
    
    functions.forEach((func, index) => {
      console.log(`${index + 1}. ${func.name}`);
      console.log(`   ${func.description}`);
      console.log(`   ID: ${func.id}`);
      console.log('');
    });
  }

  /**
   * Busca funciones por texto
   */
  private async searchFunctions(): Promise<void> {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'searchText',
        message: 'Ingresa texto para buscar:',
        validate: (input) => input.trim().length > 0 || 'Debes ingresar al menos un carácter',
      },
    ]);

    const results = searchFunctions(answer.searchText);
    
    if (results.length === 0) {
      console.log('\\n❌ No se encontraron funciones que coincidan con tu búsqueda.');
      return;
    }

    console.log(`\\n🔍 RESULTADOS DE BÚSQUEDA: "${answer.searchText}"`);
    console.log('─'.repeat(50));
    
    results.forEach((func, index) => {
      const categoryEmoji = this.getCategoryEmoji(func.category);
      console.log(`${index + 1}. ${categoryEmoji} ${func.name}`);
      console.log(`   ${func.description}`);
      console.log(`   ID: ${func.id} | Categoría: ${func.category}`);
      console.log('');
    });
  }

  /**
   * Permite seleccionar y ejecutar una función
   */
  private async selectAndExecuteFunction(): Promise<void> {
    const functions = getAllFunctions();
    
    const choices = functions.map(func => ({
      name: `${this.getCategoryEmoji(func.category)} ${func.name} - ${func.description}`,
      value: func.id,
    }));

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'functionId',
        message: 'Selecciona la función a ejecutar:',
        choices,
        pageSize: 10,
      },
    ]);

    const selectedFunction = getFunctionById(answer.functionId);
    if (selectedFunction) {
      await this.executeFunction(selectedFunction);
    }
  }

  /**
   * Ejecuta una función específica
   */
  private async executeFunction(func: ManualFunction): Promise<void> {
    console.log(`\\n⚡ EJECUTANDO: ${func.name}`);
    console.log('─'.repeat(50));
    console.log(func.description);
    console.log('');

    let params: Record<string, any> = {};

    // Recopilar inputs si la función los requiere
    if (func.inputs && func.inputs.length > 0) {
      console.log('📝 Configuración de parámetros:');
      params = await this.collectFunctionInputs(func.inputs);
    }

    try {
      console.log('\\n🔄 Ejecutando función...');
      await func.execute(params);
      console.log('\\n✅ Función ejecutada correctamente');
    } catch (error) {
      console.log('\\n❌ Error al ejecutar la función:');
      console.error(error);
    }
  }

  /**
   * Recopila los inputs necesarios para una función
   */
  private async collectFunctionInputs(inputs: FunctionInput[]): Promise<Record<string, any>> {
    const params: Record<string, any> = {};

    for (const input of inputs) {
      const question: any = {
        name: input.name,
        message: `${input.description}${input.required ? ' (requerido)' : ' (opcional)'}:`,
      };

      switch (input.type) {
        case 'string':
          question.type = 'input';
          if (input.required) {
            question.validate = (value: string) => 
              value.trim().length > 0 || 'Este campo es requerido';
          }
          if (input.defaultValue) {
            question.default = input.defaultValue;
          }
          break;

        case 'number':
          question.type = 'number';
          if (input.required) {
            question.validate = (value: number) => 
              !isNaN(value) || 'Debe ser un número válido';
          }
          if (input.defaultValue !== undefined) {
            question.default = input.defaultValue;
          }
          break;

        case 'boolean':
          question.type = 'confirm';
          if (input.defaultValue !== undefined) {
            question.default = input.defaultValue;
          }
          break;

        case 'select':
          question.type = 'list';
          question.choices = input.options || [];
          if (input.defaultValue) {
            question.default = input.defaultValue;
          }
          break;
      }

      const answer = await inquirer.prompt([question]);
      params[input.name] = answer[input.name];
    }

    return params;
  }

  /**
   * Muestra estadísticas del sistema
   */
  private async showStatistics(): Promise<void> {
    const functions = getAllFunctions();
    const categories = getAvailableCategories();
    
    const categoryCounts = categories.map(cat => ({
      category: cat,
      count: getFunctionsByCategory(cat).length,
    }));

    console.log('\\n📊 ESTADÍSTICAS DEL SISTEMA:');
    console.log('─'.repeat(50));
    console.log(`📦 Total de funciones: ${functions.length}`);
    console.log(`📁 Total de categorías: ${categories.length}`);
    console.log('');
    console.log('📋 Funciones por categoría:');
    categoryCounts.forEach(item => {
      const emoji = this.getCategoryEmoji(item.category);
      console.log(`  ${emoji} ${item.category}: ${item.count} función(es)`);
    });
    console.log('');
    
    const functionsWithInputs = functions.filter(f => f.inputs && f.inputs.length > 0);
    console.log(`⚙️ Funciones con parámetros: ${functionsWithInputs.length}`);
    console.log(`🚀 Funciones simples: ${functions.length - functionsWithInputs.length}`);
    console.log('─'.repeat(50));
  }

  /**
   * Obtiene el emoji correspondiente a cada categoría
   */
  private getCategoryEmoji(category: string): string {
    const emojis: Record<string, string> = {
      firestore: '🔥',
      utils: '🛠️',
      examples: '💡',
    };
    return emojis[category] || '📄';
  }

  /**
   * Pausa para que el usuario pueda leer el resultado
   */
  private async waitForUser(): Promise<void> {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: '\\nPresiona Enter para continuar...',
      },
    ]);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const manager = new FunctionManager();
  manager.start().catch(console.error);
}

export default FunctionManager;