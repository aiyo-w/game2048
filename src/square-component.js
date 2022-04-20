import React from "react";
import "./index.css";

export function SquareComponent(props) {
  return (
    /* <span
      className={`value${props.value} ${props.value === 1 ? "newsquare" : ""}`}
    >
      {props.value}
    </span> */
    <span
      className={`value${props.value} ${props.newSquare ? "newsquare" : ""}`}
    >
      {props.value}
    </span>
  );
}
