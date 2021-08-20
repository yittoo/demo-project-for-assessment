import React from "react";

import s from "./Title.module.scss";

export type elementTypes = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type spacingTypes = "sm" | "md" | "lg";

interface ITitleProps extends React.HtmlHTMLAttributes<HTMLHeadingElement> {
  element?: elementTypes;
  spacing?: spacingTypes;
  className?: string;
  italic?: boolean;
  bold?: boolean;
}

const Title: React.FunctionComponent<ITitleProps> = ({
  children,
  element,
  italic,
  bold,
  className,
  spacing,
  ...rest
}): React.ReactElement<HTMLHeadingElement> => {
  let content = children;
  let classes = [s.Title];

  if (italic) content = <em>{content}</em>;
  if (bold) content = <strong>{content}</strong>;

  if (className) classes.push(className);
  if (spacing) {
    if (spacing === "sm") {
      classes.push(s.TitleSpacingSmall);
    }
    if (spacing === "md") {
      classes.push(s.TitleSpacingMedium);
    }
    if (spacing === "lg") {
      classes.push(s.TitleSpacingLarge);
    }
  }

  // default h2
  let TitleElement = (
    <h2 className={classes.join(" ")} {...rest}>
      {content}
    </h2>
  );
  if (element) {
    if (element === "h1")
      TitleElement = (
        <h1 className={classes.join(" ")} {...rest}>
          {content}
        </h1>
      );
    else if (element === "h3")
      TitleElement = (
        <h3 className={classes.join(" ")} {...rest}>
          {content}
        </h3>
      );
    else if (element === "h4")
      TitleElement = (
        <h4 className={classes.join(" ")} {...rest}>
          {content}
        </h4>
      );
    else if (element === "h5")
      TitleElement = (
        <h5 className={classes.join(" ")} {...rest}>
          {content}
        </h5>
      );
    else if (element === "h6")
      TitleElement = (
        <h6 className={classes.join(" ")} {...rest}>
          {content}
        </h6>
      );
  }

  return TitleElement;
};

export default Title;
