import { FC } from "react";
import { circle, normal, active, inactive } from "./Circle.module.css";

interface CircleProps {
  mode?: "normal" | "active" | "inactive";
}
const colorClassNameMap = {
  normal,
  active,
  inactive,
};
export const Circle: FC<CircleProps & JSX.IntrinsicElements["div"]> = ({
  ...props
}) => {
  const color = colorClassNameMap[props.mode || "normal"];
  return (
    <div {...props} className={[circle, color, props.className].join(" ")}>
      <span>{props.children}</span>
    </div>
  );
};
