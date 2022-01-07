import { INITIAL_BPM, INITIAL_BEAT } from "~/constants.json";
import { Metronome } from "./Metronome";
import * as BeepSchedulerMod from "./beepScheduler";

describe("metronome", () => {
  const getSpiedScheduler = () => {
    const scheduler = {
      exec: jest.fn(),
      cancel: jest.fn(),
    };
    const mockCreateBeepScheduler = jest
      .spyOn(BeepSchedulerMod, "createBeepScheduler")
      .mockReturnValue(scheduler);
    return {
      mockCreateBeepScheduler,
      scheduler,
    };
  };
  it("should create/start/stop new beepScheduler instance", () => {
    const { mockCreateBeepScheduler, scheduler } = getSpiedScheduler();

    const metronome = new Metronome();
    expect(mockCreateBeepScheduler).toHaveBeenCalledWith(
      expect.objectContaining({
        bpm: INITIAL_BPM,
        beat: INITIAL_BEAT,
      })
    );
    metronome.start();
    expect(scheduler.exec).toHaveBeenCalled();
    metronome.stop();
    expect(scheduler.cancel).toHaveBeenCalled();

    mockCreateBeepScheduler.mockRestore();
  });

  it("should recreate beepScheduler instance on change of bpm/beats", () => {
    const { mockCreateBeepScheduler } = getSpiedScheduler();

    const anyBpm = 200;
    const anyBeat = [6, 8] as const;

    const metronome = new Metronome();
    expect(metronome.changeBpm(anyBpm)).toBeTruthy();
    expect(mockCreateBeepScheduler).toHaveBeenCalledWith(
      expect.objectContaining({
        bpm: anyBpm,
        beat: INITIAL_BEAT,
      })
    );

    expect(metronome.changeBeat(anyBeat)).toBeTruthy();
    expect(mockCreateBeepScheduler).toHaveBeenCalledWith(
      expect.objectContaining({
        bpm: anyBpm,
        beat: anyBeat,
      })
    );
    mockCreateBeepScheduler.mockRestore();
  });

  it("should keep runnning on recreation by change of bpm/beats, if was runnning before", () => {
    const { mockCreateBeepScheduler, scheduler } = getSpiedScheduler();

    const anyBpm = 200;

    const metronome = new Metronome();
    metronome.start();

    expect(metronome.changeBpm(anyBpm)).toBeTruthy();
    expect(mockCreateBeepScheduler).toHaveBeenCalledWith(
      expect.objectContaining({
        bpm: anyBpm,
        beat: INITIAL_BEAT,
      })
    );
    expect(scheduler.exec).toHaveBeenCalledTimes(2); // 1st: initial scheduler / 2nd swapped scheduler
    expect(scheduler.cancel).toHaveBeenCalledTimes(1);

    mockCreateBeepScheduler.mockRestore();
  });

  it("should keep stopping on recreation by change of bpm/beats, if was stopping before", () => {
    const { mockCreateBeepScheduler, scheduler } = getSpiedScheduler();

    const anyBpm = 200;

    const metronome = new Metronome();
    metronome.start();
    metronome.stop();

    expect(metronome.changeBpm(anyBpm)).toBeTruthy();
    expect(mockCreateBeepScheduler).toHaveBeenCalledWith(
      expect.objectContaining({
        bpm: anyBpm,
        beat: INITIAL_BEAT,
      })
    );
    expect(scheduler.exec).toHaveBeenCalledTimes(1);
    expect(scheduler.cancel).toHaveBeenCalledTimes(2);

    mockCreateBeepScheduler.mockRestore();
  });

  it("does nothing (without logging) if started multiple times", () => {
    const { mockCreateBeepScheduler, scheduler } = getSpiedScheduler();

    const metronome = new Metronome();
    metronome.start();
    scheduler.exec.mockImplementation(() => {
      throw new Error("some error expected for test");
    });
    expect(() => metronome.start()).not.toThrowError();

    mockCreateBeepScheduler.mockRestore();
  });

  it("does nothing (without logging) if attempted to change invalid bpm/beat", () => {
    const { mockCreateBeepScheduler } = getSpiedScheduler();

    const metronome = new Metronome();
    mockCreateBeepScheduler.mockImplementation(() => {
      throw new Error("some error expected for test");
    });

    expect(() => metronome.changeBpm(-12345)).not.toThrowError();
    expect(() => metronome.changeBeat([0.2, -67])).not.toThrowError();

    mockCreateBeepScheduler.mockRestore();
  });
});
