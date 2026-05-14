# Análisis: Problema de Guardado en Firestore con ServerTimestamp

**Fecha**: 30 de octubre de 2025  
**Problema**: Error al serializar `ServerTimestampTransform` en operaciones batch de Firestore  
**Severidad**: Alta - Bloquea la sincronización de datos

---

## 🔴 Síntoma del Error

```
Error: Couldn't serialize object of type "ServerTimestampTransform" (found in field "createdAt")
Firestore doesn't support JavaScript objects with custom prototypes 
(i.e. objects that were created via the "new" operator).
```

### Ubicación del Error
- **Archivo compilado**: `dist/models/firestore/repositories/base.repository.js:276`
- **Método**: `createBatch()`
- **Operación**: Batch write de 346 documentos (comunas)

---

## 🔍 Causa Raíz

### 1. **Problema Conceptual**
Firestore no puede serializar objetos que contienen `FieldValue.serverTimestamp()` cuando se crean como objetos intermedios antes de pasarlos a operaciones batch.

**❌ Incorrecto** (crea objeto intermedio):
```typescript
const dataWithTimestamps = {
  ...data,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};
batch.set(docRef, dataWithTimestamps); // ❌ Error aquí
```

**✅ Correcto** (inline):
```typescript
batch.set(docRef, {
  ...data,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
}); // ✅ Funciona
```

### 2. **Problema de Compilación**
El archivo TypeScript fue modificado correctamente, pero el archivo JavaScript compilado en `dist/` no se regeneró adecuadamente.

**Evidencia**:
- Línea de error: `base.repository.js:276`
- En el código fuente TypeScript, esa línea contiene código diferente
- Indica que el build no se completó correctamente

### 3. **Incompatibilidad con Emulador**
El emulador de Firestore es más estricto con la validación de tipos que el servicio en producción.

---

## 🛠️ Soluciones

### Solución 1: Limpiar y Recompilar (RECOMENDADA)

```bash
# Limpiar completamente el directorio dist
rm -rf dist

# Limpiar caché de TypeScript
rm -rf .tsbuildinfo

# Recompilar desde cero
bun run build

# Verificar el archivo compilado
cat dist/models/firestore/repositories/base.repository.js | grep -A 20 "createBatch"
```

### Solución 2: Refactorizar el Método `createBatch`

El código correcto debe verse así:

```typescript
async createBatch(dataArray: Partial<T>[]): Promise<string[]> {
  if (!dataArray || dataArray.length === 0) {
    throw new ValidationError('El array de datos no puede estar vacío');
  }

  if (dataArray.length > 500) {
    throw new ValidationError('No se pueden crear más de 500 documentos en un batch');
  }

  try {
    return await this.executeWithRetry(async () => {
      const batch = this.db.batch();
      const ids: string[] = [];

      dataArray.forEach(data => {
        const docRef = this.collectionRef.doc();
        
        // ✅ CORRECTO: Pasar el objeto directamente sin variable intermedia
        batch.set(docRef, {
          ...data,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        ids.push(docRef.id);
      });

      await batch.commit();

      if (this.enableLogging) {
        this.logger.info(`${dataArray.length} documentos creados en batch`, {
          collection: this.collectionName
        });
      }

      return ids;
    }, 'createBatch');
  } catch (error) {
    this.handleError(error, 'createBatch', { count: dataArray.length });
  }
}
```

### Solución 3: Alternativa con Timestamps Manuales (NO RECOMENDADA)

Si el problema persiste, usar timestamps manuales:

```typescript
batch.set(docRef, {
  ...data,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

**⚠️ Desventaja**: Los timestamps no serán del servidor, pueden tener problemas de sincronización.

---

## 📊 Otros Métodos Afectados

Revisar que estos métodos **NO** tengan el mismo problema:

### ✅ Método `create()` - OK
```typescript
const dataWithTimestamps = {
  ...data,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};
const docRef = await this.collectionRef.add(dataWithTimestamps);
```
**Nota**: Funciona porque `.add()` acepta objetos intermedios.

### ✅ Método `createWithId()` - OK
```typescript
const dataWithTimestamps = {
  ...data,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};
await this.collectionRef.doc(id).set(dataWithTimestamps);
```
**Nota**: Funciona porque `.set()` acepta objetos intermedios.

### ⚠️ Método `update()` - REVISAR
```typescript
const dataWithTimestamp = {
  ...data,
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};
await docRef.update(dataWithTimestamp);
```
**Estado**: Debería funcionar, pero verificar en pruebas.

### ⚠️ Método `upsert()` - REVISAR
```typescript
const dataWithTimestamps = {
  ...data,
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};
await docRef.set(dataWithTimestamps, { merge: true });
```
**Estado**: Debería funcionar, pero verificar en pruebas.

---

## 🧪 Plan de Verificación

### 1. Verificar Compilación
```bash
# Ver el contenido del método compilado
cat dist/models/firestore/repositories/base.repository.js | grep -A 30 "createBatch"
```

**Esperado**: No debe haber variable `dataWithTimestamps` o `cleanData` antes del `batch.set()`.

### 2. Probar con Emulador de Firestore
```bash
# Iniciar emulador de Firestore
firebase emulators:start --only firestore

# En otra terminal, ejecutar la función
bun run emulators:functions
```

### 3. Verificar Documentos Creados
Acceder a http://127.0.0.1:8080/ y verificar:
- Que los documentos se crearon
- Que tienen los campos `createdAt` y `updatedAt`
- Que los timestamps son válidos

---

## 📝 Checklist de Solución

- [ ] Limpiar directorio `dist/`
- [ ] Limpiar `.tsbuildinfo`
- [ ] Recompilar con `bun run build`
- [ ] Verificar el archivo `dist/models/firestore/repositories/base.repository.js`
- [ ] Ejecutar función de prueba con emulador
- [ ] Verificar que los datos se guardan correctamente
- [ ] Revisar logs para confirmar que no hay errores
- [ ] Probar con volumen alto (346+ documentos)

---

## 🚨 Advertencias

### Uso del Emulador
```
!  functions: The Cloud Firestore emulator is not running, so calls to Firestore will affect production.
```

**Acción**: Siempre iniciar el emulador de Firestore antes de probar:
```bash
firebase emulators:start --only functions,firestore
```

### Versión de Node.js
```
!  functions: Your requested "node" version "18" doesn't match your global version "22"
```

**Impacto**: Mínimo para este problema específico, pero puede causar otros issues.

**Solución a futuro**: Usar `nvm` para cambiar a Node 18:
```bash
nvm use 18
```

---

## 🎯 Resumen Ejecutivo

| Aspecto | Detalle |
|---------|---------|
| **Problema** | `ServerTimestampTransform` no se puede serializar en batch writes |
| **Causa** | Objeto intermedio con `FieldValue.serverTimestamp()` |
| **Solución** | Pasar timestamps inline en `batch.set()` |
| **Archivo afectado** | `src/models/firestore/repositories/base.repository.ts` |
| **Método afectado** | `createBatch()` |
| **Estado actual** | Código fuente corregido, pero dist desactualizado |
| **Acción inmediata** | Limpiar y recompilar |

---

## 🔗 Referencias

- [Firestore Batch Writes](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes)
- [FieldValue.serverTimestamp()](https://firebase.google.com/docs/reference/node/firebase.firestore.FieldValue#servertimestamp)
- [Firestore Data Types](https://firebase.google.com/docs/firestore/manage-data/data-types)
