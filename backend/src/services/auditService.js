const { AuditLog, UserSession, SecurityEvent, User } = require('../models');
const { Op } = require('sequelize');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');

class AuditService {
  
  /**
   * Log an audit event
   * @param {Object} params - Audit log parameters
   * @param {number} params.userId - User ID (optional for anonymous actions)
   * @param {string} params.action - Action performed
   * @param {string} params.actionCategory - Category of action (auth, profile, booking, etc.)
   * @param {string} params.resourceType - Type of resource affected
   * @param {number} params.resourceId - ID of resource affected
   * @param {Object} params.oldValues - Previous values (for updates)
   * @param {Object} params.newValues - New values (for updates)
   * @param {Object} params.metadata - Additional metadata
   * @param {Object} params.request - Express request object
   * @param {string} params.status - Status (success, failed, pending)
   * @param {string} params.errorMessage - Error message if failed
   * @param {string} params.severity - Severity level (low, medium, high, critical)
   * @param {string} params.source - Source (web, mobile, admin, api, system)
   */
  static async logAction(params) {
    try {
      const {
        userId,
        action,
        actionCategory,
        resourceType = null,
        resourceId = null,
        oldValues = null,
        newValues = null,
        metadata = {},
        request = null,
        status = 'success',
        errorMessage = null,
        severity = 'low',
        source = 'web'
      } = params;

      let ipAddress = null;
      let userAgent = null;
      let deviceInfo = null;
      let sessionId = null;

      // Extract information from request object
      if (request) {
        ipAddress = this.getClientIP(request);
        userAgent = request.get('User-Agent');
        sessionId = request.session?.id || request.headers['x-session-id'];
        
        // Parse device info from user agent
        deviceInfo = this.parseDeviceInfo(userAgent);
        
        // Add location data if available
        if (ipAddress) {
          const location = geoip.lookup(ipAddress);
          if (location) {
            deviceInfo.location = {
              country: location.country,
              region: location.region,
              city: location.city,
              timezone: location.timezone,
              coordinates: [location.ll[1], location.ll[0]] // [lng, lat]
            };
          }
        }
      }

      // Create audit log entry
      const auditLog = await AuditLog.create({
        userId,
        action,
        actionCategory,
        resourceType,
        resourceId,
        oldValues,
        newValues,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          requestId: request?.id || null
        },
        ipAddress,
        userAgent,
        deviceInfo,
        sessionId,
        status,
        errorMessage,
        severity,
        source
      });

      // Log security events for high severity actions
      if (severity === 'high' || severity === 'critical') {
        await this.createSecurityEvent({
          userId,
          eventType: this.mapActionToSecurityEvent(action, status),
          severity,
          description: `${action} action with ${severity} severity`,
          details: {
            auditLogId: auditLog.id,
            action,
            actionCategory,
            status,
            errorMessage
          },
          ipAddress,
          userAgent,
          deviceInfo,
          sessionId,
          source
        });
      }

      return auditLog;
    } catch (error) {
      console.error('Audit logging failed:', error);
      // Don't throw error to prevent disrupting main application flow
      return null;
    }
  }

  /**
   * Create or update user session
   * @param {Object} params - Session parameters
   */
  static async createSession(params) {
    try {
      const {
        userId,
        sessionToken,
        deviceId = null,
        request = null,
        fcmToken = null,
        expiresAt = null
      } = params;

      let ipAddress = null;
      let userAgent = null;
      let deviceInfo = {};
      let location = null;

      if (request) {
        ipAddress = this.getClientIP(request);
        userAgent = request.get('User-Agent');
        
        // Parse device information
        const parsedUA = new UAParser(userAgent);
        const deviceData = this.parseDeviceInfo(userAgent);
        
        deviceInfo = {
          ...deviceData,
          browser: parsedUA.getBrowser(),
          engine: parsedUA.getEngine(),
          cpu: parsedUA.getCPU()
        };

        // Get location from IP
        if (ipAddress) {
          const geoData = geoip.lookup(ipAddress);
          if (geoData) {
            location = {
              country: geoData.country,
              region: geoData.region,
              city: geoData.city,
              timezone: geoData.timezone,
              coordinates: [geoData.ll[1], geoData.ll[0]]
            };
          }
        }
      }

      // Check if session already exists for this device
      const existingSession = await UserSession.findOne({
        where: {
          userId,
          deviceId,
          isActive: true
        }
      });

      if (existingSession) {
        // Update existing session
        await existingSession.update({
          sessionToken,
          lastActivityAt: new Date(),
          fcmToken,
          expiresAt,
          ipAddress,
          userAgent,
          location,
          metadata: {
            ...existingSession.metadata,
            lastUpdate: new Date().toISOString()
          }
        });
        return existingSession;
      } else {
        // Create new session
        const session = await UserSession.create({
          userId,
          sessionToken,
          deviceId,
          deviceName: deviceInfo.deviceName || 'Unknown Device',
          deviceType: deviceInfo.deviceType || 'unknown',
          platform: deviceInfo.platform || 'unknown',
          appVersion: request?.headers['x-app-version'] || null,
          osVersion: deviceInfo.osVersion || null,
          ipAddress,
          userAgent,
          location,
          fcmToken,
          expiresAt,
          isActive: true,
          metadata: {
            createdBy: 'auth_service',
            initialLogin: new Date().toISOString()
          }
        });

        return session;
      }
    } catch (error) {
      console.error('Session creation failed:', error);
      throw error;
    }
  }

  /**
   * End user session
   * @param {string} sessionToken - Session token to end
   * @param {string} reason - Logout reason
   */
  static async endSession(sessionToken, reason = 'user_logout') {
    try {
      const session = await UserSession.findOne({
        where: {
          sessionToken,
          isActive: true
        }
      });

      if (session) {
        await session.update({
          isActive: false,
          logoutAt: new Date(),
          logoutReason: reason
        });

        return session;
      }

      return null;
    } catch (error) {
      console.error('Session ending failed:', error);
      throw error;
    }
  }

  /**
   * Create security event
   * @param {Object} params - Security event parameters
   */
  static async createSecurityEvent(params) {
    try {
      const {
        userId = null,
        eventType,
        severity = 'medium',
        description,
        details = {},
        ipAddress = null,
        userAgent = null,
        deviceInfo = null,
        sessionId = null,
        source = 'web',
        riskScore = null
      } = params;

      const securityEvent = await SecurityEvent.create({
        userId,
        eventType,
        severity,
        description,
        details,
        ipAddress,
        userAgent,
        deviceInfo,
        sessionId,
        source,
        riskScore,
        resolved: false
      });

      // Auto-resolve low severity events
      if (severity === 'low') {
        await securityEvent.update({
          resolved: true,
          resolvedAt: new Date(),
          resolutionNotes: 'Auto-resolved: Low severity event'
        });
      }

      return securityEvent;
    } catch (error) {
      console.error('Security event creation failed:', error);
      throw error;
    }
  }

  /**
   * Get user's active sessions
   * @param {number} userId - User ID
   */
  static async getUserActiveSessions(userId) {
    try {
      const sessions = await UserSession.findAll({
        where: {
          userId,
          isActive: true
        },
        order: [['lastActivityAt', 'DESC']]
      });

      return sessions;
    } catch (error) {
      console.error('Failed to get user sessions:', error);
      throw error;
    }
  }

  /**
   * Get user's audit history
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   */
  static async getUserAuditHistory(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        actionCategory = null,
        severity = null,
        startDate = null,
        endDate = null
      } = options;

      const whereClause = { userId };
      
      if (actionCategory) whereClause.actionCategory = actionCategory;
      if (severity) whereClause.severity = severity;
      if (startDate) whereClause.createdAt = { ...whereClause.createdAt, [Op.gte]: startDate };
      if (endDate) whereClause.createdAt = { ...whereClause.createdAt, [Op.lte]: endDate };

      const { count, rows } = await AuditLog.findAndCountAll({
        where: whereClause,
        limit,
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']]
      });

      return {
        auditLogs: rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      console.error('Failed to get audit history:', error);
      throw error;
    }
  }

  /**
   * Parse device information from user agent
   * @param {string} userAgent - User agent string
   */
  static parseDeviceInfo(userAgent) {
    if (!userAgent) return {};

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
      deviceName: result.device.model || 'Unknown Device',
      deviceType: this.mapDeviceType(result.device.type),
      platform: this.mapPlatform(result.os.name),
      osVersion: result.os.version,
      browser: result.browser.name,
      browserVersion: result.browser.version
    };
  }

  /**
   * Get client IP address from request
   * @param {Object} request - Express request object
   */
  static getClientIP(request) {
    return request.ip || 
           request.connection?.remoteAddress || 
           request.socket?.remoteAddress ||
           (request.connection?.socket ? request.connection.socket.remoteAddress : null) ||
           request.headers['x-forwarded-for']?.split(',')[0] ||
           request.headers['x-real-ip'];
  }

  /**
   * Map device type from UA parser
   * @param {string} deviceType - Device type from UA parser
   */
  static mapDeviceType(deviceType) {
    const mapping = {
      'mobile': 'mobile',
      'tablet': 'tablet',
      'smarttv': 'desktop',
      'wearable': 'mobile',
      'embedded': 'unknown'
    };
    return mapping[deviceType] || 'desktop';
  }

  /**
   * Map platform from OS name
   * @param {string} osName - OS name from UA parser
   */
  static mapPlatform(osName) {
    if (!osName) return 'unknown';
    
    const name = osName.toLowerCase();
    if (name.includes('android')) return 'android';
    if (name.includes('ios') || name.includes('iphone') || name.includes('ipad')) return 'ios';
    if (name.includes('windows')) return 'windows';
    if (name.includes('mac')) return 'macos';
    if (name.includes('linux')) return 'linux';
    
    return 'unknown';
  }

  /**
   * Map action to security event type
   * @param {string} action - Action name
   * @param {string} status - Action status
   */
  static mapActionToSecurityEvent(action, status) {
    if (status === 'failed') {
      if (action === 'login') return 'failed_login';
      if (action === 'password_reset') return 'password_reset_request';
    }
    
    if (action === 'login' && status === 'success') return 'suspicious_login';
    if (action === 'password_change') return 'password_changed';
    if (action === 'email_change') return 'email_changed';
    
    return 'unauthorized_access';
  }

  /**
   * Update session activity
   * @param {string} sessionToken - Session token
   */
  static async updateSessionActivity(sessionToken) {
    try {
      const session = await UserSession.findOne({
        where: {
          sessionToken,
          isActive: true
        }
      });

      if (session) {
        await session.update({
          lastActivityAt: new Date()
        });
      }
    } catch (error) {
      console.error('Failed to update session activity:', error);
      // Don't throw error for activity updates
    }
  }

  /**
   * Cleanup expired sessions
   */
  static async cleanupExpiredSessions() {
    try {
      const expiredSessions = await UserSession.update(
        {
          isActive: false,
          logoutAt: new Date(),
          logoutReason: 'token_expired'
        },
        {
          where: {
            isActive: true,
            expiresAt: {
              [Op.lt]: new Date()
            }
          }
        }
      );

      console.log(`Cleaned up ${expiredSessions[0]} expired sessions`);
      return expiredSessions[0];
    } catch (error) {
      console.error('Session cleanup failed:', error);
      return 0;
    }
  }
}

module.exports = AuditService;
