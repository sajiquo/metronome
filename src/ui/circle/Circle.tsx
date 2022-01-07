import { FC } from "react";
import { circle } from "./Circle.module.css";

export const Circle: FC<JSX.IntrinsicElements["div"]> = ({ ...props }) => {
  return (
    <div className={[circle, props.className].join(" ")} {...props}>
      <span>{props.children}</span>
    </div>
  );
};
