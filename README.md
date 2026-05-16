# Los Honorables

> Democratizando el acceso a la información legislativa de Chile.

## Descripción

**Los Honorables** es un sistema backend diseñado para recolectar, almacenar y exponer de forma accesible los datos legislativos del Congreso Nacional de Chile. El objetivo final es construir una plataforma web que permita a cualquier ciudadano entender qué hacen sus representantes: cómo votan, a qué proyectos se oponen, en qué comisiones participan y cuál es su historial de asistencia.

### Etapas del proyecto

**Etapa 1 (actual) — Recolección y almacenamiento:**
Consumir las APIs públicas del Senado y la Cámara de Diputados, transformar los datos XML en estructuras relacionales limpias y almacenarlas en Supabase (PostgreSQL). La integración con la Cámara de Diputados está avanzada (32 endpoints cubiertos). La integración con el Senado está en planificación.

**Etapa 2 (próxima) — Procesamiento con IA:**
Usar modelos de lenguaje (DeepSeek, GPT u otros) para resumir proyectos de ley, clasificarlos por categoría (salud, educación, economía, etc.) y generar explicaciones en lenguaje ciudadano.

**Etapa 3 (futura) — Web pública:**
API REST / GraphQL pública y frontend web que permita a los ciudadanos consultar, filtrar y entender la actividad legislativa de sus representantes.

## Estado actual del proyecto

### Cámara de Diputados — integración avanzada

32 endpoints cubiertos, organizados en las siguientes categorías:

- **Comisiones** (`/comisiones`): sesiones por año, detalle de comisión, comisiones vigentes y por período
- **Comunes** (`/comunes`): catálogos geográficos (regiones, provincias, comunas, distritos) y tipos del sistema (asistencia, sesiones, votaciones, estados de proyectos, etc.)
- **Diputados** (`/diputados`): diputados vigentes, histórico, por período
- **Legislativo** (`/legislativos`): proyectos de ley, mociones, mensajes, votaciones, trámites, legislaturas
- **Períodos Legislativos** (`/periodosLegislativos`): períodos e historial
- **Proyectos de Acuerdo** (`/proyectosAcuerdo`) y **Proyectos de Resolución** (`/proyectosResolucion`)
- **Sala** (`/servicioSala`): sesiones y asistencia en sala
- **Votaciones** (`/votaciones`): detalle y votaciones por proyecto

Ver documentación completa de la API en [`docs/api/api-camara-docs.md`](./docs/api/api-camara-docs.md).

### Senado de Chile — planificado

La API pública del Senado (`https://tramitacion.senado.cl/wspublico/`) será integrada en una próxima fase.

### Sincronización a Supabase — en progreso

Se están sincronizando los datos desde la API externa hacia las tablas relacionales de Supabase. Las siguientes sincronizaciones ya están operativas vía CLI (`bun run functions`):

- Ministerios
- Regiones, provincias, comunas y distritos
- Períodos legislativos y legislaturas
- Diputados vigentes
- Asistencia a sesiones de sala

---

## Tecnologías

### Backend

- **Runtime**: Node.js 22 + TypeScript
- **Framework**: Express.js
- **Base de datos**: Supabase (PostgreSQL)
- **Gestor de paquetes**: bun
- **Logging**: Pino (producción) + Chalk Console Logger (desarrollo/CLI)

### Futuro Frontend

- React / Next.js (planificado)

---

## Schema de base de datos

Tablas principales en Supabase (ver `src/models/create-table/structure-table.sql` para el schema completo):

| Tabla | Descripción |
|-------|-------------|
| `diputados` | Datos de todos los diputados |
| `militancias` | Historial de partidos de cada diputado |
| `partidos` | Partidos políticos |
| `periodos_legislativos` | Períodos del Congreso (4 años) |
| `legislaturas` | Legislaturas dentro de cada período |
| `sesiones_sala` | Sesiones celebradas en sala |
| `asistencias_sala` | Asistencia de diputados por sesión |
| `proyectos_ley` | Proyectos de ley ingresados |
| `votaciones_proyecto_ley` | Votaciones sobre proyectos |
| `proyecto_autores` | Autores de cada proyecto |
| `proyecto_materias` | Materias de cada proyecto |
| `proyectos_acuerdo` | Proyectos de acuerdo |
| `proyectos_resolucion` | Proyectos de resolución |
| `ministerios` | Ministerios del gobierno |
| `regiones` | Regiones de Chile |
| `porcentaje_asistencia` | Estadísticas de asistencia por año |

---

## Configuración

### 1. Prerrequisitos

- [bun](https://bun.sh) instalado
- Cuenta en [Supabase](https://supabase.com) con proyecto creado

### 2. Instalar dependencias

```bash
bun install
```

### 3. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Supabase
SUPABASE_URL=https://[tu-proyecto].supabase.co
SUPABASE_ANON_KEY=[tu-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]

# Servidor
BASE_URL=https://opendata.camara.cl/camaradiputados/WServices/
PORT=6000

# IA (etapa 2, opcional por ahora)
DEEPSEEK_API_KEY=
```

Ver guía completa de configuración de Supabase en [`docs/SUPABASE_SETUP_GUIDE.md`](./docs/SUPABASE_SETUP_GUIDE.md).

### 4. Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `bun dev` | Servidor en modo desarrollo con hot-reload |
| `bun start` | Servidor en producción (requiere build previo) |
| `bun run build` | Compilar TypeScript a JavaScript |
| `bun run type-check` | Verificar tipos sin compilar |
| `bun test` | Ejecutar tests |
| `bun run lint` | Análisis estático con ESLint |
| `bun run functions` | Abrir el CLI interactivo de funciones manuales |

---

## CLI de funciones manuales

El proyecto incluye un CLI interactivo para operaciones de sincronización y diagnóstico. Se ejecuta con:

```bash
bun run functions
```

Funciones disponibles:

| Función | Descripción |
|---------|-------------|
| `sync-periodos-legislativos` | Sincroniza períodos y legislaturas a Supabase |
| `consultar-ministerios` | Consulta y guarda ministerios |
| `consultar-regiones-distritos` | Sincroniza regiones, provincias, comunas y distritos |
| `consultar-diputados-vigentes` | Muestra diputados del período actual |
| `consultar-diputados-vigencia-lista` | Lista diputados con vigencia detallada |
| `consultar-asistencia-diputado-sala` | Historial de asistencia de un diputado específico |
| `resumen-asistencia-cache` | Agrega estadísticas de asistencia desde caché local |
| `consultar-votaciones` | Consulta votaciones de proyectos de ley |
| `consultar-comunes-todos` | Sincroniza todos los catálogos comunes |
| `check-supabase-connection` | Verifica conexión y muestra conteo por tabla |
| `inspect-supabase-table` | Inspecciona registros de una tabla específica |

---

## Flujo de datos

```
API Pública (Cámara / Senado)
      |
      v (XML → JSON)
 Servidor Express
      |
      v
 Supabase (PostgreSQL)
      |
      v (Etapa 2)
 Procesamiento con IA
      |
      v (Etapa 3)
 API pública / Web ciudadana
```

---

## Documentación adicional

- [API Cámara de Diputados](./docs/api/api-camara-docs.md)
- [Guía de configuración Supabase](./docs/SUPABASE_SETUP_GUIDE.md)
- [Sistema de logging](./docs/logging.md)
- [Utilidades](./ReadmeFiles/UTILS.md)
- [Changelog](./ReadmeFiles/CHANGELOG.md)

---

## Licencia

Este proyecto está bajo la Licencia GNU General Public License v3.0. Consulta el archivo [LICENSE](./LICENSE).
