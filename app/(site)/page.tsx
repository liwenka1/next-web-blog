"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Sun, Moon, Search, Github, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

const posts = [
  {
    id: 1,
    title: "开始使用 Next.js",
    date: "2024-03-15",
    summary: "探索 Next.js 的基础知识和最佳实践...",
    lang: "zh"
  },
  {
    id: 2,
    title: "Tailwind CSS 入门指南",
    date: "2024-02-20",
    summary: "学习如何使用 Tailwind CSS 构建现代化的用户界面...",
    lang: "zh"
  },
  {
    id: 3,
    title: "React Hooks Explained",
    date: "2024-01-10",
    summary: "A deep dive into React Hooks and their practical applications...",
    lang: "en"
  }
]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPosts, setFilteredPosts] = useState(posts)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const results = posts.filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredPosts(results)
  }, [searchTerm])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 ease-in-out">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>AV</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="#" className="transition-colors hover:text-primary">
              首页
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              归档
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              项目
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              关于
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              友链
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Github className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Twitter className="h-4 w-4" />
            </Button>
          </div>
        </nav>
      </header>

      <main className="pb-16 pt-24">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold">Hi there, I Blogger 👋</h1>
            <p className="text-lg text-muted-foreground">A personal blog about web development and technology.</p>
          </motion.div>

          <div className="mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="搜索文章..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-border/40 bg-background/60 py-2 pl-10 pr-4 transition-all duration-300 focus:border-primary"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            </div>
          </div>

          <div className="relative" ref={containerRef}>
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative mb-8 last:mb-0"
                >
                  <Link href="#" className="block space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <time>{post.date}</time>
                      {post.lang === "zh" && <span className="rounded border border-border/40 px-1 text-xs">中文</span>}
                    </div>
                    <h2 className="text-xl font-medium transition-colors">{post.title}</h2>
                    <p className="line-clamp-2 text-muted-foreground">{post.summary}</p>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-lg bg-muted/40"
              initial={false}
              animate={{
                opacity: hoveredIndex !== null ? 1 : 0,
                y: hoveredIndex !== null ? hoveredIndex * 120 : mousePosition.y - 60,
                height: 120
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40">
        <div className="mx-auto max-w-4xl px-6 py-8 text-center text-sm text-muted-foreground">
          <p>当第一缕阳光飞向远方，那时候的自己一定会想起一些远去的事。</p>
        </div>
      </footer>
    </div>
  )
}
