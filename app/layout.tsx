import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Modern Admin Dashboard for Project Management",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
            <Providers>{children}</Providers>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
