import React from "react";

export type IconTypes = "heart-empty" | "heart-fill";
export interface IIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  iconType: IconTypes;
}

// Alternatively this could be done as pure SVG instead of rendering
// SVG in img but might need a tricky hack like this to avoid copy pasting
// same lines over again for each icon which loads all icons whether they
// are used or not
const Icon: React.FunctionComponent<IIconProps> = ({
  iconType,
  alt,
  ...rest
}) => {
  let iconUrl = null;

  try {
    iconUrl = require(`../../../assets/icons/${iconType}.svg`).default;
  } catch (err) {
    if (process.env.NODE_ENV === "development")
      console.error("Can not find `iconType`:", iconType);
    return null;
  }

  return <img {...rest} alt={alt} src={iconUrl} />;
};

export default Icon;
