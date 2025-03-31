import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth"
import { PropertyStatusProvider } from "@/hooks/use-property-status"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Luxe Estates | Luxury Property Rentals",
  description: "Experience unparalleled elegance in exclusive luxury properties",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <PropertyStatusProvider>
            <ThemeProvider attribute="class" defaultTheme="light">
              {children}
              <Toaster />
            </ThemeProvider>
          </PropertyStatusProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'