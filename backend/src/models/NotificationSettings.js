module.exports = (sequelize, DataTypes) => {
  const NotificationSettings = sequelize.define('NotificationSettings', {
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    // Essential notifications
    bookingConfirmationsEmail: {
      type: DataTypes.BOOLEAN,
      field: 'booking_confirmations_email',
      defaultValue: true
    },
    bookingConfirmationsPush: {
      type: DataTypes.BOOLEAN,
      field: 'booking_confirmations_push',
      defaultValue: true
    },
    bookingConfirmationsSms: {
      type: DataTypes.BOOLEAN,
      field: 'booking_confirmations_sms',
      defaultValue: true
    },
    paymentUpdatesEmail: {
      type: DataTypes.BOOLEAN,
      field: 'payment_updates_email',
      defaultValue: true
    },
    paymentUpdatesPush: {
      type: DataTypes.BOOLEAN,
      field: 'payment_updates_push',
      defaultValue: true
    },
    paymentUpdatesSms: {
      type: DataTypes.BOOLEAN,
      field: 'payment_updates_sms',
      defaultValue: false
    },
    messagesEmail: {
      type: DataTypes.BOOLEAN,
      field: 'messages_email',
      defaultValue: true
    },
    messagesPush: {
      type: DataTypes.BOOLEAN,
      field: 'messages_push',
      defaultValue: true
    },
    messagesSms: {
      type: DataTypes.BOOLEAN,
      field: 'messages_sms',
      defaultValue: false
    },
    // Update notifications
    reviewsEmail: {
      type: DataTypes.BOOLEAN,
      field: 'reviews_email',
      defaultValue: true
    },
    reviewsPush: {
      type: DataTypes.BOOLEAN,
      field: 'reviews_push',
      defaultValue: true
    },
    reviewsSms: {
      type: DataTypes.BOOLEAN,
      field: 'reviews_sms',
      defaultValue: false
    },
    favoritesEmail: {
      type: DataTypes.BOOLEAN,
      field: 'favorites_email',
      defaultValue: false
    },
    favoritesPush: {
      type: DataTypes.BOOLEAN,
      field: 'favorites_push',
      defaultValue: true
    },
    favoritesSms: {
      type: DataTypes.BOOLEAN,
      field: 'favorites_sms',
      defaultValue: false
    },
    // Marketing notifications
    promotionsEmail: {
      type: DataTypes.BOOLEAN,
      field: 'promotions_email',
      defaultValue: false
    },
    promotionsPush: {
      type: DataTypes.BOOLEAN,
      field: 'promotions_push',
      defaultValue: false
    },
    promotionsSms: {
      type: DataTypes.BOOLEAN,
      field: 'promotions_sms',
      defaultValue: false
    },
    newsletterEmail: {
      type: DataTypes.BOOLEAN,
      field: 'newsletter_email',
      defaultValue: false
    },
    newsletterPush: {
      type: DataTypes.BOOLEAN,
      field: 'newsletter_push',
      defaultValue: false
    },
    newsletterSms: {
      type: DataTypes.BOOLEAN,
      field: 'newsletter_sms',
      defaultValue: false
    },
    // Global settings
    emailEnabled: {
      type: DataTypes.BOOLEAN,
      field: 'email_enabled',
      defaultValue: true
    },
    pushEnabled: {
      type: DataTypes.BOOLEAN,
      field: 'push_enabled',
      defaultValue: true
    },
    smsEnabled: {
      type: DataTypes.BOOLEAN,
      field: 'sms_enabled',
      defaultValue: false
    },
    // Marketing consent
    marketingConsent: {
      type: DataTypes.BOOLEAN,
      field: 'marketing_consent',
      defaultValue: false
    },
    marketingConsentDate: {
      type: DataTypes.DATE,
      field: 'marketing_consent_date',
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
    tableName: 'notification_settings',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  NotificationSettings.associate = function(models) {
    // NotificationSettings belongs to User
    NotificationSettings.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return NotificationSettings;
};
