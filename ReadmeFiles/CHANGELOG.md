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
| Build para Cloud Functions | `bun run build:functions` |
| Ejecutar tests | `bun test` |
| Linting | `bun run lint` |
| Type checking | `bun run type-check` |
| Funciones manuales (CLI) | `bun run functions` |
| Deploy a Firebase | `bun run deploy` |
| Iniciar emuladores | `bun run emulators` |

---
