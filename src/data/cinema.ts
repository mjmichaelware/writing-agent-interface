// Layer 2 — auto-rotating photo backdrops per chapter.
// Drop your photos in public/cinema/<filename> and list them here.
// Layer 2 will cycle through these as paragraphs render.

export const CINEMA_ASSETS: Record<string, string[]> = {
  // Chapter slug → ordered list of image URLs from /public
  '1': ['/bg.png'],
  '2': ['/bg.png'],
  '3': ['/bg.png'],
  '4': ['/bg.png'],
  '5': ['/bg.png'],
  '6': ['/bg.png'],
  '7': ['/bg.png'],
  '8': ['/bg.png'],
  '9': ['/bg.png'],
  '10': ['/bg.png'],
  '11': ['/bg.png'],
  '13': ['/bg.png'],
};

// Paragraphs per image (image swaps every N paragraphs)
export const CINEMA_PARAGRAPHS_PER_IMAGE = 6;
