import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

interface PostCardProps {
  post: {
    id: number
    title: string
    date: string
    summary: string
    lang: string
  }
}

const PostCard: React.FC<PostCardProps> = ({ post: { date, lang, title, summary } }) => {
  const ref = useRef<HTMLAnchorElement>(null)
  const [enter, setEnter] = useState(false)

  const handleMouseEnter = () => {
    setEnter(true)
  }
  const handleMouseLeave = () => {
    setEnter(false)
  }
  const handleFocus = () => {
    setEnter(true)
  }
  const handleBlur = () => {
    setEnter(false)
  }

  useEffect(() => {
    const $ref = ref.current
    if (!$ref) return

    $ref.addEventListener("mouseenter", handleMouseEnter)
    $ref.addEventListener("mouseleave", handleMouseLeave)
    $ref.addEventListener("focus", handleFocus)
    $ref.addEventListener("blur", handleBlur)

    return () => {
      $ref.removeEventListener("mouseenter", handleMouseEnter)
      $ref.removeEventListener("mouseleave", handleMouseLeave)
      $ref.removeEventListener("focus", handleFocus)
      $ref.removeEventListener("blur", handleBlur)
    }
  }, [])

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Link ref={ref} href="#" className="relative block py-8 focus-visible:outline-0">
        <AnimatePresence>
          {enter && (
            <motion.div
              className="-z-1 absolute -inset-x-4 inset-y-4 rounded-lg bg-accent/50"
              initial={{ opacity: 0.2, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
              layoutId="post-card-hover"
            />
          )}
        </AnimatePresence>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <time>{date}</time>
          {lang === "zh" && <span className="rounded border border-border/40 px-1 text-xs">中文</span>}
        </div>
        <h2 className="text-xl font-medium transition-colors">{title}</h2>
        <p className="line-clamp-2 text-muted-foreground">{summary}</p>
      </Link>
    </motion.article>
  )
}

export default PostCard
