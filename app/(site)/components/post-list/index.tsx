import { compareDesc } from "date-fns"
import { allPosts } from "contentlayer/generated"

import PostCard from "./components/post-card"

const PostList = () => {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <main className="relative mx-auto max-w-4xl px-6 pb-16 pt-24">
      {posts.map((post, idx) => (
        <PostCard key={idx} post={post} />
      ))}
    </main>
  )
}

export default PostList
