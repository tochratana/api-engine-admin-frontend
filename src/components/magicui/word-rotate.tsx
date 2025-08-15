"use client";

import { AnimatePresence, motion, MotionProps } from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  motionProps?: MotionProps;
  className?: string;
}

export function WordRotate({
  words,
  duration = 2000,
  motionProps = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words || words.length <= 1) {
      console.log("WordRotate: Not enough words to rotate", words);
      return;
    }

    console.log("WordRotate: Setting up interval with words:", words);
    console.log("WordRotate: Duration:", duration);

    const intervalId = setInterval(() => {
      console.log("WordRotate: Interval triggered");
      setIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % words.length;
        console.log(
          `WordRotate: Changing from index ${prevIndex} (${words[prevIndex]}) to index ${newIndex} (${words[newIndex]})`
        );
        return newIndex;
      });
    }, duration);

    return () => {
      console.log("WordRotate: Clearing interval");
      clearInterval(intervalId);
    };
  }, [words, duration]);

  if (!words || words.length === 0) {
    return <div>No words provided</div>;
  }

  const currentWord = words[index] || words[0];
  console.log("WordRotate: Rendering word:", currentWord, "at index:", index);

  return (
    <div className="overflow-hidden py-2 min-h-[60px] flex items-center justify-center w-full text-start">
      <AnimatePresence mode="wait">
         Say Goodbye To 
        <motion.div
          key={`${currentWord}-${index}`}
          className={cn("text-center w-full", className)}
          {...motionProps}
        >
          {currentWord}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
