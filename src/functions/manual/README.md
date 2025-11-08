# 🚀 Sistema de Funciones Manuales

Un sistema interactivo para gestionar y ejecutar funciones desde la línea de comandos, diseñado especialmente para el desarrollo de estructuras de Firestore y automatización de tareas.

## 📋 Características

- **Interfaz CLI Interactiva**: Navegación fácil con menús y opciones
- **Categorización**: Funciones organizadas por categorías (firestore, utils, examples)
- **Parámetros Dinámicos**: Soporte para inputs de diferentes tipos
- **Búsqueda**: Encuentra funciones por nombre o descripción
- **Persistente**: El sistema no se cierra hasta que tú lo decidas
- **Extensible**: Fácil agregar nuevas funciones

## 🚀 Uso Rápido

### Ejecutar desde package.json
```bash
pnpm run functions
```

### Usar programáticamente
```typescript
import { startFunctionManager } from './src/functions/manual';

// Iniciar el gestor interactivo
await startFunctionManager();
```

## 📁 Estructura de Archivos

```
src/functions/manual/
├── index.ts                    # Punto de entrada principal
├── types.ts                    # Interfaces y tipos TypeScript
├── function-registry.ts        # Registro central de funciones
├── function-manager.ts         # Gestor CLI interactivo
├── README.md                   # Esta documentación
├── examples/
│   └── demo-functions.ts       # Funciones de ejemplo
├── firestore/
│   └── collection-functions.ts # Funciones para Firestore
└── utils/
    └── (funciones de utilidad)
```

## 🛠️ Cómo Agregar una Nueva Función

### 1. Crear la Función

Crea tu función implementando la interfaz `ManualFunction`:

```typescript
import { ManualFunction } from '../types';

export const miFuncionPersonalizada: ManualFunction = {
  id: 'mi-funcion-unica',
  name: 'Mi Función Personalizada',
  description: 'Descripción de lo que hace la función',
  category: 'firestore', // 'firestore' | 'utils' | 'examples'
  inputs: [
    {
      name: 'parametro1',
      type: 'string',
      description: 'Descripción del parámetro',
      required: true,
    },
    {
      name: 'opcion',
      type: 'select',
      description: 'Selecciona una opción',
      required: true,
      options: ['opcion1', 'opcion2', 'opcion3'],
    },
  ],
  execute: async (params) => {
    const { parametro1, opcion } = params || {};
    
    console.log('\\n🎯 MI FUNCIÓN:');
    console.log('─'.repeat(50));
    console.log(`Parámetro: ${parametro1}`);
    console.log(`Opción: ${opcion}`);
    console.log('─'.repeat(50));
    
    // Tu lógica aquí
  },
};
```

### 2. Registrar la Función

En `function-registry.ts`, importa y agrega tu función:

```typescript
import { miFuncionPersonalizada } from './path/to/your/function';

export const AVAILABLE_FUNCTIONS: ManualFunction[] = [
  // ... otras funciones
  miFuncionPersonalizada,
];
```

¡Eso es todo! Tu función aparecerá automáticamente en el menú.

## 🎯 Tipos de Parámetros Disponibles

### String
```typescript
{
  name: 'nombre',
  type: 'string',
  description: 'Ingresa tu nombre',
  required: true,
  defaultValue: 'Usuario', // Opcional
}
```

### Number
```typescript
{
  name: 'edad',
  type: 'number',
  description: 'Ingresa tu edad',
  required: false,
  defaultValue: 25, // Opcional
}
```

### Boolean
```typescript
{
  name: 'activo',
  type: 'boolean',
  description: '¿Está activo?',
  required: false,
  defaultValue: true, // Opcional
}
```

### Select (Opciones)
```typescript
{
  name: 'categoria',
  type: 'select',
  description: 'Selecciona una categoría',
  required: true,
  options: ['users', 'products', 'orders'],
  defaultValue: 'users', // Opcional
}
```

## 📚 Funciones Incluidas

### 💡 Ejemplos
- **Saludo Personalizado**: Genera saludos personalizados
- **Calculadora Básica**: Operaciones matemáticas simples
- **Información del Sistema**: Muestra info del proyecto y sistema

### 🔥 Firestore
- **Crear Estructura de Colección**: Define estructuras para nuevas colecciones
- **Generar Reglas de Seguridad**: Crea reglas de seguridad básicas

### 🛠️ Utilidades
- **Consultar Endpoints de Tipos**: Consulta todos los endpoints de tipos de la API de Diputados y muestra un objeto consolidado

### 🏛️ Diputados (Rutas de API)
- **Consultar Ministerios**: Consulta el endpoint de ministerios y muestra la lista completa de ministerios de Chile en formato tabla o lista
  - Parámetros: URL base, mostrar respuesta completa, formato (tabla/lista)
  - Guarda resultados en: `global.ultimosMinisterios`, `global.ministeriosLimpios`, `global.ministeriosArray`
## 📊 Navegación del Menú

El sistema ofrece las siguientes opciones:

1. **📋 Ver todas las funciones**: Lista completa de funciones disponibles
2. **📁 Ver por categoría**: Filtra funciones por categoría
3. **🔍 Buscar función**: Busca por nombre o descripción
4. **⚡ Ejecutar función específica**: Selecciona y ejecuta una función
5. **📊 Estadísticas**: Muestra estadísticas del sistema
6. **❌ Salir**: Termina el programa

## 🔧 Casos de Uso para Firestore

Este sistema es especialmente útil para:

- **Generar estructuras de colecciones** con esquemas predefinidos
- **Crear reglas de seguridad** según diferentes niveles de acceso
- **Definir índices** para consultas optimizadas
- **Generar funciones CRUD** automáticamente
- **Validar esquemas** antes de implementar
- **Documentar estructuras** de datos

## 💡 Consejos de Uso

### Para Desarrollo de Firestore:
1. Usa las funciones de estructura de colecciones para planificar tu base de datos
2. Genera reglas de seguridad como punto de partida
3. Crea funciones personalizadas para casos específicos de tu proyecto

### Para Automatización:
1. Agrupa funciones relacionadas en archivos separados
2. Usa categorías descriptivas para organizar mejor
3. Incluye validaciones en tus funciones para evitar errores

### Para Colaboración:
1. Documenta bien cada función con descripción clara
2. Usa nombres de parámetros descriptivos
3. Incluye ejemplos en los comentarios del código

## 🐛 Solución de Problemas

### Error al ejecutar funciones:
- Verifica que todas las dependencias estén instaladas
- Asegúrate de que tsx esté disponible globalmente o como dependencia

### Función no aparece en el menú:
- Verifica que esté importada en `function-registry.ts`
- Asegúrate de que esté agregada al array `AVAILABLE_FUNCTIONS`

### Problemas con parámetros:
- Revisa que los tipos de los inputs coincidan con lo esperado
- Verifica las validaciones de campos requeridos

## 🔄 Roadmap Futuro

- [ ] Soporte para funciones asíncronas con progress bars
- [ ] Exportación de configuraciones a archivos
- [ ] Integración directa con Firebase CLI
- [ ] Plantillas predefinidas para diferentes tipos de proyectos
- [ ] Modo scripting para automatización completa

---

¡Disfruta construyendo tus funciones para Firestore! 🔥