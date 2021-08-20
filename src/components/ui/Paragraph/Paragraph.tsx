import React from "react";

import s from "./Paragraph.module.scss";

export interface IParagraphProps
  extends React.HtmlHTMLAttributes<HTMLParagraphElement> {
  italic?: boolean;
  bold?: boolean;
  className?: string;
}

const Paragraph: React.FunctionComponent<IParagraphProps> = ({
  italic,
  bold,
  className,
  ...rest
}): React.ReactElement<HTMLParagraphElement> => {
  let content = rest.children ? rest.children : "";
  let classes = [s.Paragraph];

  if (italic) content = <em>{content}</em>;
  if (bold) content = <strong>{content}</strong>;
  if (className) classes.push(className);

  return (
    <p className={classes.join(" ")} {...rest}>
      {content}
    </p>
  );
};
export default Paragraph;
