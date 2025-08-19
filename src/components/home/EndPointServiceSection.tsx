"use client";
import React, { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import ButtonHaveBg from "../ui/ButtonHaveBg";

export default function EndPointServiceSection() {
  const cloudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationInstance: AnimationItem | null = null;

    const loadLottie = async () => {
      try {
        // Dynamically import lottie-web to avoid SSR issues
        const lottie = (await import("lottie-web")).default;

        if (cloudRef.current) {
          animationInstance = lottie.loadAnimation({
            container: cloudRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: "/home/cloud1.json",
          });
        }
      } catch (error) {
        console.error("Error loading Lottie animation:", error);
      }
    };

    loadLottie();

    return () => {
      if (animationInstance) {
        animationInstance.destroy();
      }
    };
  }, []);

  return (
    <section className="">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <div className="order-1 md:order-2">
            <div className="max-w-lg md:max-w-none">
              <h2 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                Endpoint Generation
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Generate and manage your API endpoints effortlessly with our
                advanced Endpoint Generation Service. Streamline your development
                workflow with automated endpoint creation and management.
              </p>
              {/* <div className="mt-8">
                <ButtonHaveBg description="See More" />
              </div> */}
            </div>
          </div>
          <div className="order-2 md:order-1 flex justify-center">
            <div
              ref={cloudRef}
              className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] max-w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
