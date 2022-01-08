import { useMemo, useState } from "react";
import type { FC } from "react";
import { Circle } from "~/ui/circle/Circle";
import { slider_circle, slider_root, slider_slide } from "./Slider.module.css";

const getClipPathStr = (fillRate: number) =>
  `polygon(0% 100%, 100% 100%, 100% ${fillRate}%, 0% ${fillRate}%)`;

export const Slider: FC = () => {
  const [fillRate, setFillRate] = useState(100);
  const clipPath = useMemo(() => getClipPathStr(fillRate), [fillRate]);
  return (
    <div
      className={slider_root}
      onClick={() => {
        setFillRate(fillRate - 10);
      }}
    >
      <Circle className={slider_circle}>circle1</Circle>
      <Circle
        className={[slider_slide, slider_circle].join(" ")}
        style={{ clipPath }}
      >
        circle2
      </Circle>
    </div>
  );
};
