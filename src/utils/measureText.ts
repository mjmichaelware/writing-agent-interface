export function measureViewportCapacity(
  containerWidth: number, 
  containerHeight: number, 
  fontSize: string = '1.5rem', 
  lineHeight: number = 1.9
) {
  if (typeof window === 'undefined') return 200;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 200;
  context.font = `${fontSize} Frank Ruhl Libre, serif`;
  const metrics = context.measureText('M'); 
  const charsPerLine = Math.floor(containerWidth / metrics.width);
  const totalLines = Math.floor(containerHeight / (parseFloat(fontSize) * lineHeight));
  return Math.floor(charsPerLine * totalLines / 5); 
}
