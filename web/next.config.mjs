/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'cdn.sanity.io',
            port: '', // Keep empty for default port (443 for https)
            pathname: '/**', // Allow any path under this hostname
          },
          // You can add other trusted hostnames here if needed in the future
          // {
          //   protocol: 'https',
          //   hostname: 'another-trusted-domain.com',
          // },
        ],
    },
};

export default nextConfig;
