import { MIN_AVAILABLE_BPM, MAX_AVAILABLE_BPM } from "~/constants.json";
import { beep, CancelBeep } from "./beep";
import { bpmToMs } from "./bpmToMs";

interface SchedularInit {
  bpm: number;
}
interface Scheduler {
  exec(): void;
  cancel(): void;
}

const CHECK_INTERVAL_MS = bpmToMs(MAX_AVAILABLE_BPM * 2);

export const createBeepScheduler = (init: SchedularInit): Scheduler | never => {
  const beepStepMs = bpmToMs(validate(init).bpm);
  const beepCancelFns: CancelBeep[] = [];

  let intervalId: number;
  return {
    exec: () => {
      const ctx = new AudioContext();
      let nextMs = ctx.currentTime + beepStepMs;
      intervalId = window.setInterval(() => {
        if (nextMs < CHECK_INTERVAL_MS + (ctx.currentTime * 1000)) {
          beepCancelFns.push(beep(ctx, { whenMs: nextMs }))
          nextMs += beepStepMs;
        }
      }, CHECK_INTERVAL_MS);
    },
    cancel: () => {
      window.clearInterval(intervalId);
      beepCancelFns.forEach(fn => fn());
    },
  }
}

const validate = (init: SchedularInit): SchedularInit | never => {
  const { bpm } = init;
  if (bpm !== Math.round(bpm)) {
    throw RangeError(`BPM must be integer`);
  }
  if (bpm < MIN_AVAILABLE_BPM || MAX_AVAILABLE_BPM < bpm) {
    throw RangeError(`BPM must be integer between ${MIN_AVAILABLE_BPM} and ${MAX_AVAILABLE_BPM}`);
  }
  return init;
}
