import React from "react";

interface ButtonHaveBgProps {
  description: string;
}

export default function ButtonHaveBg({ description }: ButtonHaveBgProps) {
  return (
    <div>
      <button className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-md transition-all duration-200 transform ">
        {description}
      </button>
    </div>
  );
}
