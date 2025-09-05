module.exports = (sequelize, DataTypes) => {
  const GuideBooking = sequelize.define('GuideBooking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bookingId: {
      type: DataTypes.INTEGER,
      field: 'booking_id',
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id'
      }
    },
    tourDuration: {
      type: DataTypes.INTEGER,
      field: 'tour_duration',
      allowNull: false,
      comment: 'Duration in hours'
    },
    meetingPoint: {
      type: DataTypes.TEXT,
      field: 'meeting_point'
    },
    languages: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    transportationIncluded: {
      type: DataTypes.BOOLEAN,
      field: 'transportation_included',
      defaultValue: false
    },
    groupSizePreference: {
      type: DataTypes.STRING(50),
      field: 'group_size_preference',
      validate: {
        isIn: [['small', 'medium', 'large']]
      }
    },
    specialInterests: {
      type: DataTypes.JSONB,
      field: 'special_interests'
    },
    accessibilityNeeds: {
      type: DataTypes.TEXT,
      field: 'accessibility_needs'
    },
    dietaryRestrictions: {
      type: DataTypes.TEXT,
      field: 'dietary_restrictions'
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
    tableName: 'guide_bookings',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  GuideBooking.associate = function(models) {
    // Belongs to main booking
    GuideBooking.belongsTo(models.Booking, {
      foreignKey: 'booking_id',
      as: 'booking'
    });
  };

  return GuideBooking;
};
