import React from "react";

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const Loading = ({
  size = "md",
  className = "",
  color = "border-primary-600",
  thickness = "border-2",
}) => {
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex justify-center items-center"
    >
      <div
        className={`
          ${sizeClass}
          ${thickness}
          ${color}
          border-solid
          border-t-transparent
          rounded-full
          animate-spin
          ${className}
        `}
      />
    </div>
  );
};

export default Loading;
