import Link from "next/link"
import type { Post } from "contentlayer/generated"

interface FotterProps {
  post: Post
}

const PostFotter = ({ post }: FotterProps) => {
  return (
    <footer className="pb-10">
      <hr className="mt-10" />
      <p className="mt-10">
        <Link className="text-link underline underline-offset-8" href="https://x.com/liwenka1" target="_blank">
          Discuss on 𝕏
        </Link>
        <span className="mx-2">·</span>
        <Link
          className="text-link underline underline-offset-8"
          href={`https://github.com/liwenka1/next-web-blog/blob/main${post.url}.md`}
          target="_blank"
        >
          Edit on GitHub
        </Link>
      </p>
    </footer>
  )
}

export default PostFotter
