# Documentación API Cámara de Diputados de Chile

## 📋 Índice por Categorías
1. [Comisión](#comisión)
2. [Común (Catálogos)](#común-catálogos)
3. [Diputado](#diputado)
4. [Legislativo](#legislativo)
5. [Proyectos de Acuerdo](#proyectos-de-acuerdo)
6. [Proyectos de Resolución](#proyectos-de-resolución)
7. [Service Sala](#service-sala)
8. [Diagrama de Relaciones](#diagrama-de-relaciones)

---

## 🏛️ Comisión

### **retornarComision**
**Solicita:** ID de comisión  
**Retorna:** Información detallada de UNA comisión específica
- Nombre de la comisión
- Tipo de comisión
- Integrantes actuales
- Metadata de la comisión

**Uso:** Obtener detalles de una comisión cuando ya conoces su ID

---

### **retornarComisionesVigentes**
**Solicita:** Ningún parámetro  
**Retorna:** LISTA de todas las comisiones actualmente vigentes
- IDs de comisiones
- Nombres
- Estados

**Uso:** Descubrir qué comisiones están operativas actualmente

---

### **retornarComisionesXPeriodo**
**Solicita:** ID de período legislativo  
**Retorna:** LISTA de comisiones que existieron en ese período
- Comisiones que operaron en ese período específico
- Incluye comisiones permanentes y especiales

**Uso:** Análisis histórico de comisiones por período legislativo

---

### **retornarSesionesXComisionYAnno**
**Solicita:** ID de comisión + año  
**Retorna:** LISTA de sesiones de esa comisión en ese año
- Fechas de sesiones
- IDs de sesiones
- Estados (realizadas, suspendidas)
- Proyectos tratados

**Uso:** Ver el calendario de trabajo de una comisión específica

---

## 📊 Común (Catálogos)

Estos endpoints retornan catálogos estáticos o semi-estáticos. No requieren IDs específicos, funcionan como diccionarios de valores válidos.

### **Geográficos**
- **retornarRegiones**: Lista todas las regiones de Chile
- **retornarProvincias**: Lista todas las provincias
- **retornarComunas**: Lista todas las comunas
- **retornarDistritos**: Lista todos los distritos electorales

**Uso:** Referencias geográficas para cruzar con datos de diputados

---

### **Administrativos**
- **retornarMinisterios**: Lista de ministerios del gobierno
- **retornarTiposSexo**: Catálogo de géneros (M/F)

---

### **Estados y Tipos - Proyectos**
- **retornarTiposEstado**: Estados posibles de proyectos de ley
- **retornarTiposCamaraOrigen**: De dónde se origina (Cámara/Senado)
- **retornarTiposIniciativaProyectoLey**: Tipo de iniciativa (Ejecutivo/Parlamentaria)

---

### **Estados y Tipos - Sesiones**
- **retornarTiposEstadoSesionSala**: Estados de sesiones en sala
- **retornarTiposEstadoSesionComision**: Estados de sesiones de comisión
- **retornarTiposSesionSala**: Tipos de sesiones en sala (ordinaria, extraordinaria)
- **retornarTiposSesionComision**: Tipos de sesiones de comisión

---

### **Votaciones**
- **retornarTiposOpcionVoto**: Opciones de voto (A favor, En contra, Abstención, Ausente)
- **retornarTiposVotacion**: Tipos de votación (nominal, económica)
- **retornarTiposVotacionProyectoLey**: Tipos de votación en proyecto ley
- **retornarTiposQuorumVotacion**: Quórums requeridos
- **retornarTiposResultadoVotacion**: Resultados posibles (Aprobado/Rechazado)

---

### **Asistencia**
- **retornarTiposAsistencia**: Tipos de asistencia (Presente, Ausente con/sin aviso)
- **retornarTiposTitularAsistencia**: Si es titular o suplente
- **retornarTiposJustificacionesInasistencia**: Razones de inasistencias

---

### **Proyectos de Acuerdo/Resolución**
- **retornarTiposEstadoAcuerdosResoluciones**: Estados de proyectos de acuerdo y resolución

---

### **Legislaturas**
- **retornarTiposLegislatura**: Tipos de legislatura (ordinaria, extraordinaria)

---

## 👤 Diputado

### **retornarDiputado**
**Solicita:** ID de diputado  
**Retorna:** Información completa de UN diputado
- Datos personales
- Distrito que representa
- Partido político
- Períodos en que ha sido diputado
- Comisiones en las que participa

**Uso:** Perfil completo de un diputado específico

---

### **retornarDiputados**
**Solicita:** Ningún parámetro  
**Retorna:** LISTA histórica de TODOS los diputados
- Incluye diputados actuales e históricos
- Datos básicos de identificación

**Uso:** Catálogo completo histórico, útil para búsquedas amplias

---

### **retornarDiputadosPeriodoActual**
**Solicita:** Ningún parámetro  
**Retorna:** LISTA de diputados del período legislativo en curso
- Solo diputados actualmente en ejercicio
- Información actualizada

**Uso:** ¿Quiénes son los diputados actuales?

---

### **retornarDiputadosXPeriodo**
**Solicita:** ID de período legislativo  
**Retorna:** LISTA de diputados de ese período específico
- Diputados que ejercieron en ese período
- Útil para análisis histórico

**Uso:** Composición de la cámara en períodos anteriores

---

## 📜 Legislativo

### **Períodos y Legislaturas**

**retornarPeriodoLegislativoActual**
- **Solicita:** Nada
- **Retorna:** Información del período legislativo en curso
- Fechas de inicio/fin
- Número de período

---

**retornarPeriodosLegislativos**
- **Solicita:** Nada
- **Retorna:** LISTA de todos los períodos legislativos históricos

---

**retornarLegislaturaActual**
- **Solicita:** Nada
- **Retorna:** Información de la legislatura en curso (ordinaria/extraordinaria)

---

**retornarLegislaturas**
- **Solicita:** Nada
- **Retorna:** LISTA de todas las legislaturas históricas

---

### **Proyectos de Ley**

**retornarProyectoLey**
- **Solicita:** Boletín o ID de proyecto
- **Retorna:** Información completa de UN proyecto de ley
  - Título y objetivo
  - Estado actual
  - Autores/patrocinadores
  - Trámite constitucional actual
  - Urgencia
  - Materias relacionadas
  - Historial de tramitación

**Uso:** Detalle completo de un proyecto específico

---

**retornarMaterias**
- **Solicita:** Nada
- **Retorna:** LISTA de todas las materias legislativas
- Clasificación temática de proyectos (salud, educación, economía, etc.)

---

**retornarTramitesConstitucionales**
- **Solicita:** Nada
- **Retorna:** LISTA de trámites constitucionales posibles
- Primer trámite, segundo trámite, etc.

---

**retornarTramitesReglamentarios**
- **Solicita:** Nada
- **Retorna:** LISTA de trámites reglamentarios
- Discusión en general, en particular, comisión mixta, etc.

---

### **Mociones y Mensajes**

**retornarMocionesXAnno**
- **Solicita:** Año
- **Retorna:** LISTA de mociones presentadas ese año
- Mociones son iniciativas parlamentarias
- Incluye autores y estado

**Uso:** Producción legislativa parlamentaria por año

---

**retornarMensajesXAnno**
- **Solicita:** Año
- **Retorna:** LISTA de mensajes presidenciales ese año
- Mensajes son iniciativas del ejecutivo
- Incluye urgencias y materias

**Uso:** Agenda legislativa del ejecutivo por año

---

### **Votaciones**

**retornarVotacionDetalle**
- **Solicita:** ID de votación
- **Retorna:** Detalle completo de UNA votación
  - Voto de cada diputado
  - Fecha y hora
  - Resultado
  - Quórum
  - Descripción

**Uso:** Análisis detallado de cómo votó cada diputado

---

**retornarVotacionesXAnno**
- **Solicita:** Año
- **Retorna:** LISTA de votaciones de ese año
  - IDs de votaciones
  - Fechas
  - Descripciones breves
  - Resultados

**Uso:** Explorar actividad legislativa anual

---

**retornarVotacionesXProyectoLey**
- **Solicita:** Boletín/ID de proyecto
- **Retorna:** LISTA de votaciones de ese proyecto
  - Un proyecto tiene múltiples votaciones
  - Votaciones en general, particular, artículos

**Uso:** Seguimiento de todas las votaciones de un proyecto

---

## 📄 Proyectos de Acuerdo

**retornarProyectoAcuerdo**
- **Solicita:** ID de proyecto de acuerdo
- **Retorna:** Detalle de UN proyecto de acuerdo
  - Contenido
  - Autores
  - Estado
  - Fechas

**Uso:** Detalle de un acuerdo específico

---

**retornarProyectosAcuerdoXAnno**
- **Solicita:** Año
- **Retorna:** LISTA de proyectos de acuerdo de ese año

**Nota:** Los proyectos de acuerdo son pronunciamientos de la Cámara sobre temas específicos, no son leyes.

---

## 📋 Proyectos de Resolución

**retornarProyectoResolucion**
- **Solicita:** ID de proyecto de resolución
- **Retorna:** Detalle de UN proyecto de resolución
  - Similar estructura a proyectos de acuerdo
  - Son para asuntos internos de la Cámara

**Uso:** Detalle de una resolución específica

---

**retornarProyectosResolucionXAnno**
- **Solicita:** Año
- **Retorna:** LISTA de proyectos de resolución de ese año

**Nota:** Las resoluciones regulan el funcionamiento interno de la Cámara.

---

## 🏛️ Service Sala

**retornarSesionesXAnno**
- **Solicita:** Año
- **Retorna:** LISTA de sesiones de sala de ese año
  - Fechas
  - Tipos (ordinaria/extraordinaria)
  - Estados

**Uso:** Calendario de sesiones plenarias

---

**retornarSesionesXLegislatura**
- **Solicita:** ID de legislatura
- **Retorna:** LISTA de sesiones de esa legislatura específica

**Uso:** Sesiones en períodos ordinarios vs extraordinarios

---

**retornarSesionAsistencia**
- **Solicita:** ID de sesión
- **Retorna:** Detalle de asistencia de UNA sesión
  - Quién asistió
  - Quién no asistió
  - Justificaciones
  - Tipos de asistencia

**Uso:** Control de asistencia parlamentaria

---

## 🔗 Diagrama de Relaciones Principal

```
PERÍODO LEGISLATIVO
    └─> retornarPeriodoLegislativoActual
    └─> retornarPeriodosLegislativos
            │
            ├─> retornarDiputadosXPeriodo(período_id)
            │       └─> Lista de Diputados
            │               └─> retornarDiputado(diputado_id)
            │                       └─> Perfil completo
            │
            └─> retornarComisionesXPeriodo(período_id)
                    └─> Lista de Comisiones
                            └─> retornarComision(comision_id)
                            └─> retornarSesionesXComisionYAnno(comision_id, año)

PROYECTOS DE LEY
    └─> retornarMocionesXAnno(año) o retornarMensajesXAnno(año)
            └─> Lista de Proyectos iniciados
                    └─> retornarProyectoLey(boletín)
                            ├─> Detalle completo del proyecto
                            │
                            └─> retornarVotacionesXProyectoLey(boletín)
                                    └─> Lista de votaciones del proyecto
                                            └─> retornarVotacionDetalle(votacion_id)
                                                    └─> Voto de cada diputado

VOTACIONES
    └─> retornarVotacionesXAnno(año)
            └─> Lista de todas las votaciones del año
                    └─> retornarVotacionDetalle(votacion_id)
                            └─> Detalle con votos individuales

SESIONES DE SALA
    └─> retornarSesionesXAnno(año)
            └─> Lista de sesiones plenarias
                    └─> retornarSesionAsistencia(sesion_id)
                            └─> Detalle de asistencia

SESIONES DE COMISIÓN
    └─> retornarComisionesVigentes
            └─> Lista de comisiones activas
                    └─> retornarSesionesXComisionYAnno(comision_id, año)
                            └─> Lista de sesiones de la comisión
```

---

## 🎯 Patrones de Uso Comunes

### **Patrón 1: Análisis de un Diputado**
```
1. retornarDiputadosPeriodoActual → Lista de diputados
2. retornarDiputado(id) → Perfil del diputado
3. retornarVotacionesXAnno(año) → Votaciones del año
4. retornarVotacionDetalle(id) → Ver cómo votó ese diputado
```

### **Patrón 2: Seguimiento de Proyecto**
```
1. retornarMocionesXAnno(año) → Buscar proyecto
2. retornarProyectoLey(boletín) → Ver estado y detalles
3. retornarVotacionesXProyectoLey(boletín) → Todas sus votaciones
4. retornarVotacionDetalle(id) → Detalle de cada votación
```

### **Patrón 3: Actividad de Comisión**
```
1. retornarComisionesVigentes → Ver comisiones activas
2. retornarComision(id) → Detalles de la comisión
3. retornarSesionesXComisionYAnno(id, año) → Sesiones del año
```

### **Patrón 4: Análisis Anual Completo**
```
1. retornarVotacionesXAnno(año) → Todas las votaciones
2. retornarMocionesXAnno(año) → Proyectos parlamentarios
3. retornarMensajesXAnno(año) → Proyectos ejecutivo
4. retornarSesionesXAnno(año) → Actividad de sala
```

---

## 💡 Tipos de Endpoints por Función

### **Endpoints de DETALLE** (Requieren ID específico)
- retornarDiputado
- retornarComision
- retornarProyectoLey
- retornarVotacionDetalle
- retornarProyectoAcuerdo
- retornarProyectoResolucion
- retornarSesionAsistencia

### **Endpoints de LISTA** (Retornan múltiples items)
- retornarDiputados, retornarDiputadosXPeriodo
- retornarComisionesVigentes, retornarComisionesXPeriodo
- retornarVotacionesXAnno, retornarVotacionesXProyectoLey
- retornarMocionesXAnno, retornarMensajesXAnno
- retornarSesionesXAnno, retornarSesionesXLegislatura
- retornarProyectosAcuerdoXAnno
- retornarProyectosResolucionXAnno

### **Endpoints de CATÁLOGO** (Valores de referencia)
- Todos los endpoints que empiezan con "retornarTipos..."
- retornarRegiones, retornarComunas, retornarDistritos
- retornarMaterias, retornarMinisterios
- retornarTramitesConstitucionales, retornarTramitesReglamentarios

---

## ⚠️ Notas Importantes

1. **Jerarquía de Datos**: Siempre necesitas primero las listas para obtener IDs, luego los detalles
2. **Catálogos primero**: Consulta los catálogos para entender valores válidos
3. **Períodos legislativos**: Muchos datos están organizados por período
4. **Boletín vs ID**: Proyectos de ley usan número de boletín, otros usan IDs internos
5. **Datos actuales vs históricos**: Algunos endpoints tienen versión "actual" y versión histórica