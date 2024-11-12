import { useEffect, useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"

const posts = [
  {
    id: 1,
    title: "开始使用 Next.js",
    date: "2024-03-15",
    summary: "探索 Next.js 的基础知识和最佳实践...",
    lang: "zh"
  },
  {
    id: 1112,
    title: "Tailwind CSS 入门指南",
    date: "2024-02-20",
    summary: "学习如何使用 Tailwind CSS 构建现代化的用户界面...",
    lang: "zh"
  },
  {
    id: 33,
    title: "React Hooks Explained",
    date: "2024-01-10",
    summary: "A deep dive into React Hooks and their practical applications...",
    lang: "en"
  }
]

const SearchWithDialog = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPosts, setFilteredPosts] = useState(posts)

  useEffect(() => {
    const results = posts.filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredPosts(results)
  }, [searchTerm])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh] max-h-[480px] w-[90vw] max-w-[680px] p-10">
        <DialogTitle className="hidden" />
        <Input
          type="text"
          placeholder="搜索文章..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border-border/40 bg-background/60 transition-all duration-300 focus:border-primary"
        />
        {filteredPosts.map((post) => (
          <p key={post.id}>{post.title}</p>
        ))}
      </DialogContent>
    </Dialog>
  )
}

export default SearchWithDialog
