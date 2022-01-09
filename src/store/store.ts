import {
  atom,
  DefaultValue,
  selector,
  useRecoilState,
} from "recoil";
import {
  INITIAL_BPM,
  INITIAL_BEAT_NUMERATOR,
  INITIAL_BEAT_DENOMINATOR,
} from "~/constants.json";

const store = atom({
  key: "settings",
  default: {
    bpm: INITIAL_BPM,
    beatNumerator: INITIAL_BEAT_NUMERATOR,
    beatDenominator: INITIAL_BEAT_DENOMINATOR,
    isRunning: false,
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
  key: "beat",
  get: ({ get }) => {
    const { beatNumerator, beatDenominator } = get(store);
    return [beatNumerator, beatDenominator];
  },
  set: ({ get, set }, newValue) => {
    newValue instanceof DefaultValue ||
      set(store, {
        ...get(store),
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

export const useBpm = () => useRecoilState(bpmSelector);
export const useBeat = () => useRecoilState(beatSelector);
export const useIsRunning = () => useRecoilState(isRunningSelector);
