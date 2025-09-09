"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setUserFromStorage } from "@/lib/features/auth/authSlice"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { token, user } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] AuthGuard: Checking authentication state")
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    console.log("[v0] AuthGuard: Redux token:", !!token)
    console.log("[v0] AuthGuard: Stored token:", !!storedToken)

    if (!token && !storedToken) {
      console.log("[v0] AuthGuard: No token found, redirecting to login")
      router.push("/")
    } else {
      if (storedToken && storedUser && !user) {
        try {
          const parsedUser = JSON.parse(storedUser)
          dispatch(setUserFromStorage({ token: storedToken, user: parsedUser }))
          console.log("[v0] AuthGuard: Loaded user from localStorage:", parsedUser)
        } catch (error) {
          console.log("[v0] AuthGuard: Error parsing stored user:", error)
        }
      }
      console.log("[v0] AuthGuard: Token found, allowing access")
      setIsLoading(false)
    }
  }, [token, user, router, dispatch])

  if (isLoading && !token && !localStorage.getItem("token")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
