import {
  MAX_AVAILABLE_BPM,
  MIN_AVAILABLE_BEAT,
  MAX_AVAILABLE_BEAT,
  BEEP_FREQUENCY,
} from "~/constants.json";
import { beep, CancelBeep } from "./beep";
import { bpmToMs } from "./bpmToMs";

export interface SchedulerInit {
  bpm: number;
  /**
   * [3, 4] == 3/4
   * [4, 4] == 4/4
   * [6, 8] == 6/8
   */
  beat: readonly [number, number];
  destNode?: AudioNode;
}

export interface Scheduler {
  exec(): void | never;
  cancel(): void;
}

const CHECK_INTERVAL_MS = bpmToMs(MAX_AVAILABLE_BPM * 2);

export const createBeepScheduler = (
  ctx: AudioContext,
  init: SchedulerInit
): Scheduler | never => {
  const _init = validate(init);
  const [beatNumerator, beatDenominator] = _init.beat;
  const beepStepMs = bpmToMs((_init.bpm * beatDenominator) / 4);
  const beepCancelFns: CancelBeep[] = [];

  const getCurrentTimeMs = (ctx: AudioContext) => ctx.currentTime * 1000;
  const getNextCheckTime = (ctx: AudioContext) =>
    getCurrentTimeMs(ctx) + CHECK_INTERVAL_MS;

  let intervalId = 0;

  return {
    exec: () => {
      if (intervalId) throw Error("scheduler has already been executed");
      const beepTimeQueue = newIncrementer(
        getCurrentTimeMs(ctx) + beepStepMs,
        beepStepMs
      );
      const nthBeatQueue = newRingIncrementer(beatNumerator);

      const reserveNextOrNoop = () => {
        const nextBeepTime = beepTimeQueue.current;
        const isNextFirstBeat = nthBeatQueue.current === 0;
        if (nextBeepTime > getNextCheckTime(ctx)) return;
        beepCancelFns.push(
          beep(ctx, {
            whenMs: nextBeepTime,
            freq: isNextFirstBeat ? BEEP_FREQUENCY * 2 : BEEP_FREQUENCY,
            destNode: init.destNode,
          })
        );
        if (beepCancelFns.length > 32) beepCancelFns.shift();
        beepTimeQueue.next();
        nthBeatQueue.next();
      };

      intervalId = window.setInterval(reserveNextOrNoop, CHECK_INTERVAL_MS);
    },

    cancel: () => {
      window.clearInterval(intervalId);
      intervalId = 0;
      beepCancelFns.forEach((fn) => fn());
      beepCancelFns.length = 0;
    },
  };
};

const validate = (init: SchedulerInit): SchedulerInit | never => {
  const { bpm, beat } = init;
  if (!Number.isInteger(bpm)) {
    throw RangeError(`BPM must be integer`);
  }
  if (bpm <= 0) {
    throw RangeError(`BPM must be positive`);
  }
  if (!Number.isInteger(beat[0]) || !Number.isInteger(beat[1])) {
    throw RangeError(`beat must be integer`);
  }
  if (
    beat[0] < MIN_AVAILABLE_BEAT ||
    MAX_AVAILABLE_BEAT < beat[0] ||
    beat[1] < MIN_AVAILABLE_BEAT ||
    MAX_AVAILABLE_BEAT < beat[1]
  ) {
    throw RangeError(
      `Beat must be integer between ${MIN_AVAILABLE_BEAT} and ${MAX_AVAILABLE_BEAT}`
    );
  }
  return init;
};

interface Incrementer {
  get current(): number;
  next(): number;
}

const newIncrementer = (init: number, step: number): Incrementer => {
  let _current = init;
  return {
    get current() {
      return _current;
    },
    next() {
      _current += step;
      return _current;
    },
  };
};

const newRingIncrementer = (length: number): Incrementer => {
  const incrementer = newIncrementer(0, 1);
  const getCurrent = (incrementer: Incrementer, length: number) =>
    incrementer.current % length;
  return {
    get current() {
      return getCurrent(incrementer, length);
    },
    next() {
      incrementer.next();
      return getCurrent(incrementer, length);
    },
  };
};
