/**
 * [cite_start]DIGITAL PAPER ANALYSIS: Canvas 2D API  [cite: 101, 268-269]
 * Measures true character width to determine context window capacity.
 */
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

  [cite_start]// Use the Frank Ruhl Libre font metrics[span_1](end_span)
  context.font = `${fontSize} Frank Ruhl Libre, serif`;
  const metrics = context.measureText('M'); 
  const avgCharWidth = metrics.width;

  const charsPerLine = Math.floor(containerWidth / avgCharWidth);
  const totalLines = Math.floor(containerHeight / (parseFloat(fontSize) * lineHeight));
  
  [span_2](start_span)// Calculate Active Context Window Capacity[span_2](end_span)
  return Math.floor(charsPerLine * totalLines / 5); 
}
