import { useMemo, useState } from "react";
import type { FC } from "react";
import { Circle } from "~/ui/circle/Circle";
import { slider_circle, slider_root, slider_slide } from "./Slider.module.css";
import { useCallback } from "react";

export interface SliderProps {
  min: number;
  max: number;
  step: number;
}

export const Slider: FC<SliderProps> = (props) => {
  const { min, max, step } = validate(props);
  const [fillRate, setFillRate] = useState(100);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const getValue = useCallback(
    (fillrate: number) => {
      const range = max - min;
      const multipledRate = (fillrate * range) / 100;
      const roundedRate = multipledRate - (multipledRate % step);
      return roundedRate + min;
    },
    [fillRate, min, max, step]
  );
  const clipPath = useMemo(() => getClipPathStr(fillRate), [fillRate]);

  return (
    <div
      className={slider_root}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseMove={(ev) => {
        if (!isMouseDown) return;
        const { currentTarget, pageY } = ev;
        requestAnimationFrame(() => {
          const { y, height } = currentTarget.getBoundingClientRect();
          setFillRate(calcFillRate(pageY - y - window.scrollY, height));
        });
      }}
    >
      <Circle className={slider_circle}>{getValue(fillRate)}</Circle>
      <Circle
        className={[slider_slide, slider_circle].join(" ")}
        style={{ clipPath }}
      >
        {getValue(fillRate)}
      </Circle>
    </div>
  );
};

/**
 * force positive int
 */
const validate = (props: SliderProps) => {
  const { min, max, step } = props;
  const _min = Math.round(Math.abs(min));
  const _max = Math.round(Math.abs(max));
  const _step = Math.round(Math.abs(step)) || 1;
  return _min < _max
    ? {
        min: _min,
        max: _max,
        step: _step,
      }
    : {
        min: _max,
        max: _min,
        step: _step,
      };
};

/**
 * position by percentage from bottom
 */
const calcFillRate = (posFromTop: number, height: number): number =>
  ((height - posFromTop) / height) * 100;

const getClipPathStr = (fillRate: number) =>
  `polygon(0% 100%, 100% 100%, 100% ${100 - fillRate}%, 0% ${100 - fillRate}%)`;
