"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const start = async (provider: string) => {
    try {
      setLoading(provider);
      await signIn(provider, { callbackUrl: "/" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-center">Sign in</h1>
        <Button
          className="w-full"
          variant="default"
          onClick={() => start("google")}
          disabled={loading !== null}
        >
          {loading === "google" ? "Redirecting…" : "Continue with Google"}
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => start("github")}
          disabled={loading !== null}
        >
          {loading === "github" ? "Redirecting…" : "Continue with GitHub"}
        </Button>
      </div>
    </div>
  );
}
