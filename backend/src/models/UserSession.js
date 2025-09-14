const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserSession = sequelize.define('UserSession', {
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
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    sessionToken: {
      type: DataTypes.STRING(500),
      field: 'session_token',
      allowNull: false,
      unique: true,
      comment: 'JWT token or session identifier'
    },
    deviceId: {
      type: DataTypes.STRING(255),
      field: 'device_id',
      allowNull: true,
      comment: 'Unique device identifier from mobile app'
    },
    deviceName: {
      type: DataTypes.STRING(255),
      field: 'device_name',
      allowNull: true,
      comment: 'Human readable device name (iPhone 14, Samsung Galaxy, etc.)'
    },
    deviceType: {
      type: DataTypes.ENUM('mobile', 'tablet', 'desktop', 'unknown'),
      field: 'device_type',
      defaultValue: 'unknown',
      allowNull: false
    },
    platform: {
      type: DataTypes.ENUM('ios', 'android', 'web', 'windows', 'macos', 'linux', 'unknown'),
      defaultValue: 'unknown',
      allowNull: false
    },
    appVersion: {
      type: DataTypes.STRING(50),
      field: 'app_version',
      allowNull: true,
      comment: 'Mobile app version or web app version'
    },
    osVersion: {
      type: DataTypes.STRING(100),
      field: 'os_version',
      allowNull: true,
      comment: 'Operating system version'
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
      comment: 'Location data: {country, city, latitude, longitude, timezone}'
    },
    fcmToken: {
      type: DataTypes.STRING(500),
      field: 'fcm_token',
      allowNull: true,
      comment: 'Firebase Cloud Messaging token for push notifications'
    },
    loginAt: {
      type: DataTypes.DATE,
      field: 'login_at',
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    lastActivityAt: {
      type: DataTypes.DATE,
      field: 'last_activity_at',
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    logoutAt: {
      type: DataTypes.DATE,
      field: 'logout_at',
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      field: 'expires_at',
      allowNull: true,
      comment: 'Session expiration time'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'is_active',
      defaultValue: true,
      allowNull: false
    },
    logoutReason: {
      type: DataTypes.ENUM('user_logout', 'token_expired', 'forced_logout', 'admin_logout', 'security_logout'),
      field: 'logout_reason',
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional session metadata'
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
    tableName: 'user_sessions',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['session_token'],
        unique: true
      },
      {
        fields: ['device_id']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['login_at']
      },
      {
        fields: ['last_activity_at']
      },
      {
        fields: ['ip_address']
      },
      {
        fields: ['platform']
      },
      {
        // Composite index for finding active sessions
        fields: ['user_id', 'is_active', 'expires_at']
      },
      {
        // Index for device tracking
        fields: ['device_id', 'user_id']
      }
    ]
  });

  UserSession.associate = function(models) {
    // User session belongs to user
    UserSession.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return UserSession;
};
