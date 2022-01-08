import { useCallback } from "react";

export const usePerc2Range = (min: number, max: number, step: number) =>
  useCallback(
    (rate: number) => {
      const range = max - min;
      const multipledRate = (rate * range) / 100;
      const roundedRate = multipledRate - (multipledRate % step);
      return roundedRate + min;
    },
    [min, max, step]
  );
