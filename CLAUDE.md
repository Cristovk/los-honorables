# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev                # Dev server with hot-reload (tsx watch)
bun run build          # Compile TypeScript → dist/ (tsc + tsc-alias for path resolution)
bun run type-check     # Type-check without emitting
bun test               # Run Jest tests
bun run lint           # ESLint
bun run functions      # Launch the interactive CLI for manual sync operations
```

Single file execution (useful for quick tests):
```bash
bun tsx src/path/to/file.ts
```

## Architecture

**Los Honorables** is a data pipeline backend that fetches Chilean congressional data (XML) from public government APIs, transforms it, and stores it in Supabase (PostgreSQL). The system is built in three stages — currently in Stage 1 (data collection).

### Data flow

```
Cámara/Senado public APIs (XML)
  → Express routes (fetch + xml2js transform)
  → Manual CLI functions (sync to Supabase)
  → Supabase PostgreSQL
```

The **Express server** (`src/server/app.ts`) acts as a proxy/transformation layer to the external government APIs — routes do not serve from the database, they call the external API and return the JSON-transformed response. Port: `6000`.

The **manual functions CLI** (`bun run functions`) is the main mechanism for writing data to Supabase. Each function in `src/functions/manual/call-routes-diputados/` calls the Express routes internally and persists the result.

### Path aliases (tsconfig.json)

```
@server/*        → src/server/*
@config/*        → src/config/*
@services/*      → src/services/*
@utils/*         → src/utils/*
@routes/*        → src/routes/*
@models/*        → src/models/*
@interface/*     → src/interface/*
@functions/*     → src/functions/*
@diputadosRoutes/* → src/routes/DiputadosRoutes/*
@senadoresRoutes/* → src/routes/SenadoresRoutes/*
```

Build uses `tsc-alias` to resolve these aliases in the compiled output.

### Supabase clients

`src/config/supabase.config.ts` exports two clients:

- `supabase` — uses `SUPABASE_ANON_KEY`, read-only (future frontend use)
- `supabaseAdmin` — uses `SUPABASE_SERVICE_ROLE_KEY`, for all write operations in the backend/CLI

Always use `supabaseAdmin` for upserts in sync functions.

### Logging — two separate systems

| Logger | Import | Use when |
|--------|--------|----------|
| `PinoLoggerService` / `createLogger()` | `@services/logging` | Application code, services, error tracking |
| `ChalkConsoleLogger` | `@services/logging` | CLI functions, manual scripts, human-readable output |

Never use `console.log()` in application code. Do not use `ChalkConsoleLogger` in service-layer code.

### Adding a new manual CLI function

1. Create `src/functions/manual/call-routes-diputados/my-function.ts` implementing `ManualFunction` from `./types`
2. Register it in `src/functions/manual/function-registry.ts` — import and add to `AVAILABLE_FUNCTIONS`

### Key env vars

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BASE_URL=https://opendata.camara.cl/camaradiputados/WServices/
PORT=6000
DEEPSEEK_API_KEY=   # Stage 2, not yet used
```

### Database schema

Full schema in `src/models/create-table/structure-table.sql`. Tables mirror the government API entities: `diputados`, `periodos_legislativos`, `legislaturas`, `sesiones_sala`, `asistencias_sala`, `proyectos_ley`, `votaciones_proyecto_ley`, `regiones`, `ministerios`, `partidos`, `militancias`, etc.

Migrations are in `migrations/`. Apply via Supabase SQL Editor or CLI.

## External APIs

- **Cámara de Diputados**: `https://opendata.camara.cl/camaradiputados/WServices/` — 32 endpoints, XML format. Documented in `docs/api/api-camara-docs.md`.
- **Senado**: `https://tramitacion.senado.cl/wspublico/` — planned (Stage 1, not yet integrated)

XML is parsed with `xml2js` via `src/utils/xmlToJson.ts`. Config: `explicitArray: false`, `mergeAttrs: true`, `ignoreAttrs: false`.

## Current state

Stage 1 (data collection) is in progress. Syncs working via CLI: ministerios, regiones/provincias/comunas/distritos, períodos legislativos, legislaturas, diputados vigentes, asistencia a sesiones de sala. The AI processing (`src/services/ai-processor/`) and `src/functions/scheduled/` are scaffolded but not yet functional.
