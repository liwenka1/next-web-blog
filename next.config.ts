import type { NextConfig } from "next"
import { withContentlayer } from "next-contentlayer"

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true
  // swcMinify: true
}

export default withContentlayer(nextConfig)
