/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables configuration - LocallyTrip Guidelines
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_IMAGES: process.env.NEXT_PUBLIC_IMAGES || 'http://localhost:3001/images',
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000',
  },
  
  // Ensure environment variables are included in the build
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_IMAGES: process.env.NEXT_PUBLIC_IMAGES || 'http://localhost:3001/images',
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000',
  },
  
  // Force all pages to be dynamic - NO STATIC GENERATION EVER
  experimental: {
    serverComponentsExternalPackages: [],
  },
  
  // Suppress hydration warnings untuk development
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // Suppress hydration warnings dari browser extensions - development only  
  reactStrictMode: false,

  // Custom error configuration untuk suppress extension warnings
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Konfigurasi file watching untuk mengurangi rebuild berlebihan
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay rebuild after change detected
        ignored: ['**/node_modules', '**/.git'],
      };
    }
    return config;
  },
  
  // Image optimization sesuai LocallyTrip ImageService pattern
  images: {
    domains: ['localhost', 'api-locallytrip.ondigitalocean.app', 'locallytrip.com'],
    unoptimized: true
  },
  
  // Remove standalone output untuk development
  // output: 'standalone',
  trailingSlash: true,
  
  // API configuration
  async rewrites() {
    return {
      beforeFiles: [
        // Internal API rewrite for server-side requests
        {
          source: '/internal-api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/:path*`
        }
      ]
    }
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

  // Suppress hydration warnings from browser extensions
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
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
