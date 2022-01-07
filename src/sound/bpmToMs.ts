export const bpmToMs = (bpm: number): number =>
  bpm ? Math.round((1000 * 60) / bpm) : 0;
