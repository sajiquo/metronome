import { bpmToMs } from "./bpmToMs";
describe("bpmToMs", () => {
  it.each([
    [60, 1000],
    [120, 500],
    [99, 606], // rounded
    [0, 0], // no error nor Infinity
  ])("should convert bpm to milliseconds", (bpm: number, expected: number) => {
    expect(bpmToMs(bpm)).toStrictEqual(expected);
  });
});
