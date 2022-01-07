const CONSTANTS = {
  DURATION_MS: 50,
  OSCILLATOR_TYPE: "sine",
} as const;

export interface BeepParams {
  /**
   * frequency of the oscillator
   * DEFAULT: 440Hz
   */
  freq: number;
  /**
   * The time, in *milli* seconds, at which the sound should begin to play.
   * DEFAULT: 0ms
   */
  whenMs: number;
}

const DEFAULTS: BeepParams = {
  freq: 440,
  whenMs: 0,
};

export type BeepInit = Partial<BeepParams>;
export type CancelBeep = () => void;
export const beep = (ctx: AudioContext, init: BeepInit): CancelBeep | never => {
  const { freq, whenMs } = checkParams({
    ...DEFAULTS,
    ...init,
  });

  const oscillator = ctx.createOscillator();
  oscillator.type = CONSTANTS.OSCILLATOR_TYPE;
  oscillator.frequency.value = freq;
  oscillator.connect(ctx.destination);

  if (whenMs) {
    oscillator.start(whenMs / 1000);
    oscillator.stop((whenMs + CONSTANTS.DURATION_MS) / 1000);
  } else {
    oscillator.start();
    oscillator.stop(ctx.currentTime + CONSTANTS.DURATION_MS / 1000);
  }

  return () => {
    oscillator.stop();
  };
};

const checkParams = (params: BeepParams): BeepParams | never => {
  if (params.freq <= 0) {
    throw RangeError("freq in BeepInit must be positive");
  }
  if (params.whenMs < 0) {
    throw RangeError("whenMs in BeepInit must be positive or zero");
  }
  return params;
};
