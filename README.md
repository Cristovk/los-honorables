# los-honorables

**Proyecto Senado Chile**

## Descripción

Servicio que consulta, almacena y categoriza datos legislativos del Senado y la Cámara de Diputados de Chile. Este proyecto utiliza Firestore para almacenar datos y modelos como Gemini para clasificar proyectos en categorías.

## Funcionalidades

- Consultar proyectos de ley nuevos desde el Senado y la Cámara de Diputados.
- Consultar detalles de proyectos, votaciones y legisladores.
- Almacenar y estructurar los datos en Firestore.
- Clasificar proyectos automáticamente en categorías como Sociales, Económicos, Salud, entre otros.

---

## Rutas Utilizadas

### **Listado de proyectos por fecha**

Consulta todos los proyectos que han tenido movimiento desde una fecha específica.

- **URL:**  
  `https://tramitacion.senado.cl/wspublico/invoca_tramitacion_fecha.html`

---

### **Proyectos de ley**

Obtiene información detallada de un proyecto por su número de boletín.

- **URL:**  
  `https://tramitacion.senado.cl/wspublico/invoca_proyecto.html`

---

### **Votaciones por boletín - Senado**

Consulta votaciones de un proyecto de ley en el Senado por su boletín.

- **URL:**  
  `https://tramitacion.senado.cl/wspublico/invoca_votacion.html`

---

### **Votaciones por boletín - Cámara de Diputados**

Consulta las votaciones de un proyecto de ley en la Cámara de Diputados.

- **URL:**  
  `https://opendata.camara.cl/pages/votacion_boletin.aspx`

---

### **Detalle de votación - Cámara de Diputados**

Consulta los detalles de una votación específica por su ID.

- **URL:**  
  `https://opendata.camara.cl/pages/votacion_detalle.aspx`

---

### **Senadores vigentes**

Consulta un listado de los senadores actuales en ejercicio.

- **URL:**  
  `https://tramitacion.senado.cl/wspublico/senadores_vigentes.php`

---

### **Diputados vigentes**

Consulta un listado de los diputados actuales en ejercicio.

- **URL:**  
  `https://opendata.camara.cl/wscamaradiputados.asmx/getDiputados_Vigentes`

---

### **Diputados por período legislativo**

Consulta los diputados activos en un período legislativo específico.

- **URL:**  
  `https://opendata.camara.cl/wscamaradiputados.asmx/getDiputados_Periodo?prmPeriodoID={ID}`

---

### **Legislaturas - Cámara de Diputados**

Consulta información sobre las legislaturas históricas.

- **URL:**  
  `https://opendata.camara.cl/pages/legislaturas.aspx`

---

### **Legislatura actual - Cámara de Diputados**

Consulta información sobre la legislatura en curso.

- **URL:**  
  `https://opendata.camara.cl/pages/legislatura_actual.aspx`

---

## Utils

### **1. Funciones conversiones XML a JSON**

El archivo utils/xmlToJson.ts contiene funciones diseñadas para convertir datos en formato XML a objetos JSON de manera flexible y reutilizable. Está compuesto por dos funciones principales:

processNode: Es una función recursiva que procesa nodos individuales del XML. Si un nodo no tiene hijos, retorna su contenido de texto; si tiene hijos, los procesa recursivamente para construir un objeto JSON. Además, maneja casos donde varias etiquetas con el mismo nombre están presentes, agrupándolas en un array.

extractDataFromXml: Esta función toma el XML completo y un nombre de nodo raíz (rootTag). Utiliza JSDOM para parsear el XML y busca el nodo raíz especificado. Luego, aplica processNode para convertir los nodos encontrados en objetos JSON. Si hay múltiples nodos raíz (como en el caso de una lista de elementos), los procesa como un array de objetos.

fetchAndProcessXml: Es una función auxiliar que realiza una solicitud HTTP a una URL dada, obtiene el XML como respuesta, y lo pasa a extractDataFromXml para procesarlo. Combina la obtención de datos remotos con la conversión a JSON, lo que la hace ideal para integrarse con APIs externas.

El propósito general de este archivo es abstraer el trabajo de procesar XML en aplicaciones basadas en TypeScript. Esto lo hace reutilizable para diferentes endpoints o estructuras de XML, ya que el nodo raíz que se desea procesar puede configurarse dinámicamente. Ideal para trabajar con APIs que devuelven respuestas en XML y convertirlas a un formato más manejable (JSON) en una aplicación moderna.

---

## Configuración

### **1. Variables de entorno**

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
FIRESTORE_PROJECT_ID=your-project-id
FIRESTORE_PRIVATE_KEY=your-private-key
FIRESTORE_CLIENT_EMAIL=your-client-email
```
