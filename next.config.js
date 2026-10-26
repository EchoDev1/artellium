/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  images: {
    domains: [],
  },
  // Ensure static assets are cached while pages revalidate immediately
  async redirects() {
    return [
      {
        source: '/admin/we%20are%20built',
        destination: '/about#vision',
        permanent: false,
      },
      {
        source: '/admin/we are built',
        destination: '/about#vision',
        permanent: false,
      },
      {
        source: '/we%20are%20built',
        destination: '/about#vision',
        permanent: false,
      },
      {
        source: '/we are built',
        destination: '/about#vision',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
