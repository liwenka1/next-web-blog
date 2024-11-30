"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { FaGithub, FaXTwitter } from "react-icons/fa6"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import SearchWithCommand from "./components/search-with-command"

const Header = () => {
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark"
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }
  const toggleViewTransition = (event: React.MouseEvent<HTMLButtonElement>) => {
    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]

    const transition = document.startViewTransition(() => {
      toggleTheme()
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath
        },
        {
          duration: 300,
          easing: "ease-in",
          pseudoElement: isDark ? "::view-transition-old(root)" : "::view-transition-new(root)"
        }
      )
    })
  }
  const handleToggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const isSupport = document.startViewTransition() && !window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!isSupport) {
      toggleTheme()
      return
    }

    toggleViewTransition(event)
  }

  const router = useRouter()

  return (
    <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 cursor-pointer" onClick={() => router.push("/")}>
            <AvatarImage src="/placeholder.svg" alt="Avatar" />
            <AvatarFallback>AV</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64"
            onClick={() => setOpen(true)}
          >
            搜索博客...
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <FaGithub className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <FaXTwitter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={handleToggleTheme}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </nav>
      <SearchWithCommand open={open} setOpen={setOpen} />
    </header>
  )
}

export default Header
