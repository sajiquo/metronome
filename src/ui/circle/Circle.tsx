import { FC } from "react";
import { circle } from "./Circle.module.css";

export const Circle: FC<JSX.IntrinsicElements["div"]> = ({ ...props }) => {
  return (
    <div {...props} className={[circle, props.className].join(" ")}>
      <span>{props.children}</span>
    </div>
  );
};
