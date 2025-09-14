const AuditService = require('../services/auditService');

/**
 * Simple audit middleware for logging actions
 */
const auditMiddleware = {
  
  logAuth: function(action, severity = 'medium') {
    return function(req, res, next) {
      const originalJson = res.json;
      
      res.json = function(data) {
        // Log action after response
        setImmediate(() => {
          try {
            AuditService.logAction({
              userId: req.user?.userId || req.body?.userId || null,
              action,
              actionCategory: 'auth',
              resourceType: 'user',
              resourceId: req.user?.userId || null,
              newValues: data.success ? {
                email: req.body?.email || req.user?.email,
                role: req.body?.role || req.user?.role,
                timestamp: new Date()
              } : null,
              metadata: {
                endpoint: req.originalUrl,
                method: req.method,
                statusCode: res.statusCode
              },
              request: req,
              status: data.success ? 'success' : 'failed',
              errorMessage: data.success ? null : (data.error || data.message),
              severity,
              source: req.headers['x-app-version'] ? 'mobile' : 'web'
            }).catch(err => {
              console.error('Audit logging failed:', err);
            });
          } catch (error) {
            console.error('Audit middleware error:', error);
          }
        });

        return originalJson.call(this, data);
      };

      next();
    };
  },

  logProfile: function(action, severity = 'low') {
    return function(req, res, next) {
      const originalJson = res.json;
      
      res.json = function(data) {
        setImmediate(() => {
          try {
            AuditService.logAction({
              userId: req.user?.userId || null,
              action,
              actionCategory: 'profile',
              resourceType: 'user',
              resourceId: req.user?.userId || req.params?.id || null,
              newValues: data.success ? req.body : null,
              metadata: {
                endpoint: req.originalUrl,
                method: req.method,
                statusCode: res.statusCode
              },
              request: req,
              status: data.success ? 'success' : 'failed',
              errorMessage: data.success ? null : (data.error || data.message),
              severity,
              source: req.headers['x-app-version'] ? 'mobile' : 'web'
            }).catch(err => {
              console.error('Audit logging failed:', err);
            });
          } catch (error) {
            console.error('Audit middleware error:', error);
          }
        });

        return originalJson.call(this, data);
      };

      next();
    };
  },

  log: function(action, actionCategory, severity = 'low') {
    return function(req, res, next) {
      const originalJson = res.json;
      
      res.json = function(data) {
        setImmediate(() => {
          try {
            AuditService.logAction({
              userId: req.user?.userId || null,
              action,
              actionCategory,
              resourceType: req.params?.resourceType || null,
              resourceId: req.params?.id || null,
              newValues: data.success ? req.body : null,
              metadata: {
                endpoint: req.originalUrl,
                method: req.method,
                statusCode: res.statusCode
              },
              request: req,
              status: data.success ? 'success' : 'failed',
              errorMessage: data.success ? null : (data.error || data.message),
              severity,
              source: req.headers['x-app-version'] ? 'mobile' : 'web'
            }).catch(err => {
              console.error('Audit logging failed:', err);
            });
          } catch (error) {
            console.error('Audit middleware error:', error);
          }
        });

        return originalJson.call(this, data);
      };

      next();
    };
  }
};

module.exports = auditMiddleware;
