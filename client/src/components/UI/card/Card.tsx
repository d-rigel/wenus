import React from "react";
import classes from "./Card.module.scss";

type CardProps = {
  children: React.ReactNode;
  small__card?: boolean;
};
const Card = (props: CardProps) => {
  return (
    <div className={props.small__card ? classes.s__card : classes.card}>
      {props.children}
    </div>
  );
};

export default Card;
