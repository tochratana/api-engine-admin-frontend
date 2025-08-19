"use client";
import React, { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import SchemaServiceSection from "./SchemaServiceSection";
import EndPointServiceSection from "./EndPointServiceSection";
import APIDocServiceSection from "./APIDocServiceSection";

export default function OurServices() {
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
            path: "/home/cloud.json",
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
    <section className=" bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary dark:text-white sm:text-5xl mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive cloud solutions to power your applications
          </p>
        </div>
        <SchemaServiceSection />
        <EndPointServiceSection/>
        <APIDocServiceSection/>
      </div>
    </section>
  );
}
