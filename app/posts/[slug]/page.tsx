import { format, parseISO } from "date-fns"
import { allPosts } from "contentlayer/generated"
import { notFound } from "next/navigation"

import PostFotter from "../components/post-fotter"

interface PostDetail {
  params: { slug: string }
}

const PostDetail: React.FC<PostDetail> = ({ params }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug)

  if (!post) notFound()

  return (
    <div className="mx-auto max-w-xl">
      <article className="prose dark:prose-invert py-8">
        <div className="mb-8 text-center">
          <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
            {format(parseISO(post.date), "LLLL d, yyyy")}
          </time>
          <h1 className="text-3xl font-bold">{post.title}</h1>
        </div>
        <div className="[&>*:last-child]:mb-0 [&>*]:mb-3" dangerouslySetInnerHTML={{ __html: post.body.html }} />
      </article>

      <PostFotter post={post} />
    </div>
  )
}

export default PostDetail
