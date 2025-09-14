module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'password_hash'  // Map to actual database column
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'traveller',
      // Temporarily comment validation to debug
      // validate: {
      //   isIn: [['super_admin', 'admin', 'traveller', 'host', 'affiliate', 'partner', 'finance', 'marketing', 'moderator']]
      // }
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'role_id',
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      field: 'avatar_url',
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cityId: {
      type: DataTypes.INTEGER,
      field: 'city_id',
      allowNull: true,
      references: {
        model: 'cities',
        key: 'id'
      }
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      field: 'is_verified',
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'is_active',
      defaultValue: true
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      field: 'email_verified_at',
      allowNull: true
    },
    verificationToken: {
      type: DataTypes.STRING,
      field: 'verification_token',
      allowNull: true
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      field: 'password_reset_token',
      allowNull: true
    },
    passwordResetExpiresAt: {
      type: DataTypes.DATE,
      field: 'password_reset_expires_at',
      allowNull: true
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      field: 'last_login_at',
      allowNull: true
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
    tableName: 'users',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = function(models) {
    // User has many experiences as host
    User.hasMany(models.Experience, {
      foreignKey: 'hostId',
      as: 'hostedExperiences'
    });

    // User has many bookings
    User.hasMany(models.Booking, {
      foreignKey: 'userId',
      as: 'bookings'
    });

    // User has many reviews
    User.hasMany(models.Review, {
      foreignKey: 'userId',
      as: 'reviews'
    });

    // User has many stories
    User.hasMany(models.Story, {
      foreignKey: 'authorId',
      as: 'stories'
    });

    // User belongs to city
    User.belongsTo(models.City, {
      foreignKey: 'cityId',
      as: 'City'
    });

    // User language associations
    User.belongsToMany(models.Language, {
      through: models.UserLanguage,
      foreignKey: 'userId',
      otherKey: 'languageId',
      as: 'languages'
    });

    // User has one notification settings
    User.hasOne(models.NotificationSettings, {
      foreignKey: 'userId',
      as: 'notificationSettings'
    });
  };

  return User;
};
