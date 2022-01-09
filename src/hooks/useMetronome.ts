import { useEffect, useMemo, useState } from "react";
import { createBeepScheduler } from "~/sound/beepScheduler";
import { createMasterGainBox } from "~/sound/masterGainBox";
import { useBeat, useBpm, useIsRunning, useVolume } from "~/store/store";

export const useMetronome = () => {
  const [bpm] = useBpm();
  const [beat] = useBeat();
  const [isRunning] = useIsRunning();
  const [volume] = useVolume();

  const { ctx, gainBox } = useMemo(() => {
    const ctx = new AudioContext();
    const gainBox = createMasterGainBox(ctx);
    return {
      ctx,
      gainBox,
    };
  }, []);

  const schedulerInit = { bpm, beat, volume, destNode: gainBox.unpack() };

  const [scheduler, setScheduler] = useState(
    createBeepScheduler(ctx, schedulerInit)
  );

  useEffect(() => {
    ctx.resume();
    scheduler.cancel();
    if (!isRunning) return;
    const newScheduler = createBeepScheduler(ctx, schedulerInit);
    newScheduler.exec();
    setScheduler(newScheduler);
  }, [bpm, beat, isRunning]);

  useEffect(() => {
    gainBox.setVolume(volume);
  }, [volume]);
};
