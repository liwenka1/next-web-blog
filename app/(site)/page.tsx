"use client"

import PostList from "./components/post-list"
import Fotter from "./components/footer"

const Site = () => {
  return (
    <div className="w-full">
      <PostList />

      <Fotter />
    </div>
  )
}

export default Site
