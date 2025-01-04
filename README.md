# los-honorables

**Proyecto Senado Chile**

## Descripción

El proyecto "Senado Chile" es un servicio diseñado para consultar, almacenar y categorizar datos legislativos del Senado y la Cámara de Diputados de Chile.
Utiliza Firestore para almacenar datos y modelos de inteligencia artificial
como Gemini o ChatGPT para clasificar automáticamente los proyectos de ley en categorías relevantes.

El sistema ofrece flexibilidad y escalabilidad al permitir consultas dinámicas desde Firestore, adaptándose a las necesidades de los usuarios y la cantidad de datos.

## Funcionalidades

1. **Consulta de Datos Legislativos:**

   - Obtener proyectos de ley nuevos desde el Senado y la Cámara de Diputados.
   - Consultar detalles de proyectos, votaciones y legisladores.

2. **Almacenamiento de Datos:**

   - Guardar y estructurar los datos legislativos en Firestore para consultas rápidas y eficientes.

3. **Clasificación Automática:**

   - Clasificar proyectos de ley en categorías como Sociales, Económicos, Salud, entre otros, utilizando modelos de inteligencia artificial.

4. **Automatización:**
   - Cloud Functions para realizar tareas automáticas, como la actualización de datos legislativos y votaciones.

## Tecnologías Utilizadas

### **Frontend**

- React
- TypeScript
- Next.js
- Material-UI

### **Backend**

- Firebase Cloud Functions
- Firestore
- Firebase Cloud Storage
- Firebase App Check (posiblemente)

---

## Estructura de Servicios y Rutas

A continuación, se detallan los servicios disponibles junto a sus rutas correspondientes:

### **Comisión** - `/WSComision.asmx/`

- `retornarSesionesXComisionYAnno`: Detalle de las sesiones de una comisión en un año específico.
- `retornarComision`: Detalle de una comisión.
- `retornarComisionesVigentes`: Lista de comisiones vigentes.
- `retornarComisionesXPeriodo`: Lista de comisiones en un periodo legislativo.

### **Diputado** - `/WSDiputado.asmx/`

- `retornarDiputado`: Detalle de un Diputado/a.
- `retornarDiputados`: Lista de todos los Diputados/as.
- `retornarDiputadosPeriodoActual`: Diputados/as del periodo legislativo actual.
- `retornarDiputadosXPeriodo`: Diputados/as en un periodo legislativo.

### **Proyectos de Acuerdo** - `/WSProyectoAcuerdo.asmx/`

- `retornarProyectoAcuerdo`: Detalle de un proyecto de acuerdo.
- `retornarProyectosAcuerdoXAnno`: Proyectos de acuerdo presentados en un año específico.

### **Proyectos de Resolución** - `/WSProyectoResolucion.asmx/`

- `retornarProyectoResolucion`: Detalle de un proyecto de resolución.
- `retornarProyectosResolucionXAnno`: Proyectos de resolución presentados en un año específico.

### **Sala** - `/WSSala.asmx/`

- `retornarSesionAsistencia`: Detalle de la asistencia en una sesión.
- `retornarSesionesXAnno`: Sesiones de sala en un año específico.
- `retornarSesionesXLegislatura`: Sesiones de sala por legislatura.

### **Legislativo** - `/WSLegislativo.asmx/`

- `retornarLegislaturaActual`: Legislatura actual.
- `retornarLegislaturas`: Todas las legislaturas.
- `retornarMaterias`: Materias asociadas a proyectos de ley.
- `retornarMensajesXAnno`: Mensajes presentados en un año específico.
- `retornarMocionesXAnno`: Mociones presentadas en un año específico.
- `retornarProyectoLey`: Detalles de un proyecto de ley.
- `retornarTramitesConstitucionales`: Detalle de trámites constitucionales.
- `retornarTramitesReglamentarios`: Detalle de trámites reglamentarios.
- `retornarVotacionDetalle`: Detalle de una votación.
- `retornarVotacionesXAnno`: Votaciones efectuadas en un año específico.
- `retornarVotacionesXProyectoLey`: Votaciones asociadas a un proyecto de ley.

### **Común** - `/WSComunes.asmx/`

- **División Político-Administrativa:**

  - `retornarComunas`: Listado de comunas de Chile.
  - `retornarDistritos`: División político-administrativa.
  - `retornarProvincias`: Listado de provincias de Chile.
  - `retornarRegiones`: Listado de regiones de Chile.

- **Gobierno y Congreso:**

  - `retornarMinisterios`: División gubernamental de Chile.
  - `retornarTiposCamaraOrigen`: Tipos de cámaras en el Congreso Nacional.

- **Asistencia y Sesiones:**

  - `retornarTiposAsistencia`: Tipos de asistencia a sesiones.
  - `retornarTiposEstadoSesionComision`: Estados posibles de una sesión de comisión.
  - `retornarTiposEstadoSesionSala`: Estados posibles de una sesión de sala.
  - `retornarTiposTitularAsistencia`: Tipos asociados a la asistencia de los Diputados/as.

- **Proyectos de Ley y Legislación:**

  - `retornarTiposEstado`: Tipos de estado.
  - `retornarTiposEstadoAcuerdosResoluciones`: Estados posibles de proyectos de acuerdo y resolución.
  - `retornarTiposIniciativaProyectoLey`: Tipos de iniciativa de un proyecto de ley.
  - `retornarTiposLegislatura`: Tipos de legislaturas.
  - `retornarTiposQuorumVotacion`: Tipos de quórum en una votación.
  - `retornarTiposResultadoVotacion`: Resultados posibles de una votación.
  - `retornarTiposVotacion`: Tipos de votación.
  - `retornarTiposVotacionProyectoLey`: Tipos de votación en proyectos de ley.

- **General:**
  - `retornarTiposJustificacionesInasistencia`: Justificaciones posibles de inasistencia.
  - `retornarTiposSexo`: Tipos de sexo.

---

## Enlace a Información de Utils

Puedes consultar la sección de utilidades haciendo clic en [Utils](./ReadmeFiles/UTILS.md).

---

## Configuración

### **1. Variables de entorno**

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
FIRESTORE_PROJECT_ID=your-project-id
FIRESTORE_PRIVATE_KEY=your-private-key
FIRESTORE_CLIENT_EMAIL=your-client-email
```

## Contribución

Si deseas contribuir al desarrollo de este proyecto, puedes crear un fork, realizar los cambios necesarios y enviar un pull request. Toda contribución es bienvenida.

## Licencia

Este proyecto está bajo la Licencia GNU General Public License v3.0. Puedes consultarla en el archivo [LICENSE](./LICENSE).
