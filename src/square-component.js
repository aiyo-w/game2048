import React from "react";
import "./index.css";

export function SquareComponent(props) {
  console.log(props.value);
  return (
    <span
      className={`value${props.value} ${props.value === 1 ? "newsquare" : ""}`}
    >
      {props.value}
    </span>
  );
}
