import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import PostCard from "./post-card"

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

const PostList = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPosts, setFilteredPosts] = useState(posts)

  useEffect(() => {
    const results = posts.filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredPosts(results)
  }, [searchTerm])

  return (
    <main className="pb-16 pt-24">
      <div className="mx-auto max-w-4xl px-6">
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

        <div className="relative">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  )
}

export default PostList
