const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SecurityEvent = sequelize.define('SecurityEvent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: true, // Null for anonymous security events
      references: {
        model: 'users',
        key: 'id'
      }
    },
    eventType: {
      type: DataTypes.ENUM(
        'failed_login',
        'suspicious_login',
        'password_reset_request',
        'password_changed',
        'email_changed',
        'account_locked',
        'account_unlocked',
        'multiple_failed_attempts',
        'unusual_location',
        'token_manipulation',
        'api_abuse',
        'data_breach_attempt',
        'privilege_escalation',
        'unauthorized_access'
      ),
      field: 'event_type',
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'medium',
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Human readable description of the security event'
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Detailed information about the event'
    },
    ipAddress: {
      type: DataTypes.INET,
      field: 'ip_address',
      allowNull: true
    },
    userAgent: {
      type: DataTypes.TEXT,
      field: 'user_agent',
      allowNull: true
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Geographic location data'
    },
    deviceInfo: {
      type: DataTypes.JSONB,
      field: 'device_info',
      allowNull: true,
      comment: 'Device information when event occurred'
    },
    sessionId: {
      type: DataTypes.STRING(255),
      field: 'session_id',
      allowNull: true
    },
    source: {
      type: DataTypes.ENUM('web', 'mobile', 'admin', 'api', 'system'),
      defaultValue: 'web',
      allowNull: false
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Whether this security event has been resolved'
    },
    resolvedBy: {
      type: DataTypes.INTEGER,
      field: 'resolved_by',
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'Admin user who resolved this event'
    },
    resolvedAt: {
      type: DataTypes.DATE,
      field: 'resolved_at',
      allowNull: true
    },
    resolutionNotes: {
      type: DataTypes.TEXT,
      field: 'resolution_notes',
      allowNull: true
    },
    blockedAction: {
      type: DataTypes.BOOLEAN,
      field: 'blocked_action',
      defaultValue: false,
      allowNull: false,
      comment: 'Whether the action was blocked due to this security event'
    },
    riskScore: {
      type: DataTypes.INTEGER,
      field: 'risk_score',
      allowNull: true,
      comment: 'Calculated risk score (0-100)',
      validate: {
        min: 0,
        max: 100
      }
    },
    relatedEvents: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      field: 'related_events',
      allowNull: true,
      comment: 'IDs of related security events'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'security_events',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['event_type']
      },
      {
        fields: ['severity']
      },
      {
        fields: ['ip_address']
      },
      {
        fields: ['resolved']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['risk_score']
      },
      {
        // Composite index for security monitoring queries
        fields: ['severity', 'resolved', 'created_at']
      },
      {
        // Index for user security tracking
        fields: ['user_id', 'event_type', 'created_at']
      }
    ]
  });

  SecurityEvent.associate = function(models) {
    // Security event belongs to user
    SecurityEvent.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // Security event resolved by admin
    SecurityEvent.belongsTo(models.User, {
      foreignKey: 'resolvedBy',
      as: 'resolver'
    });
  };

  return SecurityEvent;
};
