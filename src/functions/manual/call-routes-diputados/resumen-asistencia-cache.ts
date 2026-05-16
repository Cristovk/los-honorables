import { ManualFunction } from '../types';
import { readAsistenciaCache, aggregateAsistencia, clearAsistenciaCache } from '../utils/persistent-cache';
import { ChalkConsoleLogger } from '@services/logging/chalk-console-logger.service';

type AnyObj = Record<string, any>;

// Logger visual con estilo cyberpunk para outputs de consola
const logger = new ChalkConsoleLogger();

export const resumenAsistenciaCache: ManualFunction = {
  id: 'resumen-asistencia-cache',
  name: 'Resumen Caché Asistencia Diputado',
  description: 'Lee caché persistente, agrega porcentajes y permite limpiar caché',
  category: 'diputados',
  inputs: [
    { name: 'diputado_id', type: 'number', description: 'ID de Diputado', required: true },
    { name: 'show_details', type: 'boolean', description: 'Mostrar detalle de corridas', required: false, defaultValue: true },
    { name: 'clear_cache', type: 'boolean', description: 'Limpiar caché después de mostrar', required: false, defaultValue: false },
  ],
  execute: async (params?: AnyObj) => {
    const diputadoId: string = String(params?.diputado_id);
    const showDetails: boolean = params?.show_details !== undefined ? !!params.show_details : true;
    const clear: boolean = !!params?.clear_cache;

    const cache = readAsistenciaCache(diputadoId);
    if (!cache || cache.runs.length === 0) {
      logger.warning('No hay datos en caché para el diputado especificado');
      return;
    }

    const agg = aggregateAsistencia(cache);

    // Header principal con estilo cyberpunk
    logger.header('RESUMEN AGREGADO');
    
    // Mostrar datos del resumen con formato tabular
    logger.data('Diputado', diputadoId);
    logger.data('Años consultados', agg.yearsConsulted.join(', '));
    logger.data('Total sesiones celebradas', agg.totalCelebradas);
    logger.separator();
    
    // Mostrar estadísticas de asistencia
    logger.data('Asiste', `${agg.Asiste.percent}% (${agg.Asiste.count})`);
    logger.data('Justificado', `${agg.Justificado.percent}% (${agg.Justificado.count})`);
    logger.data('No Asiste', `${agg.NoAsiste.percent}% (${agg.NoAsiste.count})`);

    if (showDetails) {
      // Subheader para el detalle de corridas
      logger.subheader('DETALLE DE CORRIDAS');
      
      cache.runs.forEach((r, idx) => {
        logger.newLine();
        logger.badge(`Corrida #${idx + 1}`, 'primary');
        logger.data('Período', `${r.years.start}-${r.years.end}`);
        logger.data('Timestamp', r.timestamp);
        logger.data('Años procesados', r.years.processedYears.join(', '));
        logger.data('Total celebradas', r.totalCelebradas);
        
        // Crear lista con las categorías
        logger.list([
          `Asiste: ${r.categorias.asiste.percent}% (${r.categorias.asiste.count})`,
          `Justificado: ${r.categorias.justificado.percent}% (${r.categorias.justificado.count})`,
          `No Asiste: ${r.categorias.noAsiste.percent}% (${r.categorias.noAsiste.count})`
        ]);
        logger.separator();
      });
    }

    if (clear) {
      logger.newLine();
      clearAsistenciaCache(diputadoId);
      logger.success('Caché persistente eliminada exitosamente');
    }
  },
};

export default resumenAsistenciaCache;