type Weights = {
  shadow?: number;
  persona?: number;
  anima?: number;
  self?: number;
};

const KEYS: Array<keyof Weights> = ['shadow', 'persona', 'anima', 'self'];

function resolveAlpha() {
  const parsed = Number(process.env.NEXT_PUBLIC_EMA_ALPHA || process.env.EMA_ALPHA || '0.3');
  if (!Number.isFinite(parsed)) return 0.3;
  return Math.min(1, Math.max(0, parsed));
}

export function applyEMA(current: Weights, previous: Weights = {}): Required<Weights> {
  const alpha = resolveAlpha();

  return KEYS.reduce((acc, key) => {
    const currentValue = Number(current?.[key] ?? 0);
    const previousValue = Number(previous?.[key] ?? currentValue);
    acc[key] = (alpha * currentValue) + ((1 - alpha) * previousValue);
    return acc;
  }, {} as Required<Weights>);
}

export default applyEMA;
