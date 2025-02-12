import type { Metadata } from "next"
import localFont from "next/font/local"
import { ThemeProvider } from "next-themes"

import "@/styles/globals.css"
import "@/styles/prism-dracula.css"
import "@/styles/prism-plus.css"
import Header from "@/components/header"
import { siteConfig } from "@/config/site"

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
})
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
})

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />

          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
