import fs from 'fs';
import path from 'path';

export interface AsistenciaRunRecord {
  years: { start: number; end: number; processedYears: number[] };
  totalCelebradas: number;
  categorias: {
    asiste: { percent: number; count: number };
    justificado: { percent: number; count: number };
    noAsiste: { percent: number; count: number };
  };
  timestamp: string;
}

export interface AsistenciaCache {
  diputadoId: string;
  runs: AsistenciaRunRecord[];
}

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const getCacheFile = (diputadoId: string): string => {
  const dir = path.join(process.cwd(), '.cache');
  ensureDir(dir);
  return path.join(dir, `asistencia_${diputadoId}.json`);
};

export const readAsistenciaCache = (diputadoId: string): AsistenciaCache | null => {
  const file = getCacheFile(diputadoId);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const data = JSON.parse(raw);
    return data as AsistenciaCache;
  } catch {
    return null;
  }
};

export const appendAsistenciaRun = (diputadoId: string, run: AsistenciaRunRecord): AsistenciaCache => {
  const file = getCacheFile(diputadoId);
  const existing = readAsistenciaCache(diputadoId) || { diputadoId, runs: [] };
  existing.runs.push(run);
  fs.writeFileSync(file, JSON.stringify(existing, null, 2), 'utf8');
  return existing;
};

export const clearAsistenciaCache = (diputadoId: string): void => {
  const file = getCacheFile(diputadoId);
  if (fs.existsSync(file)) fs.unlinkSync(file);
};

export const aggregateAsistencia = (cache: AsistenciaCache) => {
  let totalCelebradas = 0;
  let asisteCount = 0;
  let justificadoCount = 0;
  let noAsisteCount = 0;
  const yearsSet = new Set<number>();
  for (const r of cache.runs) {
    totalCelebradas += r.totalCelebradas;
    asisteCount += r.categorias.asiste.count;
    justificadoCount += r.categorias.justificado.count;
    noAsisteCount += r.categorias.noAsiste.count;
    r.years.processedYears.forEach((y) => yearsSet.add(y));
  }
  const denom = totalCelebradas || 1;
  return {
    yearsConsulted: Array.from(yearsSet).sort((a, b) => a - b),
    totalCelebradas,
    Asiste: { percent: Number(((asisteCount / denom) * 100).toFixed(2)), count: asisteCount },
    Justificado: { percent: Number(((justificadoCount / denom) * 100).toFixed(2)), count: justificadoCount },
    NoAsiste: { percent: Number(((noAsisteCount / denom) * 100).toFixed(2)), count: noAsisteCount },
  };
};