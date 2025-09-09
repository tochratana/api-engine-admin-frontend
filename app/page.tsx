"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"
import LoginForm from "@/components/login-form"

export default function HomePage() {
  const { token } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (token) {
      router.push("/dashboard")
    }
  }, [token, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Sign in to manage your projects</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
