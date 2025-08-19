import React from "react";
import { AnimatedBeamDemo } from "../magicui/AnimatedBeamDemo";

export default function APIDesign() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-6">
            Implement REAL API
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Design-first
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Apidog implements API Design-first, facilitating the effortless
            synchronization of API specifications and modifications across the
            entire API lifecycle.
          </p>
        </div>

        {/* Visual Demo */}
        <div className="relative">
          <div className=" ">
            <AnimatedBeamDemo />
          </div>
        </div>

        {/* Additional Benefits */}
       
      </div>
    </section>
  );
}
