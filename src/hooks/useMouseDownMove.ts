import { useReducer } from "react";

export type MouseState = "up" | "down" | "downmove";
export type MouseEvent = "mousedown" | "mouseup" | "mousemove";

export const useMouseDownMove = () =>
  useReducer<(state: MouseState, action: MouseEvent) => MouseState>(
    (state, action) => {
      switch (action) {
        case "mouseup":
          return "up";
        case "mousedown":
          return "down";
        case "mousemove":
          return state === "up" ? "up" : "downmove";
      }
    },
    "up"
  );
