import { ManualFunction } from '../types';

// Función ejemplo: Crear estructura de colección
export const createCollectionStructure: ManualFunction = {
  id: 'create-collection-structure',
  name: 'Crear Estructura de Colección',
  description: 'Define la estructura de una nueva colección en Firestore',
  category: 'firestore',
  inputs: [
    {
      name: 'collection_name',
      type: 'string',
      description: 'Nombre de la colección',
      required: true,
    },
    {
      name: 'document_type',
      type: 'select',
      description: 'Tipo de documento',
      required: true,
      options: ['users', 'products', 'orders', 'settings', 'custom'],
    },
    {
      name: 'enable_timestamps',
      type: 'boolean',
      description: 'Incluir timestamps automáticos',
      required: false,
      defaultValue: true,
    },
  ],
  execute: async (params) => {
    const { collection_name, document_type, enable_timestamps } = params || {};
    
    console.log('\n🔥 ESTRUCTURA DE FIRESTORE:');
    console.log('─'.repeat(50));
    console.log(`📂 Colección: ${collection_name}`);
    console.log(`📄 Tipo: ${document_type}`);
    
    // Definir estructura base según el tipo
    let structure: any = {
      id: 'string (auto-generated)',
    };

    switch (document_type) {
      case 'users':
        structure = {
          ...structure,
          email: 'string',
          name: 'string',
          role: 'string',
          isActive: 'boolean',
        };
        break;
      case 'products':
        structure = {
          ...structure,
          name: 'string',
          description: 'string',
          price: 'number',
          category: 'string',
          inStock: 'boolean',
        };
        break;
      case 'orders':
        structure = {
          ...structure,
          userId: 'string',
          items: 'array',
          total: 'number',
          status: 'string',
        };
        break;
      case 'settings':
        structure = {
          ...structure,
          key: 'string',
          value: 'any',
          category: 'string',
        };
        break;
      default:
        structure = {
          ...structure,
          // Campos personalizados se agregarán aquí
          data: 'object',
        };
    }

    if (enable_timestamps) {
      structure.createdAt = 'timestamp';
      structure.updatedAt = 'timestamp';
    }

    console.log('\n📋 Estructura propuesta:');
    Object.entries(structure).forEach(([key, type]) => {
      console.log(`  • ${key}: ${type}`);
    });

    console.log('\n🚀 Próximos pasos:');
    console.log('  1. Implementar validaciones de esquema');
    console.log('  2. Crear reglas de seguridad');
    console.log('  3. Definir índices necesarios');
    console.log('  4. Implementar funciones CRUD');
    console.log('─'.repeat(50));
  },
};

// Función ejemplo: Generar reglas de seguridad
export const generateSecurityRules: ManualFunction = {
  id: 'generate-security-rules',
  name: 'Generar Reglas de Seguridad',
  description: 'Genera reglas de seguridad básicas para Firestore',
  category: 'firestore',
  inputs: [
    {
      name: 'collection_name',
      type: 'string',
      description: 'Nombre de la colección',
      required: true,
    },
    {
      name: 'access_level',
      type: 'select',
      description: 'Nivel de acceso',
      required: true,
      options: ['public', 'authenticated', 'owner-only', 'admin-only'],
    },
  ],
  execute: async (params) => {
    const { collection_name, access_level } = params || {};
    
    console.log('\n🛡️ REGLAS DE SEGURIDAD FIRESTORE:');
    console.log('─'.repeat(50));
    console.log(`📂 Colección: ${collection_name}`);
    console.log(`🔒 Nivel de acceso: ${access_level}`);
    console.log('\n📝 Reglas generadas:');
    
    let rules = '';
    
    switch (access_level) {
      case 'public':
        rules = `
match /${collection_name}/{documentId} {
  allow read, write: if true; // Acceso público total
}`;
        break;
      case 'authenticated':
        rules = `
match /${collection_name}/{documentId} {
  allow read, write: if request.auth != null; // Solo usuarios autenticados
}`;
        break;
      case 'owner-only':
        rules = `
match /${collection_name}/{documentId} {
  allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
}`;
        break;
      case 'admin-only':
        rules = `
match /${collection_name}/{documentId} {
  allow read, write: if request.auth != null && 
    exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}`;
        break;
    }

    console.log(rules);
    console.log('\n⚠️ Nota: Estas son reglas básicas. Ajusta según tus necesidades específicas.');
    console.log('─'.repeat(50));
  },
};