export const newOscillatorNodeMock = (): OscillatorNode =>
  _newOscillatorNodeMock() as unknown as OscillatorNode;

/**
 * There are only neccessary properties & methods for this app.
 */
interface OscillatorNodeMock {
  type: OscillatorType;
  frequency: {
    value: number;
  };
  connect(ctx: AudioContext): void;
  start(when?: number): void;
  stop(when?: number): void;
}

const _newOscillatorNodeMock = (): OscillatorNodeMock => {
  return {
    type: "custom",
    frequency: {
      value: 0,
    },
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  };
};
