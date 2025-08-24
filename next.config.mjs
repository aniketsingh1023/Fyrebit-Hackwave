/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Ignore .map files inside chrome-aws-lambda
    config.module.rules.push({
      test: /\.map$/,
      use: 'ignore-loader',
    })

    return config
  },
}

export default nextConfig
