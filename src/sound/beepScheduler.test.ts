import { MIN_AVAILABLE_BPM, MAX_AVAILABLE_BPM } from "~/constants.json";
import { createBeepScheduler } from "./beepScheduler";
import * as BeepModule from "./beep";
import { bpmToMs } from "./bpmToMs";

describe("schedule", () => {
  let originalWindowAudioContext: typeof window.AudioContext;
  beforeAll(() => {
    originalWindowAudioContext = window.AudioContext;
    Object.defineProperty(window, "AudioContext", {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      value: () => {
        let _currentTime = 0;
        setInterval(() => {
          _currentTime += 50 / 1000;
        }, 50);
        return {
          get currentTime() {
            return _currentTime;
          },
        };
      },
      writable: true,
    });
  });
  afterAll(() => {
    Object.defineProperty(window, "AudioContext", {
      value: originalWindowAudioContext,
      writable: true,
    });
  });

  const getSpiedBeep = () => {
    const cancelFn = jest.fn();
    return {
      spiedBeep: jest.spyOn(BeepModule, "beep").mockReturnValue(cancelFn),
      cancelFn,
    };
  };
  it.each([MIN_AVAILABLE_BPM, MAX_AVAILABLE_BPM])(
    "schedules beep by given bpm %d",
    (anyBpm) => {
      jest.useFakeTimers();
      const anyBeepedTimes = 10;

      const { spiedBeep, cancelFn } = getSpiedBeep();
      const init = {
        bpm: anyBpm,
      };
      const scheduler = createBeepScheduler(init);
      scheduler.exec();
      jest.advanceTimersByTime(bpmToMs(anyBpm) * anyBeepedTimes);
      scheduler.cancel();

      expect(spiedBeep).toHaveBeenCalledTimes(anyBeepedTimes);
      expect(cancelFn).toHaveBeenCalledTimes(anyBeepedTimes);
      spiedBeep.mockRestore();
    }
  );

  it.each([
    -1,
    0,
    MIN_AVAILABLE_BPM - 1,
    MAX_AVAILABLE_BPM + 1,
    MAX_AVAILABLE_BPM - 0.3,
  ])("throws RangeError if bpm %d is out of range", (anyBpm) => {
    jest.useFakeTimers();
    const init = {
      bpm: anyBpm,
    };
    expect(() => createBeepScheduler(init)).toThrow(expect.any(RangeError));
  });
});
