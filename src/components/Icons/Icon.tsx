import React from 'react';

interface IconProps {
  className?: string;
  fillColor?: string;
  paths: string[];  // Now an array of strings
  viewBox?: string;
}

const Icon: React.FC<IconProps> = ({ className, fillColor = 'currentColor', paths, viewBox = "0 0 512 512" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fillColor}
    className={className}
    viewBox={viewBox}
  >
    {paths.map((path, index) => (
      <path key={index} d={path} />
    ))}
  </svg>
);

export default Icon;