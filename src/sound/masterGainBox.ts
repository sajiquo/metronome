export const createMasterGainBox = (ctx: AudioContext) => {
  const gain = ctx.createGain();
  const comp = ctx.createDynamicsCompressor();
  gain.connect(comp).connect(ctx.destination);
  return {
    unpack: () => gain,
    setVolume: (perc: number) => {
      gain.gain.value = perc / 100;
    },
  };
};
