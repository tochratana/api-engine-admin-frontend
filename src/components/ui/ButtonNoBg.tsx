import React from "react";

interface ButtonHaveBgProps {
  description: string;
}

export default function ButtonNoBg({ description }: ButtonHaveBgProps) {
  return (
    <div>
      <button className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform ">
        {description}
      </button>
    </div>
  );
}
