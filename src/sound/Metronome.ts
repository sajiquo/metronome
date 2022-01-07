import { INITIAL_BPM, INITIAL_BEAT } from "~/constants.json";
import { createBeepScheduler, Scheduler, SchedulerInit } from "./beepScheduler";

const DEFAULT: SchedulerInit = {
  bpm: INITIAL_BPM,
  beat: INITIAL_BEAT as [number, number],
};

export class Metronome {
  private scheduler: Scheduler;
  private init: SchedulerInit;
  private _isRunning: boolean;

  constructor() {
    this.init = DEFAULT;
    this.scheduler = createBeepScheduler(this.init);
    this._isRunning = false;
  }

  start(): void {
    try {
      this.scheduler.exec();
      this._isRunning = true;
    } catch (e) {
      console.warn(e);
    }
  }

  stop(): void {
    this.scheduler.cancel();
    this._isRunning = false;
  }

  isRunning(): boolean {
    return this._isRunning;
  }

  changeBpm(bpm: number): boolean {
    return this.swapSchedulerOrNoop({ ...this.init, bpm });
  }

  changeBeat(beat: readonly [number, number]): boolean {
    return this.swapSchedulerOrNoop({ ...this.init, beat });
  }

  private swapSchedulerOrNoop(triedInit: SchedulerInit): boolean {
    try {
      const newScheduler = createBeepScheduler(triedInit);
      this.scheduler = newScheduler;
      this.init = triedInit;
      this.isRunning() && this.start();
      return true;
    } catch (e) {
      console.warn(e);
      return false;
    }
  }
}
