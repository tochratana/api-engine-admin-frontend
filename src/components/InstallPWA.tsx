"use client";

import { useState, useEffect } from "react";

// Log function for debugging
const log = (message: string, data?: Record<string, unknown>) => {
  console.log(`[PWA Debug] ${message}`, data || "");
};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}

export const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);
  useEffect(() => {
    console.log("PWA Component Mounted");

    // Check if running in a PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("App is running in standalone mode (already installed)");
      setIsInstalled(true);
      return;
    }

    // Check if the browser supports service workers and register it
    if ("serviceWorker" in navigator) {
      console.log("Service Workers are supported");
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    } else {
      console.log("Service Workers are NOT supported");
    }

    const handler = (e: Event) => {
      e.preventDefault();
      console.log("beforeinstallprompt event triggered");
      setPromptInstall(e as BeforeInstallPromptEvent);
      setSupportsPWA(true);
    };

    console.log("Adding beforeinstallprompt event listener");
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onClick = async () => {
    if (!promptInstall) {
      return;
    }
    // Show the install prompt
    promptInstall.prompt();
    // Wait for the user to respond to the prompt
    await promptInstall.userChoice;
    // Reset the prompt variable
    setPromptInstall(null);
  };

  // For debugging - always show something
  if (isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 p-2 rounded-lg">
        App is installed
      </div>
    );
  }

  // TODO PWA not support
  if (!supportsPWA) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 p-2 rounded-lg">
        {/* PWA not supported yet - waiting for browser criteria */}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
      <button
        className="bg-black text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
        onClick={onClick}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>Install App</span>
      </button>
      {/* <div className="text-sm text-gray-600 bg-white p-2 rounded-lg shadow">
        💡 Install our app for a better experience!
      </div> */}
    </div>
  );
};
