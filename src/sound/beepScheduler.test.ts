import {
  MIN_AVAILABLE_BPM,
  MAX_AVAILABLE_BPM,
  MAX_AVAILABLE_BEAT,
  MIN_AVAILABLE_BEAT,
  BEEP_FREQUENCY,
} from "~/constants.json";
import { createBeepScheduler, SchedulerInit } from "./beepScheduler";
import * as BeepModule from "./beep";
import { bpmToMs } from "./bpmToMs";

describe("schedule", () => {
  const createMockAudioContext = () => {
    let _currentTime = 0;
    setInterval(() => {
      _currentTime += 50 / 1000;
    }, 50);
    return {
      get currentTime() {
        return _currentTime;
      },
    } as AudioContext;
  };

  const getSpiedBeep = () => {
    const cancelFn = jest.fn();
    return {
      spiedBeep: jest.spyOn(BeepModule, "beep").mockReturnValue(cancelFn),
      cancelFn,
    };
  };
  it.each([
    [MIN_AVAILABLE_BPM, [4, 4]],
    [MAX_AVAILABLE_BPM, [6, 8]],
  ])("schedules beep by given bpm %d beat %s", (anyBpm, anyBeat) => {
    jest.useFakeTimers();
    const testTimeLength = 12;
    const anyBeepedTimes = (testTimeLength * anyBeat[1]) / 4;

    const { spiedBeep, cancelFn } = getSpiedBeep();
    const init: SchedulerInit = {
      bpm: anyBpm,
      beat: anyBeat,
    } as unknown as SchedulerInit;
    const scheduler = createBeepScheduler(createMockAudioContext(), init);
    scheduler.exec();
    jest.advanceTimersByTime(bpmToMs(anyBpm) * testTimeLength);
    scheduler.cancel();

    expect(spiedBeep).toHaveBeenCalledTimes(anyBeepedTimes);
    expect(cancelFn).toHaveBeenCalledTimes(anyBeepedTimes);
    spiedBeep.mockRestore();
  });

  it.each([
    [MIN_AVAILABLE_BPM, [4, 4]],
    [MAX_AVAILABLE_BPM, [6, 8]],
  ])(
    "should play higher freq for first beat for each bar",
    (anyBpm, anyBeat) => {
      jest.useFakeTimers();
      const [numerator] = anyBeat;
      const beepTimes = 4 * numerator;

      const { spiedBeep } = getSpiedBeep();
      const init: SchedulerInit = {
        bpm: anyBpm,
        beat: anyBeat,
      } as unknown as SchedulerInit;
      const scheduler = createBeepScheduler(createMockAudioContext(), init);
      scheduler.exec();
      jest.advanceTimersByTime(bpmToMs(anyBpm) * beepTimes);
      scheduler.cancel();

      for (let i = 1; i <= beepTimes; i++) {
        const expectedFreq =
          (i - 1) % numerator === 0 ? BEEP_FREQUENCY * 2 : BEEP_FREQUENCY;
        expect(spiedBeep).toHaveBeenNthCalledWith(
          i,
          expect.anything(),
          expect.objectContaining({ freq: expectedFreq })
        );
      }
    }
  );

  it.each([
    [0, [4, 4]],
    [-1, [4, 4]],
    [MAX_AVAILABLE_BPM - 1.3, [4, 4]],
    [120, [MIN_AVAILABLE_BEAT - 1, MAX_AVAILABLE_BEAT + 1]],
    [120, [0, 0]],
    [120, [1.2, 3.4]],
    [120, [-4, -4]],
  ])(
    "throws RangeError if bpm %d beat%s is out of range",
    (anyBpm, anyBeat) => {
      jest.useFakeTimers();
      const init = {
        bpm: anyBpm,
        beat: anyBeat,
      } as unknown as SchedulerInit;
      expect(() => createBeepScheduler(createMockAudioContext(), init)).toThrow(
        expect.any(RangeError)
      );
    }
  );

  it("throws Error if .exec() called multiple times", () => {
    const anyBpm = 120;
    const init = {
      bpm: anyBpm,
      beat: [4, 4] as const,
    };
    const scheduler = createBeepScheduler(createMockAudioContext(), init);
    expect(() => scheduler.exec()).not.toThrow(expect.any(Error));
    expect(() => scheduler.exec()).toThrow(expect.any(Error));
  });
});
