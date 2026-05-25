export interface ViewportCoordinateRatio {
  intersectionRatio: number;
  distanceFromCenter: number;
}

export function calculateFocalScrollCurve(
  elementRect: DOMRect,
  viewportHeight: number
): ViewportCoordinateRatio {
  const elementCenter = elementRect.top + elementRect.height / 2;
  const viewportCenter = viewportHeight / 2;
  const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
  const intersectionRatio = Math.max(0, 1 - (distanceFromCenter / (viewportHeight / 2)));
  return { intersectionRatio, distanceFromCenter };
}

export function mapArcVectors(intersectionRatio: number, thematicWeight: number) {
  const arcMass = thematicWeight * intersectionRatio;
  const arcTension = thematicWeight > 0.5 ? Math.pow(intersectionRatio, 2) : 0;
  const arcVelocity = (1 - intersectionRatio) * (thematicWeight > 0 ? 1 : -1);
  return {
    "--arc-mass": arcMass.toFixed(3),
    "--arc-tension": arcTension.toFixed(3),
    "--arc-velocity": arcVelocity.toFixed(3)
  };
}

export function logSystemState(msg: string): void {
  console.log(`[NOS-KERNEL]: ${msg}`);
}
