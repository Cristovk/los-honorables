# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

---

## [Sin versión] - 2026-05-14

### Cambio: Migración de gestor de paquetes — de `pnpm` a `bun`

#### Motivación

Se migró el gestor de paquetes de `pnpm` a `bun` para aprovechar su mayor velocidad en instalación de dependencias y ejecución de scripts, y para unificar el toolchain bajo un único runtime/bundler moderno.

#### Archivos modificados

- **`package.json`**: scripts `build:functions`, `deploy`, `emulators` y `emulators:functions` actualizados de `pnpm` a `bun`.
- **`.gitignore`**: reemplazado `.pnpm-debug.log*` por `bun-debug.log*`. Agregado `pnpm-lock.yaml` para evitar que sea rastreado accidentalmente.
- **`pnpm-lock.yaml`**: eliminado. El lockfile de bun (`bun.lockb`) se genera al ejecutar `bun install`.
- **`.idx/dev.nix`**: reemplazado `pkgs.pnpm` por `pkgs.bun`; actualizados comandos de instalación y build en los hooks `onCreate` y `onStart`.
- **`src/functions/manual/index.ts`**: comentario de uso actualizado.
- **`src/functions/manual/README.md`**: ejemplo de comando actualizado.
- **`scripts/check-firestore.js`**: comentario de uso actualizado.
- **`CONTEXT.md`**: tabla de stack tecnológico actualizada.
- **`api-curl-commands.txt`**: nota de uso actualizada.
- **`docs/logging.md`**: comandos de instalación de dependencias actualizados.
- **`docs/MIGRATION_NOTES.md`**: comandos de ejemplo actualizados.
- **`docs/MIGRATION_PLAN_COMPLETE.md`**: comandos de ejemplo actualizados.
- **`docs/SUPABASE_SETUP_GUIDE.md`**: comandos de ejemplo actualizados.
- **`docs/firestore-timestamp-issue-analysis.md`**: comandos de build y emuladores actualizados.

#### Cómo instalar dependencias con bun

```bash
# Instalar bun (si no está instalado)
npm install -g bun

# Instalar dependencias del proyecto
bun install
```

#### Scripts disponibles

| Script | Comando |
|--------|---------|
| Iniciar en producción | `bun start` |
| Desarrollo con hot-reload | `bun dev` |
| Compilar TypeScript | `bun run build` |
| Ejecutar tests | `bun test` |
| Linting | `bun run lint` |
| Type checking | `bun run type-check` |
| Funciones manuales (CLI) | `bun run functions` |

---

## [Sin versión] - 2026-05-14

### Cambio: Migración completa de Firebase/Firestore a Supabase

#### Motivación

Firebase y Firestore representaban una capa de persistencia NoSQL con costos elevados para la carga histórica de datos legislativos. Supabase con PostgreSQL ofrece consultas relacionales nativas, costo cero indefinido en plan gratuito y una API REST/GraphQL autogenerada, ajustándose mejor a los requisitos del proyecto.

#### Eliminaciones

- **`firebase.json`**, **`firestore.rules`**, **`firestore.indexes.json`**: configuración de Firebase eliminada.
- **`src/cloud/firebaseConfig.ts`**: módulo de inicialización de Firebase Admin SDK eliminado.
- **`src/models/firestore/`**: toda la capa de repositorios y modelos de Firestore eliminada.
- **`src/services/error-handling/firestore-error-handler.service.ts`**: servicio de errores específico de Firestore eliminado.
- **`src/functions/manual/firestore/`**: funciones manuales de utilidad de Firestore eliminadas.
- **`src/functions/manual/test-firestore-connection/`**: verificador de conexión Firestore eliminado.
- **`src/utils/firestoreUtils.ts`**: archivo vacío eliminado.
- Dependencias `firebase`, `firebase-admin`, `firebase-functions` y `firebase-tools` removidas de `package.json`.
- Scripts `build:functions`, `deploy`, `emulators` y `emulators:functions` removidos.

#### Cambios

- **`src/interface/errors/repository-errors.ts`**: `FirestoreConnectionError` renombrado a `DatabaseConnectionError`.
- **`src/functions/manual/types.ts`**: categoría `'firestore'` reemplazada por `'supabase'`.
- **`src/functions/manual/function-registry.ts`**: funciones de Firestore reemplazadas por utilidades de Supabase.
- **`src/functions/index.ts`**: eliminada dependencia de `firebase-admin`.
- **`src/config/endpoints-config.ts`**: eliminado campo `FIREBASE_CREDENTIALS_PATH`.
- **`CONTEXT.md`**: tabla de stack actualizada (Firebase → Supabase).

#### Nuevos archivos

- **`src/functions/manual/supabase/supabase-utils.ts`**: funciones manuales `check-supabase-connection` e `inspect-supabase-table` para operar y diagnosticar Supabase desde el CLI interactivo.

---
