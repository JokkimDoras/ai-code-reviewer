/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true, // Tells browsers and search engines to cache this routing path
      },
    ];
  },
};

export default nextConfig;