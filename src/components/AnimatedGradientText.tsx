"use client";

import React from "react";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({
  children,
  className = "",
}) => {
  return <h2 className={`animated-gradient-text ${className}`}>{children}</h2>;
};
