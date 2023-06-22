import React from "react";

import classes from "./Button.module.scss";

interface Props {
  type?: "button" | "submit";
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  outline?: boolean;
  no__outlined?: boolean;
  children: React.ReactNode;
}
const Button: React.FC<Props> = (props) => {
  return (
    <button
      className={`${classes.btn} ${
        props.outline
          ? classes.outline
          : classes.button && props.no__outlined
          ? classes.no__outlined
          : classes.button
      } `}
      type={props.type || "button"}
      onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;
