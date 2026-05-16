# Documentación API Cámara de Diputados - Comandos cURL

## 📋 Índice por Categorías
1. [Comisión](#comisión)
2. [Común (Catálogos)](#común-catálogos)
3. [Diputado](#diputado)
4. [Legislativo](#legislativo)
5. [Proyectos de Acuerdo](#proyectos-de-acuerdo)
6. [Proyectos de Resolución](#proyectos-de-resolución)
7. [Service Sala](#service-sala)

---

## 🏛️ Comisión

### retornarComision
**Descripción:** Información detallada de una comisión específica

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarComision" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmComisionId=123"
```

**Parámetros:**
- `prmComisionId`: ID de la comisión (número)

---

### retornarComisionesVigentes
**Descripción:** Lista de todas las comisiones actualmente vigentes

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarComisionesVigentes" \
-H "Content-Type: application/x-www-form-urlencoded"
```

**Parámetros:** Ninguno

---

### retornarComisionesXPeriodo
**Descripción:** Lista de comisiones que existieron en un período legislativo

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarComisionesXPeriodo" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmPeriodoId=456"
```

**Parámetros:**
- `prmPeriodoId`: ID del período legislativo (número)

---

### retornarSesionesXComisionYAnno
**Descripción:** Lista de sesiones de una comisión en un año específico

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarSesionesXComisionYAnno" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmComisionId=123&prmAnno=2024"
```

**Parámetros:**
- `prmComisionId`: ID de la comisión (número)
- `prmAnno`: Año (formato: YYYY)

---

## 📊 Común (Catálogos)

### Catálogos Geográficos

#### retornarRegiones
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarRegiones" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarProvincias
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarProvincias" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarComunas
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarComunas" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarDistritos
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarDistritos" \
-H "Content-Type: application/x-www-form-urlencoded"
```

---

### Catálogos Administrativos

#### retornarMinisterios
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarMinisterios" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarTiposSexo
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposSexo" \
-H "Content-Type: application/x-www-form-urlencoded"
```

---

### Catálogos de Estados y Tipos

#### retornarTiposEstado
**Descripción:** Estados posibles de proyectos de ley

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposEstado" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarTiposCamaraOrigen
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposCamaraOrigen" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarTiposIniciativaProyectoLey
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposIniciativaProyectoLey" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarTiposEstadoAcuerdosResoluciones
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposEstadoAcuerdosResoluciones" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarTiposEstadoSesionComision
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposEstadoSesionComision" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarTiposEstadoSesionSala
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposEstadoSesionSala" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarTiposSesionComision
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposSesionComision" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarTiposSesionSala
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposSesionSala" \
-H "Content-Type: application/x-www-form-urlencoded"
```

---

### Catálogos de Votación

#### retornarTiposOpcionVoto
**Descripción:** Opciones de voto (A favor, En contra, Abstención, Ausente)

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposOpcionVoto" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarTiposVotacion
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposVotacion" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarTiposVotacionProyectoLey
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposVotacionProyectoLey" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarTiposQuorumVotacion
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposQuorumVotacion" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarTiposResultadoVotacion
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposResultadoVotacion" \
-H "Content-Type: application/x-www-form-urlencoded"
```

---

### Catálogos de Asistencia

#### retornarTiposAsistencia
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposAsistencia" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarTiposTitularAsistencia
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposTitularAsistencia" \
-H "Content-Type: application/x-www-form-urlencoded"
```

#### retornarTiposJustificacionesInasistencia
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposJustificacionesInasistencia" \
-H "Content-Type: application/x-www-form-urlencoded"
```

---

### Catálogos de Legislatura

#### retornarTiposLegislatura
```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTiposLegislatura" \
-H "Content-Type: application/x-www-form-urlencoded"
```

---

## 👤 Diputado

### retornarDiputado
**Descripción:** Información completa de un diputado específico

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarDiputado" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmDiputadoId=1234"
```

**Parámetros:**
- `prmDiputadoId`: ID del diputado (número)

---

### retornarDiputados
**Descripción:** Lista histórica de todos los diputados

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarDiputados" \
-H "Content-Type: application/x-www-form-urlencoded"
```

**Parámetros:** Ninguno

---

### retornarDiputadosPeriodoActual
**Descripción:** Lista de diputados del período legislativo actual

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarDiputadosPeriodoActual" \
-H "Content-Type: application/x-www-form-urlencoded"
```

**Parámetros:** Ninguno

---

### retornarDiputadosXPeriodo
**Descripción:** Lista de diputados de un período específico

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarDiputadosXPeriodo" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmPeriodoId=456"
```

**Parámetros:**
- `prmPeriodoId`: ID del período legislativo (número)

---

## 📜 Legislativo

### Períodos y Legislaturas

#### retornarPeriodoLegislativoActual
**Descripción:** Información del período legislativo actual

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarPeriodoLegislativoActual" \
-H "Content-Type: application/x-www-form-urlencoded"
```

**Parámetros:** Ninguno

---

#### retornarPeriodosLegislativos
**Descripción:** Lista de todos los períodos legislativos

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarPeriodosLegislativos" \
-H "Content-Type: application/x-www-form-urlencoded"
```

**Parámetros:** Ninguno

---

#### retornarLegislaturaActual
**Descripción:** Información de la legislatura actual

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarLegislaturaActual" \
-H "Content-Type: application/x-www-form-urlencoded"
```

**Parámetros:** Ninguno

---

#### retornarLegislaturas
**Descripción:** Lista de todas las legislaturas

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarLegislaturas" \
-H "Content-Type: application/x-www-form-urlencoded"
```

**Parámetros:** Ninguno

---

### Proyectos de Ley

#### retornarProyectoLey
**Descripción:** Información completa de un proyecto de ley

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarProyectoLey" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmProyectoLeyId=12345-07"
```

**Parámetros:**
- `prmProyectoLeyId`: Número de boletín del proyecto (ej: "12345-07")

---

#### retornarMaterias
**Descripción:** Lista de todas las materias legislativas

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarMaterias" \
-H "Content-Type: application/x-www-form-urlencoded"
```

**Parámetros:** Ninguno

---

#### retornarTramitesConstitucionales
**Descripción:** Lista de trámites constitucionales

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTramitesConstitucionales" \
-H "Content-Type: application/x-www-form-urlencoded"
```

**Parámetros:** Ninguno

---

#### retornarTramitesReglamentarios
**Descripción:** Lista de trámites reglamentarios

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarTramitesReglamentarios" \
-H "Content-Type: application/x-www-form-urlencoded"
```

**Parámetros:** Ninguno

---

### Mociones y Mensajes

#### retornarMocionesXAnno
**Descripción:** Lista de mociones presentadas en un año

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarMocionesXAnno" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmAnno=2024"
```

**Parámetros:**
- `prmAnno`: Año (formato: YYYY)

---

#### retornarMensajesXAnno
**Descripción:** Lista de mensajes presidenciales de un año

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarMensajesXAnno" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmAnno=2024"
```

**Parámetros:**
- `prmAnno`: Año (formato: YYYY)

---

### Votaciones

#### retornarVotacionDetalle
**Descripción:** Detalle completo de una votación específica

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarVotacionDetalle" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmVotacionId=54321"
```

**Parámetros:**
- `prmVotacionId`: ID de la votación (número)

---

#### retornarVotacionesXAnno
**Descripción:** Lista de votaciones de un año

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarVotacionesXAnno" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmAnno=2024"
```

**Parámetros:**
- `prmAnno`: Año (formato: YYYY)

---

#### retornarVotacionesXProyectoLey
**Descripción:** Lista de votaciones de un proyecto de ley

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarVotacionesXProyectoLey" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmProyectoLeyId=12345-07"
```

**Parámetros:**
- `prmProyectoLeyId`: Número de boletín del proyecto (ej: "12345-07")

---

## 📄 Proyectos de Acuerdo

### retornarProyectoAcuerdo
**Descripción:** Detalle de un proyecto de acuerdo

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarProyectoAcuerdo" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmProyectoAcuerdoId=789"
```

**Parámetros:**
- `prmProyectoAcuerdoId`: ID del proyecto de acuerdo (número)

---

### retornarProyectosAcuerdoXAnno
**Descripción:** Lista de proyectos de acuerdo de un año

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarProyectosAcuerdoXAnno" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmAnno=2024"
```

**Parámetros:**
- `prmAnno`: Año (formato: YYYY)

---

## 📋 Proyectos de Resolución

### retornarProyectoResolucion
**Descripción:** Detalle de un proyecto de resolución

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarProyectoResolucion" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmProyectoResolucionId=321"
```

**Parámetros:**
- `prmProyectoResolucionId`: ID del proyecto de resolución (número)

---

### retornarProyectosResolucionXAnno
**Descripción:** Lista de proyectos de resolución de un año

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarProyectosResolucionXAnno" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmAnno=2024"
```

**Parámetros:**
- `prmAnno`: Año (formato: YYYY)

---

## 🏛️ Service Sala

### retornarSesionesXAnno
**Descripción:** Lista de sesiones de sala de un año

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarSesionesXAnno" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmAnno=2024"
```

**Parámetros:**
- `prmAnno`: Año (formato: YYYY)

---

### retornarSesionesXLegislatura
**Descripción:** Lista de sesiones de una legislatura

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarSesionesXLegislatura" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmLegislaturaId=367"
```

**Parámetros:**
- `prmLegislaturaId`: ID de la legislatura (número)

---

### retornarSesionAsistencia
**Descripción:** Detalle de asistencia de una sesión

```bash
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarSesionAsistencia" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmSesionId=9876"
```

**Parámetros:**
- `prmSesionId`: ID de la sesión (número)

---

## 💡 Notas Importantes

### Formato de Respuesta
Todas las respuestas vienen en formato **XML**. Ejemplo de procesamiento:

```bash
# Guardar respuesta en archivo
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarDiputadosPeriodoActual" \
-H "Content-Type: application/x-www-form-urlencoded" \
-o respuesta.xml

# Ver respuesta formateada (requiere xmllint)
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarDiputadosPeriodoActual" \
-H "Content-Type: application/x-www-form-urlencoded" | xmllint --format -
```

### Headers Opcionales
Puedes agregar headers adicionales según necesites:

```bash
curl -X POST "URL_ENDPOINT" \
-H "Content-Type: application/x-www-form-urlencoded" \
-H "Accept: application/xml" \
-H "User-Agent: MiAplicacion/1.0" \
-d "parametros"
```

### Manejo de Errores
Si un endpoint no encuentra datos, típicamente retorna XML vacío o con mensaje de error:

```bash
# Ejemplo con verbose para ver detalles de la petición
curl -v -X POST "URL_ENDPOINT" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "parametros"
```

### Ejemplos de Flujos Completos

#### Obtener todas las votaciones de 2024 de un proyecto específico
```bash
# 1. Obtener lista de proyectos del año
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarMocionesXAnno" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmAnno=2024"

# 2. Con el boletín obtenido, consultar el proyecto
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarProyectoLey" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmProyectoLeyId=12345-07"

# 3. Obtener votaciones del proyecto
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarVotacionesXProyectoLey" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmProyectoLeyId=12345-07"

# 4. Obtener detalle de una votación específica
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarVotacionDetalle" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmVotacionId=54321"
```

#### Analizar un diputado específico
```bash
# 1. Obtener lista de diputados actuales
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarDiputadosPeriodoActual" \
-H "Content-Type: application/x-www-form-urlencoded"

# 2. Obtener perfil completo del diputado
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarDiputado" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmDiputadoId=1234"

# 3. Ver votaciones del año para analizar su voto
curl -X POST "http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarVotacionesXAnno" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "prmAnno=2024"
```

---

## 🔧 Script Bash para Testing Rápido

```bash
#!/bin/bash

BASE_URL="http://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx"

# Función para hacer request
api_call() {
    local endpoint=$1
    local params=$2
    
    echo "=== Llamando a $endpoint ==="
    curl -X POST "$BASE_URL/$endpoint" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "$params" | xmllint --format - || echo "XML inválido o sin datos"
    echo ""
}

# Ejemplos de uso
api_call "retornarDiputadosPeriodoActual" ""
api_call "retornarVotacionesXAnno" "prmAnno=2024"
api_call "retornarComisionesVigentes" ""
```