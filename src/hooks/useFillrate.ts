import { MouseEvent, useState } from "react";

export const useMouseEventYRate = (
  init: number
): [number, (ev: MouseEvent<HTMLDivElement>) => void] => {
  const [rate, setRate] = useState(init);
  return [
    rate,
    (ev) => {
      const { currentTarget, pageY } = ev;
      requestAnimationFrame(() => {
        const { y, height } = currentTarget.getBoundingClientRect();
        setRate(calcFillRate(pageY - y - window.scrollY, height));
      });
    },
  ];
};
/**
 * position by percentage from bottom
 */
const calcFillRate = (posFromTop: number, height: number): number =>
  ((height - posFromTop) / height) * 100;
