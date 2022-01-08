import { FC, useState } from "react";
import { SquarePop } from "../squarePop/SquarePop";
import { squarelist } from "./Squarelist.module.css";

export interface SquareList {
  list: readonly (number | string)[];
  onChange: (value: number | string) => void;
  initIdx?: number;
}

export const SquareList: FC<SquareList> = ({ list, initIdx, onChange }) => {
  const [currentId, setId] = useState(initIdx);
  return (
    <div className={squarelist}>
      {list.map((value, idx) => (
        <SquarePop
          key={idx}
          selected={idx === currentId}
          onClick={() => {
            onChange(list[idx]);
            setId(idx);
          }}
        >
          {value}
        </SquarePop>
      ))}
    </div>
  );
};
