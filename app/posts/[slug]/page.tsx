import { format, parseISO } from "date-fns"
import { allPosts } from "contentlayer/generated"
import { notFound } from "next/navigation"

import PostFotter from "../components/post-fotter"

interface PostDetailProps {
  params: Promise<{ slug: string }>
}

const PostDetail: React.FC<PostDetailProps> = async (props) => {
  const { slug } = await props.params
  const post = allPosts.find((post) => post._raw.flattenedPath === slug)

  if (!post) notFound()

  return (
    <div className="mx-auto max-w-xl">
      <article className="prose px-8 py-8 dark:prose-invert sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
            {format(parseISO(post.date), "LLLL d, yyyy")}
          </time>
        </div>
        <div className="[&>*:last-child]:mb-0 [&>*]:mb-3" dangerouslySetInnerHTML={{ __html: post.body.html }} />
      </article>

      <PostFotter post={post} />
    </div>
  )
}

export default PostDetail
