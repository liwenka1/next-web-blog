"use client"

import Header from "./components/header"
import Fotter from "./components/footer"
import PostList from "./components/post-list"

const Site = () => {
  return (
    <div className="h-full w-full bg-background text-foreground transition-colors duration-500 ease-in-out">
      <Header />

      <PostList />

      <Fotter />
    </div>
  )
}

export default Site
