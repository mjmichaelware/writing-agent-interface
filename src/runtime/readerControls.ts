export type ReaderFont = "serif" | "sans" | "mono";

export type ReaderControls = {
  font: ReaderFont;
  fontScale: number;
  lineHeight: number;
  sensitivity: number;
  colorShift: number;
  distortion: number;
  blur: number;
  contrast: number;
  warmth: number;
  motion: boolean;
  bionic: boolean;
};

export const DEFAULT_READER_CONTROLS: ReaderControls = {
  font: "serif",
  fontScale: 1,
  lineHeight: 1.7,
  sensitivity: 0.5,
  colorShift: 0.25,
  distortion: 0.15,
  blur: 0.15,
  contrast: 1,
  warmth: 0.25,
  motion: true,
  bionic: false,
};

export function readerFontStack(font: ReaderFont) {
  if (font === "sans") return "Inter, ui-sans-serif, system-ui, sans-serif";
  if (font === "mono") return "ui-monospace, SFMono-Regular, Menlo, monospace";
  return "Georgia, Cambria, Times New Roman, serif";
}
