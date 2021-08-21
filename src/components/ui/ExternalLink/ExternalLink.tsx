import React from "react";

import s from "./ExternalLink.module.scss";

export interface IExternalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const ExternalLink: React.FC<IExternalLinkProps> = ({
  className,
  ...rest
}): React.ReactElement<HTMLAnchorElement> => {
  const classes = [s.ExternalLink];
  if (className) classes.push(className);

  return (
    // eslint is throwing anchors must have content and screenreader which is covered in each usage of this
    // eslint-disable-next-line
    <a
      {...rest}
      rel="noopener noreferrer"
      target="_blank"
      className={classes.join(" ")}
    />
  );
};

export default ExternalLink;
