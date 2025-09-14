const AuditService = require('../services/auditService');
const { AuditLog, UserSession, SecurityEvent, User } = require('../models');
const { Op } = require('sequelize');

const auditController = {
  
  /**
   * Get user's audit history
   */
  getUserAuditHistory: async (req, res) => {
    try {
      const userId = req.user.userId;
      const {
        page = 1,
        limit = 50,
        actionCategory,
        severity,
        startDate,
        endDate,
        action
      } = req.query;

      // Build where clause
      const whereClause = { userId };
      
      if (actionCategory) whereClause.actionCategory = actionCategory;
      if (severity) whereClause.severity = severity;
      if (action) whereClause.action = action;
      
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
        if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
      }

      const { count, rows } = await AuditLog.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['createdAt', 'DESC']],
        attributes: [
          'id', 'uuid', 'action', 'actionCategory', 'resourceType', 
          'resourceId', 'metadata', 'ipAddress', 'status', 'severity', 
          'source', 'createdAt'
        ]
      });

      res.json({
        success: true,
        data: {
          auditLogs: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Get audit history error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get audit history'
      });
    }
  },

  /**
   * Get user's active sessions
   */
  getUserSessions: async (req, res) => {
    try {
      const userId = req.user.userId;

      const sessions = await UserSession.findAll({
        where: {
          userId,
          isActive: true
        },
        order: [['lastActivityAt', 'DESC']],
        attributes: [
          'id', 'uuid', 'deviceId', 'deviceName', 'deviceType', 
          'platform', 'appVersion', 'ipAddress', 'location', 
          'loginAt', 'lastActivityAt', 'isActive'
        ]
      });

      res.json({
        success: true,
        data: { sessions }
      });
    } catch (error) {
      console.error('Get sessions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user sessions'
      });
    }
  },

  /**
   * Terminate a specific session
   */
  terminateSession: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { sessionId } = req.params;

      const session = await UserSession.findOne({
        where: {
          uuid: sessionId,
          userId,
          isActive: true
        }
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      // End the session
      await session.update({
        isActive: false,
        logoutAt: new Date(),
        logoutReason: 'user_terminated'
      });

      // Log the session termination
      await AuditService.logAction({
        userId,
        action: 'session_terminated',
        actionCategory: 'auth',
        resourceType: 'session',
        resourceId: session.id,
        metadata: {
          terminatedSessionId: session.uuid,
          deviceName: session.deviceName,
          terminationReason: 'user_request'
        },
        request: req,
        status: 'success',
        severity: 'medium',
        source: req.headers['x-app-version'] ? 'mobile' : 'web'
      });

      res.json({
        success: true,
        message: 'Session terminated successfully'
      });
    } catch (error) {
      console.error('Terminate session error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to terminate session'
      });
    }
  },

  /**
   * Get user's security events
   */
  getUserSecurityEvents: async (req, res) => {
    try {
      const userId = req.user.userId;
      const {
        page = 1,
        limit = 20,
        severity,
        resolved,
        eventType
      } = req.query;

      // Build where clause
      const whereClause = { userId };
      
      if (severity) whereClause.severity = severity;
      if (resolved !== undefined) whereClause.resolved = resolved === 'true';
      if (eventType) whereClause.eventType = eventType;

      const { count, rows } = await SecurityEvent.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['createdAt', 'DESC']],
        attributes: [
          'id', 'uuid', 'eventType', 'severity', 'description', 
          'ipAddress', 'resolved', 'riskScore', 'createdAt'
        ]
      });

      res.json({
        success: true,
        data: {
          securityEvents: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Get security events error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get security events'
      });
    }
  },

  /**
   * Get activity summary for dashboard
   */
  getActivitySummary: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { days = 30 } = req.query;
      
      const since = new Date();
      since.setDate(since.getDate() - parseInt(days));

      // Get activity summary
      const [
        totalLogins,
        totalActions,
        activeSessions,
        securityEvents,
        recentActivity
      ] = await Promise.all([
        // Total logins in period
        AuditLog.count({
          where: {
            userId,
            action: 'login',
            status: 'success',
            createdAt: { [Op.gte]: since }
          }
        }),
        
        // Total actions in period
        AuditLog.count({
          where: {
            userId,
            createdAt: { [Op.gte]: since }
          }
        }),
        
        // Active sessions count
        UserSession.count({
          where: {
            userId,
            isActive: true
          }
        }),
        
        // Unresolved security events
        SecurityEvent.count({
          where: {
            userId,
            resolved: false
          }
        }),
        
        // Recent activity (last 10 actions)
        AuditLog.findAll({
          where: { userId },
          limit: 10,
          order: [['createdAt', 'DESC']],
          attributes: [
            'action', 'actionCategory', 'status', 'severity', 
            'source', 'createdAt'
          ]
        })
      ]);

      // Get activity by category
      const activityByCategory = await AuditLog.findAll({
        where: {
          userId,
          createdAt: { [Op.gte]: since }
        },
        attributes: [
          'actionCategory',
          [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
        ],
        group: ['actionCategory'],
        raw: true
      });

      res.json({
        success: true,
        data: {
          summary: {
            totalLogins,
            totalActions,
            activeSessions,
            securityEvents,
            period: `${days} days`
          },
          activityByCategory,
          recentActivity
        }
      });
    } catch (error) {
      console.error('Get activity summary error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get activity summary'
      });
    }
  },

  /**
   * Export user data (audit logs)
   */
  exportUserData: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { format = 'json', startDate, endDate } = req.query;

      // Build where clause
      const whereClause = { userId };
      
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
        if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
      }

      // Get all data
      const [auditLogs, sessions, securityEvents] = await Promise.all([
        AuditLog.findAll({
          where: whereClause,
          order: [['createdAt', 'DESC']],
          attributes: { exclude: ['id'] }
        }),
        
        UserSession.findAll({
          where: { userId },
          order: [['createdAt', 'DESC']],
          attributes: { exclude: ['id', 'sessionToken'] }
        }),
        
        SecurityEvent.findAll({
          where: { userId },
          order: [['createdAt', 'DESC']],
          attributes: { exclude: ['id'] }
        })
      ]);

      const exportData = {
        exportedAt: new Date().toISOString(),
        userId,
        auditLogs,
        sessions,
        securityEvents
      };

      // Log data export
      await AuditService.logAction({
        userId,
        action: 'data_export',
        actionCategory: 'profile',
        resourceType: 'user_data',
        resourceId: userId,
        metadata: {
          format,
          recordCount: {
            auditLogs: auditLogs.length,
            sessions: sessions.length,
            securityEvents: securityEvents.length
          },
          dateRange: { startDate, endDate }
        },
        request: req,
        status: 'success',
        severity: 'medium',
        source: req.headers['x-app-version'] ? 'mobile' : 'web'
      });

      if (format === 'csv') {
        // Convert to CSV format
        const csv = this.convertToCSV(exportData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="user-data-${userId}-${Date.now()}.csv"`);
        return res.send(csv);
      }

      // Default JSON format
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="user-data-${userId}-${Date.now()}.json"`);
      res.json(exportData);
      
    } catch (error) {
      console.error('Export user data error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to export user data'
      });
    }
  },

  /**
   * Helper function to convert data to CSV
   */
  convertToCSV: (data) => {
    // Simple CSV conversion for audit logs
    const headers = ['timestamp', 'action', 'category', 'status', 'severity', 'source', 'ip_address'];
    const csvRows = [headers.join(',')];
    
    data.auditLogs.forEach(log => {
      const row = [
        log.createdAt,
        log.action,
        log.actionCategory,
        log.status,
        log.severity,
        log.source,
        log.ipAddress || ''
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }
};

module.exports = auditController;
