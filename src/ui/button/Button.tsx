import { FC } from "react";
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
    <div className={[button, color].join(" ")} onClick={props.onClick}>
      <span>{120}</span>
    </div>
  );
};
