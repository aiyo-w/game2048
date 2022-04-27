import React from "react";
import "./index.css";

export interface Props {
  value: number;
  newSquare: boolean;
}

/**
 * 小方块组件
 * @param props 
 * @returns 
 */
export function SquareComponent(props: Props) {
  return (
    <span className={`value${props.value} ${props.newSquare ? "newsquare" : ""}`}>
      {props.value}
    </span>
  );
}
