import { useMemo } from "react";
import type { FC } from "react";
import { Circle } from "~/ui/circle/Circle";
import { slider_circle, slider_root, slider_slide } from "./Slider.module.css";
import { useMouseEventYRate } from "~/hooks/useFillrate";
import { usePerc2Range } from "~/hooks/usePerc2Range";
import { useMouseDownMove } from "~/hooks/useMouseDownMove";

export interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onUpdate: (val: number) => void;
  onClick?: () => void;
  mode?: "normal" | "active" | "inactive";
}

export const Slider: FC<SliderProps & JSX.IntrinsicElements["div"]> = (
  props
) => {
  const { value, min, max, step, onUpdate } = validate(props);
  const [mouseState, dispatchMouseState] = useMouseDownMove();
  const [fillRate, updateFillRate] = useMouseEventYRate(40);
  const clipPath = useMemo(() => getClipPathStr(fillRate), [fillRate]);
  const perc2Range = usePerc2Range(min, max, step);

  return (
    <div
      className={[slider_root, props.className].join(" ")}
      style={props.style}
      onMouseDown={() => {
        dispatchMouseState("mousedown");
      }}
      onMouseUp={() => {
        mouseState !== "downmove" && props.onClick?.();
        onUpdate(perc2Range(fillRate));
        dispatchMouseState("mouseup");
      }}
      onMouseMove={(ev) => {
        dispatchMouseState("mousemove");
        mouseState === "downmove" && updateFillRate(ev);
      }}
    >
      <Circle className={slider_circle} mode={props.mode || "normal"}>
        {value}
      </Circle>
      <Circle
        className={[slider_slide, slider_circle].join(" ")}
        style={{
          clipPath,
          display: mouseState === "downmove" ? "grid" : "none",
        }}
      >
        {value}
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
        ...props,
        min: _min,
        max: _max,
        step: _step,
      }
    : {
        ...props,
        min: _max,
        max: _min,
        step: _step,
      };
};

const getClipPathStr = (fillRate: number) =>
  `polygon(0% 100%, 100% 100%, 100% ${100 - fillRate}%, 0% ${100 - fillRate}%)`;
