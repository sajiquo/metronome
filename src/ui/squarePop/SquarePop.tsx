import type { FC } from "react";
import { squarepop, squarepop_selected } from "./SquarePop.module.css";

interface SquarePopProps {
  selected: boolean;
}

export const SquarePop: FC<SquarePopProps & JSX.IntrinsicElements["span"]> = (
  props
) => {
  return (
    <span
      className={squarepop + " " + (props.selected ? squarepop_selected : "")}
      onClick={props.onClick}
    >
      {props.children}
    </span>
  );
};
