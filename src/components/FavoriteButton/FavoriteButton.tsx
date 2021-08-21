import React from "react";

import Icon from "../ui/Icon/Icon";
import s from "./FavoriteButton.module.scss";

export interface IFavoriteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isFavorite?: boolean;
}

const FavoriteButton: React.FunctionComponent<IFavoriteButtonProps> = ({
  isFavorite,
  className,
  ...rest
}) => {
  const classes = [s.Button];
  if (className) classes.push(className);

  return (
    <button {...rest} className={classes.join(" ")}>
      <Icon iconType={"heart-fill"} className={s.Filled} />
      <Icon iconType={isFavorite ? "heart-fill" : "heart-empty"} />
    </button>
  );
};

export default FavoriteButton;
