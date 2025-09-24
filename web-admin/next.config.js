/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force static assets to be served from the same domain (production fix)
  ...(process.env.NODE_ENV === 'production' && {
    assetPrefix: process.env.ADMIN_URL || 'https://admin.locallytrip.com',
  }),

  // Force all pages to be dynamic - NO STATIC GENERATION EVER
  experimental: {
    serverComponentsExternalPackages: []
  },
  
  // Image optimization
  images: {
    domains: ['localhost', 'api-locallytrip.ondigitalocean.app', 'locallytrip.com'],
    unoptimized: true
  },
  
  // Production output configuration
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
  }),
  
  // API configuration
  async rewrites() {
    return {
      beforeFiles: [
        // Internal API rewrite for server-side requests
        {
          source: '/internal-api/:path*',
          destination: process.env.INTERNAL_API_URL ? 
            `${process.env.INTERNAL_API_URL}/:path*` : 
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'}/:path*`
        }
      ]
    }
  },
  
  // Output configuration for production - DISABLED FOR DEVELOPMENT
  // output: 'standalone',
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Optimize builds for faster deployment
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  
  // Enhanced debugging and error reporting
  productionBrowserSourceMaps: true,
  
  // Keep React properties for better debugging
  compiler: {
    reactRemoveProperties: false,
  },
  
  // Enable detailed error reporting in development
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { dev, isServer }) => {
      // Enhanced source maps for better debugging
      if (dev && !isServer) {
        config.devtool = 'eval-source-map';
      }
      return config;
    },
  }),
}

module.exports = nextConfig
