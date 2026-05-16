export const formatChileIso = (date: Date = new Date()): string => {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Santiago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).formatToParts(date);

    const get = (type: string) => parts.find(p => p.type === type)?.value || '00';
    const y = get('year');
    const m = get('month');
    const d = get('day');
    const h = get('hour');
    const min = get('minute');
    const s = get('second');
    return `${y}-${m}-${d}T${h}:${min}:${s}`;
};

export const compareIsoStrings = (a: string, b: string): number => {
    if (a === b) return 0;
    return a > b ? 1 : -1;
};

export const isAfterChileNow = (isoNoTz: string): boolean => {
    const nowChile = formatChileIso();
    return compareIsoStrings(isoNoTz, nowChile) === 1;
};

export const normalizeIsoNoTz = (iso: string): string => {
    // Asume formato YYYY-MM-DDTHH:mm:ss y asegura cero padding
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
    if (!m) return iso;
    const [_, Y, M, D, h, mi, s] = m;
    const pad = (v: string) => v.padStart(2, '0');
    return `${Y}-${pad(M)}-${pad(D)}T${pad(h)}:${pad(mi)}:${pad(s)}`;
};

export const getChileCurrentYear = (): number => {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric' }).formatToParts(new Date());
    const y = parts.find(p => p.type === 'year')?.value;
    return y ? parseInt(y, 10) : new Date().getFullYear();
};

export const getYearsDescending = (startYear?: number, endYear: number = 1990): number[] => {
    const start = startYear && startYear >= endYear ? startYear : getChileCurrentYear();
    const out: number[] = [];
    for (let y = start; y >= endYear; y--) out.push(y);
    return out;
};

export function* iterateYearsDescending(startYear?: number, endYear: number = 1990): Generator<number> {
    const start = startYear && startYear >= endYear ? startYear : getChileCurrentYear();
    for (let y = start; y >= endYear; y--) {
        yield y;
    }
}
