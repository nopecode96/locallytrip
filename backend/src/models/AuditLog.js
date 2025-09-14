const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define('AuditLog', {
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
      allowNull: true, // Null for anonymous actions
      references: {
        model: 'users',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Action performed (login, logout, register, update_profile, etc.)'
    },
    actionCategory: {
      type: DataTypes.ENUM('auth', 'profile', 'booking', 'experience', 'payment', 'admin', 'system'),
      field: 'action_category',
      allowNull: false,
      comment: 'Category of the action for easier filtering'
    },
    resourceType: {
      type: DataTypes.STRING(50),
      field: 'resource_type',
      allowNull: true,
      comment: 'Type of resource affected (user, experience, booking, etc.)'
    },
    resourceId: {
      type: DataTypes.INTEGER,
      field: 'resource_id',
      allowNull: true,
      comment: 'ID of the resource affected'
    },
    oldValues: {
      type: DataTypes.JSONB,
      field: 'old_values',
      allowNull: true,
      comment: 'Previous values before change (for updates)'
    },
    newValues: {
      type: DataTypes.JSONB,
      field: 'new_values',
      allowNull: true,
      comment: 'New values after change (for updates)'
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional metadata (request details, etc.)'
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
    deviceInfo: {
      type: DataTypes.JSONB,
      field: 'device_info',
      allowNull: true,
      comment: 'Device information from mobile/web client'
    },
    sessionId: {
      type: DataTypes.STRING(255),
      field: 'session_id',
      allowNull: true,
      comment: 'Session identifier for tracking user sessions'
    },
    status: {
      type: DataTypes.ENUM('success', 'failed', 'pending'),
      defaultValue: 'success',
      allowNull: false
    },
    errorMessage: {
      type: DataTypes.TEXT,
      field: 'error_message',
      allowNull: true,
      comment: 'Error message if action failed'
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'low',
      allowNull: false,
      comment: 'Severity level for security monitoring'
    },
    source: {
      type: DataTypes.ENUM('web', 'mobile', 'admin', 'api', 'system'),
      defaultValue: 'web',
      allowNull: false,
      comment: 'Source of the action'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'audit_logs',
    timestamps: false, // Only createdAt, no updatedAt for audit logs
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['action']
      },
      {
        fields: ['action_category']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['ip_address']
      },
      {
        fields: ['session_id']
      },
      {
        fields: ['severity']
      },
      {
        fields: ['source']
      },
      {
        // Composite index for common queries
        fields: ['user_id', 'action_category', 'created_at']
      }
    ]
  });

  AuditLog.associate = function(models) {
    // Audit log belongs to user
    AuditLog.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return AuditLog;
};
