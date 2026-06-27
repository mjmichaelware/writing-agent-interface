import { Howl } from 'howler';

let current: Howl | null = null;

function unloadCurrent() {
  if (!current) return;
  current.stop();
  current.unload();
  current = null;
}

function createSound(url: string, volume: number) {
  return new Howl({
    src: [url],
    volume,
  });
}

export const audioPlayer = {
  play(url: string): void {
    unloadCurrent();

    current = createSound(url, 1);
    current.play();
  },

  stop(): void {
    unloadCurrent();
  },

  crossfade(url: string, durationMs = 500): void {
    const outgoing = current;

    if (outgoing) {
      outgoing.fade(1, 0, durationMs);
      outgoing.once('fade', () => {
        if (outgoing === current) {
          current = null;
        }

        outgoing.stop();
        outgoing.unload();
      });
    }

    const incoming = createSound(url, 0);
    current = incoming;

    incoming.once('load', () => {
      if (current !== incoming) {
        incoming.unload();
        return;
      }

      incoming.play();
      incoming.fade(0, 1, durationMs);
    });
  },
};
