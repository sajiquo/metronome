import { newOscillatorNodeMock } from "../../__mocks__/oscillatorNodeMock";
import { beep } from "./beep";

describe("beep", () => {
  const newSpiedAudioContext = (): {
    ctx: AudioContext;
    osc: OscillatorNode;
  } => {
    const osc = newOscillatorNodeMock();
    const ctx = {
      createOscillator: jest.fn(() => osc),
    } as unknown as AudioContext;
    return { ctx, osc };
  };

  describe("frequency settings", () => {
    it("should play sound of given positive frequency", () => {
      const { ctx, osc } = newSpiedAudioContext();
      const anyPositiveFreq = 600;
      beep(ctx, { freq: anyPositiveFreq });
      expect(osc.frequency.value).toBe(anyPositiveFreq);
    });
    it("should throw RangeError if given negative frequency", () => {
      const { ctx } = newSpiedAudioContext();
      const anyNegativeFreq = -600;
      expect(() => beep(ctx, { freq: anyNegativeFreq })).toThrow(expect.any(RangeError));
    });
    it("should throw RangeError if given zero frequency", () => {
      const { ctx } = newSpiedAudioContext();
      const zeroFreq = 0;
      expect(() => beep(ctx, { freq: zeroFreq })).toThrow(expect.any(RangeError));
    });
  });


  describe("whenMs settings", () => {
    it("should reserve to play sound in given whenMs time", () => {
      const { ctx, osc } = newSpiedAudioContext();
      const anyPositiveWhenMs = 250;
      beep(ctx, { whenMs: anyPositiveWhenMs });
      expect(osc.start).toHaveBeenCalledWith((anyPositiveWhenMs / 1000));
    });

    it("should play sound immediately if whenMs is zero", () => {
      const { ctx, osc } = newSpiedAudioContext();
      beep(ctx, { whenMs: 0 });
      expect(osc.start).toHaveBeenCalledWith();
    });
    it("should play sound immediately if whenMs is not given", () => {
      const { ctx, osc } = newSpiedAudioContext();
      beep(ctx, {});
      expect(osc.start).toHaveBeenCalledWith();
    });

    it("should throw RangeError if given negative whenMs", () => {
      const { ctx } = newSpiedAudioContext();
      const anyNegativeWhenMs = -400;
      expect(() => beep(ctx, { whenMs: anyNegativeWhenMs })).toThrow(expect.any(RangeError));
    });
  });


  describe("return value", () => {
    it("can cancel oscillator", () => {
      const { ctx, osc } = newSpiedAudioContext();
      const anyPositiveFreq = 600;
      const cancelFn = beep(ctx, { freq: anyPositiveFreq });
      cancelFn();
      expect(osc.stop).toBeCalledWith();
    });
  });
});
