module.exports = (sequelize, DataTypes) => {
  const Newsletter = sequelize.define('Newsletter', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      field: 'is_verified',
      defaultValue: false
    },
    verificationToken: {
      type: DataTypes.STRING(255),
      field: 'verification_token',
      allowNull: true
    },
    verificationTokenExpiresAt: {
      type: DataTypes.DATE,
      field: 'verification_token_expires_at',
      allowNull: true
    },
    unsubscribeToken: {
      type: DataTypes.STRING(255),
      field: 'unsubscribe_token',
      allowNull: false
    },
    isSubscribed: {
      type: DataTypes.BOOLEAN,
      field: 'is_subscribed',
      defaultValue: true
    },
    frequency: {
      type: DataTypes.STRING(50),
      defaultValue: 'weekly'
    },
    categories: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: []
    },
    subscribedAt: {
      type: DataTypes.DATE,
      field: 'subscribed_at',
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    unsubscribedAt: {
      type: DataTypes.DATE,
      field: 'unsubscribed_at',
      allowNull: true
    },
    verifiedAt: {
      type: DataTypes.DATE,
      field: 'verified_at',
      allowNull: true
    },
    lastEmailSentAt: {
      type: DataTypes.DATE,
      field: 'last_email_sent_at',
      allowNull: true
    },
    preferences: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        weeklyNewsletter: true,
        newExperiences: true,
        featuredStories: true,
        specialOffers: false
      }
    },
    subscriptionSource: {
      type: DataTypes.STRING(50),
      field: 'subscription_source',
      allowNull: true,
      defaultValue: 'homepage'
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
    tableName: 'newsletters',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['is_verified']
      },
      {
        fields: ['subscription_source']
      },
      {
        fields: ['verification_token']
      },
      {
        fields: ['unsubscribe_token']
      }
    ],
    hooks: {
      beforeCreate: (newsletter) => {
        // Generate unsubscribe token
        if (!newsletter.unsubscribeToken) {
          newsletter.unsubscribeToken = require('crypto').randomBytes(32).toString('hex');
        }
        // Generate verification token for guest subscribers
        if (!newsletter.userId && !newsletter.verificationToken) {
          newsletter.verificationToken = require('crypto').randomBytes(32).toString('hex');
        }
        // Auto-verify for registered users
        if (newsletter.userId && !newsletter.isVerified) {
          newsletter.isVerified = true;
          newsletter.verifiedAt = new Date();
        }
      }
    }
  });

  Newsletter.associate = function(models) {
    // Newsletter belongs to user (optional for guest subscribers)
    Newsletter.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'SET NULL'
    });
  };

  return Newsletter;
};
