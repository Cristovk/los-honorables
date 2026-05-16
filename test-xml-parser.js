const xml = `<?xml version="1.0" encoding="utf-8"?>
<TiposTitularAsistenciaColeccion xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://opendata.camara.cl/camaradiputados/v1">
<TipoTitularAsistencia Valor="1">Titular</TipoTitularAsistencia>
<TipoTitularAsistencia Valor="2">Reemplazante</TipoTitularAsistencia>
</TiposTitularAsistenciaColeccion>`;

// Importar el módulo - asegúrate de que el path sea correcto
import('./src/utils/xmlToJson.js').then(async ({ convertXmlToJson }) => {
  try {
    const result = await convertXmlToJson(xml);
    console.log('Resultado del parsing:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}).catch(err => console.error('Error importando:', err));
