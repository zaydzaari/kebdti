/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  distDir: process.env.KEBDTI_BUILD_DIR || ".next",
  turbopack: { root: process.cwd() },
};
export default nextConfig;
