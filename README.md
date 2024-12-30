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

## Configuración

### **1. Variables de entorno**

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
FIRESTORE_PROJECT_ID=your-project-id
FIRESTORE_PRIVATE_KEY=your-private-key
FIRESTORE_CLIENT_EMAIL=your-client-email
