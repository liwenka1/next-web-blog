"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Search, Sun, Moon, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 模拟博客文章数据
const posts = [
  { id: 1, title: "开始使用 Next.js", content: "Next.js 是一个流行的 React 框架...", tags: ["Next.js", "React"] },
  {
    id: 2,
    title: "Tailwind CSS 入门",
    content: "Tailwind CSS 是一个实用为先的 CSS 框架...",
    tags: ["CSS", "Tailwind"]
  },
  { id: 3, title: "React Hooks 详解", content: "React Hooks 让函数组件更加强大...", tags: ["React", "Hooks"] },
  {
    id: 4,
    title: "TypeScript 最佳实践",
    content: "TypeScript 添加了静态类型检查...",
    tags: ["TypeScript", "JavaScript"]
  }
]

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [filteredPosts, setFilteredPosts] = useState(posts)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedTag === "" || post.tags.includes(selectedTag))
    )
    setFilteredPosts(results)
  }, [searchTerm, selectedTag])

  const allTags = ["", ...new Set(posts.flatMap((post) => post.tags))]

  return (
    <div className="min-h-screen bg-background p-8 text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">我的博客</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="transition-transform hover:rotate-12"
          >
            {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
        </header>

        <div className="mb-8 flex gap-4">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="搜索文章..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:border-primary-focus w-full rounded-full border-2 border-primary py-2 pl-10 pr-4 transition-all duration-300 focus:ring focus:ring-primary/20"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-primary" />
          </div>
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="focus:border-primary-focus w-[180px] rounded-full border-2 border-primary transition-all duration-300 focus:ring focus:ring-primary/20">
              <SelectValue placeholder="选择标签" />
            </SelectTrigger>
            <SelectContent>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag || "所有标签"}>
                  {tag || "所有标签"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AnimatePresence>
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8 rounded-lg border border-border bg-card p-6 shadow-lg"
            >
              <h2 className="mb-4 text-2xl font-semibold text-card-foreground">{post.title}</h2>
              <p className="mb-4 text-card-foreground/80">{post.content}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    <Tag className="mr-1 h-4 w-4" />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
