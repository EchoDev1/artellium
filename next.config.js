/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  images: {
    domains: [],
  },
  assetPrefix: '',
  future: { webpack5: true },
  experimental: {
    gzipCompression: true,
    brotliCompression: true,
    optimizeCss: true,
  },
  // Cache static assets for a year
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
