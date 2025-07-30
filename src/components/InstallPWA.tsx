"use client";

import React, { useState, useEffect } from "react";

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      });

      window.addEventListener("appinstalled", () => {
        setIsInstallable(false);
        setDeferredPrompt(null);
      });
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("beforeinstallprompt", () => {});
        window.removeEventListener("appinstalled", () => {});
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
    } catch (err) {
      console.error("Error while installing:", err);
    }
  };

  if (!isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={handleInstallClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        Install App
      </button>
    </div>
  );
};
