import { atom, DefaultValue, selector, useRecoilState } from "recoil";
import {
  INITIAL_BPM,
  INITIAL_BEAT_NUMERATOR,
  INITIAL_BEAT_DENOMINATOR,
  INITIAL_VOLUME,
} from "~/constants.json";

const store = atom({
  key: "settings",
  default: {
    bpm: INITIAL_BPM,
    volume: INITIAL_VOLUME,
    isRunning: false,
  },
});

const beat = atom({
  key: "beat",
  default: {
    beatNumerator: INITIAL_BEAT_NUMERATOR,
    beatDenominator: INITIAL_BEAT_DENOMINATOR,
  },
});

const bpmSelector = selector<number>({
  key: "bpm",
  get: ({ get }) => get(store).bpm,
  set: ({ get, set }, newValue) => {
    newValue instanceof DefaultValue ||
      set(store, { ...get(store), bpm: newValue });
  },
});

const beatSelector = selector<readonly [number, number]>({
  key: "beatselector",
  get: ({ get }) => {
    const { beatNumerator, beatDenominator } = get(beat);
    return [beatNumerator, beatDenominator];
  },
  set: ({ get, set }, newValue) => {
    newValue instanceof DefaultValue ||
      set(beat, {
        ...get(beat),
        beatNumerator: newValue[0],
        beatDenominator: newValue[1],
      });
  },
});

const isRunningSelector = selector<boolean>({
  key: "isRunning",
  get: ({ get }) => get(store).isRunning,
  set: ({ get, set }, newValue) => {
    newValue instanceof DefaultValue ||
      set(store, {
        ...get(store),
        isRunning: newValue,
      });
  },
});

const volumeSelectror = selector<number>({
  key: "volume",
  get: ({ get }) => get(store).volume,
  set: ({ get, set }, newValue) => {
    newValue instanceof DefaultValue ||
      set(store, {
        ...get(store),
        volume: newValue,
      });
  },
});

export const useBpm = () => useRecoilState(bpmSelector);
export const useBeat = () => useRecoilState(beatSelector);
export const useIsRunning = () => useRecoilState(isRunningSelector);
export const useVolume = () => useRecoilState(volumeSelectror);
