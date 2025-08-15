import React from "react";
import ButtonHaveBg from "../ui/ButtonHaveBg";
import ButtonNoBg from "../ui/ButtonNoBg";
import { WordRotateDemo } from "../ui/TextReves";
import { OrbitingCirclesDemo } from "../magicui/OrbitingCirclesDemo";

export default function HeroSection() {
  return (
    <section className="relative bg-gray-900 min-h-screen overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-90" />

      {/* Dotted Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] bg-[length:50px_50px]" />
      {/* Content */}
      <div className="relative z-10 px-[120px] max-w-6xl py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Text Block */}
          <div className="">
            <div className="inline-flex items-baseline text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-white">
              <span>
                Say Good Bye To <WordRotateDemo />{" "}
              </span>
            </div>

            {/* Description */}
            <div className="mt-8 max-w-2xl">
              <p className="text-xl text-gray-300 font-medium mb-4">
                Endura is the Backend-as-a-Service development platform.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Start your project with a modern database, Authentication,
                instant APIs, Edge Functions, Realtime subscriptions, Storage,
                and Vector embeddings.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <ButtonHaveBg description="Start your project" />
              <ButtonNoBg description="Request a demo" />
            </div>
          </div>

          {/* Right Animation Block */}
          <div className="flex justify-center lg:justify-end">
            <OrbitingCirclesDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
