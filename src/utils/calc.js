export const R_PER_ACRE = 40; // 1 Acre = 40 R (Guntha)
export const ACRE_PER_R = 0.025; // 1 R = 0.025 Acre

export const PRODUCTS = {
  solid: { id: 'solid', name: 'ProGibb GA (Solid)', short: 'Solid', factor: 0.6 },
  liquid: { id: 'liquid', name: 'ProGibb Easy GA (Liquid)', short: 'Liquid', factor: 1.5 },
};

/** Validate a raw text field. Returns {status: 'empty'|'invalid'|'zero'|'ok', value?} */
export function parsePositive(raw) {
  const s = String(raw ?? '').trim();
  if (s === '') return { status: 'empty' };
  if (!/^(\d+\.?\d*|\.\d+)$/.test(s)) return { status: 'invalid' }; // rejects negatives, letters, "e", "1.2.3"
  const value = Number(s);
  if (!Number.isFinite(value)) return { status: 'invalid' };
  if (value <= 0) return { status: 'zero' };
  return { status: 'ok', value };
}

/** Round and drop trailing zeros: 0.500000 -> "0.5", 80 -> "80". */
export function formatNumber(n, decimals = 6) {
  return String(parseFloat(Number(n).toFixed(decimals)));
}

export const rToAcre = (r) => r * ACRE_PER_R;
export const acreToR = (acre) => acre * R_PER_ACRE;

/** Required grams = Acres x PPM x factor, rounded to 2 decimals. */
export function requiredGrams(acres, ppm, factor) {
  return Math.round((acres * ppm * factor + 1e-9) * 100) / 100;
}