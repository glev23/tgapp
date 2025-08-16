import React from "react";
import "./style.css";

export const ContentMiddleIos = ({
  title = "Title",
  secondaryTitle = "Subtitle",
  tertiaryTitle = "Description",
  showDivider = false,
  rightContent = false,
  showBadge = false,
  className,
  textLayoutClassName,
  divClassName,
  hasSecondaryTitle = true,
}) => {
  return (
    <div className={`content-middle-ios ${className}`}>
      <div className={`text-layout ${textLayoutClassName}`}>
        <div className="title-layout">
          <div className={`title ${divClassName}`}>{title}</div>
        </div>

        {hasSecondaryTitle && (
          <div className="secondary-title">{secondaryTitle}</div>
        )}
      </div>
    </div>
  );
};
