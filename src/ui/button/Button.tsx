import { FC } from "react";
import { Circle } from "~/ui/circle/Circle";
import { button, normal, active, inactive } from "./Button.module.css";

interface ButtonProps {
  mode: "normal" | "active" | "inactive";
  onClick: () => void;
}
const colorClassNameMap = {
  normal,
  active,
  inactive,
};
export const Button: FC<ButtonProps> = ({ ...props }) => {
  const color = colorClassNameMap[props.mode];
  return (
    <Circle className={[button, color].join(" ")} onClick={props.onClick}>
      <span>{props.children}</span>
    </Circle>
  );
};
