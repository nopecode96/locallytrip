const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { sequelize } = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const placeholderMiddleware = require('./middleware/placeholderMiddleware');
const emailService = require('./services/emailService');
const mailersendService = require('./services/mailersendService');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

console.log(`🚀 Starting LocallyTrip Backend...`);
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);

// Security middleware - production-ready with SSL support
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"]
    }
  } : false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  } : false,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));

// CORS for API routes - support both development and production domains
const allowedOrigins = process.env.NODE_ENV === 'production' ? [
  'https://locallytrip.com',
  'https://app.locallytrip.com', 
  'https://admin.locallytrip.com',
  'https://api-locallytrip.ondigitalocean.app',
  'https://web-locallytrip.ondigitalocean.app',
  'https://admin-locallytrip.ondigitalocean.app',
  // Internal DigitalOcean communication
  'http://web:8080',
  'http://admin:8080'
] : [
  'http://localhost:3000', 
  'http://localhost:3002'
];

app.use('/', cors({
  origin: process.env.CORS_ORIGIN?.split(',') || allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Cache-Control',
    'X-Device-ID',
    'X-Platform',
    'X-Device-Type',
    'X-App-Version',
    'X-User-Agent',
    'X-Screen-Resolution',
    'X-Timezone'
  ]
}));

// Force HTTPS redirect in production (behind reverse proxy)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      // Use environment variable for production domain instead of req.header('host')
      const productionHost = process.env.API_DOMAIN || process.env.DOMAIN || 'api.locallytrip.com';
      return res.redirect(`https://${productionHost}${req.url}`);
    }
    next();
  });
}

// Very permissive CORS for static files
app.use('/images', cors({
  origin: '*',
  methods: ['GET', 'HEAD', 'OPTIONS'],
  credentials: false,
  allowedHeaders: ['*']
}));

// General middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files first (existing files take precedence)
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Placeholder middleware as fallback for missing images
app.use('/images', placeholderMiddleware);

// Health check endpoint for DigitalOcean - more robust
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await sequelize.authenticate();
    
    // Test email service connection
    const emailHealth = await emailService.healthCheck();
    const apiHealth = await mailersendService.healthCheck();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      port: PORT,
      database: 'connected',
      email: emailHealth,
      emailApi: apiHealth,
      version: process.env.API_VERSION || 'v1'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    // Still try to get email service status
    let emailStatus = { status: 'unknown' };
    try {
      emailStatus = await emailService.healthCheck();
    } catch (emailError) {
      emailStatus = { status: 'error', error: emailError.message };
    }
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: PORT,
      database: 'disconnected',
      email: emailStatus,
      error: error.message
    });
  }
});

// Simple health check without DB dependency
app.get('/ping', (req, res) => {
  res.status(200).json({
    status: 'pong',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Email service health check endpoint
app.get('/health/email', async (req, res) => {
  try {
    const emailHealth = await emailService.healthCheck();
    res.status(emailHealth.status === 'healthy' ? 200 : 503).json(emailHealth);
  } catch (error) {
    res.status(503).json({
      service: 'email',
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// MailerSend API health check endpoint
app.get('/health/email-api', async (req, res) => {
  try {
    const apiHealth = await mailersendService.healthCheck();
    res.status(apiHealth.status === 'healthy' ? 200 : 503).json(apiHealth);
  } catch (error) {
    res.status(503).json({
      service: 'email-api',
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API routes - direct without prefix
app.use('/', routes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use(errorHandler);

// Database connection and server start with improved error handling
async function startServer() {
  try {
    console.log(`🚀 Starting LocallyTrip Backend API...`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Target Host: ${HOST}`);
    console.log(`🔗 Target Port: ${PORT}`);
    
    // Initialize email service
    await emailService.verifyConnection();
    
    // Start server first, then connect to database
    const server = app.listen(PORT, HOST, () => {
      console.log(`✅ LocallyTrip Backend API running on ${HOST}:${PORT}`);
      console.log(`🔗 Health check: http://${HOST}:${PORT}/health`);
    });

    // Set server timeout
    server.timeout = 120000; // 2 minutes
    
    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ ❌ ❌ SERVER ERROR ❌ ❌ ❌');
      console.error('❌ Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.error(`❌ Trying to bind to: ${HOST}:${PORT}`);
      } else if (error.code === 'EACCES') {
        console.error(`❌ Permission denied for port ${PORT}`);
      } else {
        console.error(`❌ Unknown server error:`, error.code, error.message);
      }
      process.exit(1);
    });

    // Test database connection (non-blocking)
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully');
    } catch (dbError) {
      console.error('⚠️ Database connection failed, but server started:', dbError.message);
      console.log('� Server will continue running, database operations may fail');
    }
    
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

startServer();
