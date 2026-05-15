export function measureViewportCapacity(w: number, h: number, fs: string = '1.5rem', lh: number = 1.9) {
  if (typeof window === 'undefined') return 200;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 200;
  context.font = `${fs} Frank Ruhl Libre, serif`;
  const m = context.measureText('M');
  const cpl = Math.floor(w / m.width);
  const tl = Math.floor(h / (parseFloat(fs) * lh));
  return Math.floor(cpl * tl / 5);
}
