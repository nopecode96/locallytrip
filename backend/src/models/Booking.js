module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
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
    experienceId: {
      type: DataTypes.INTEGER,
      field: 'experience_id',
      allowNull: false,
      references: {
        model: 'experiences',
        key: 'id'
      }
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
    bookingDate: {
      type: DataTypes.DATEONLY,
      field: 'booking_date',
      allowNull: false
    },
    bookingTime: {
      type: DataTypes.TIME,
      field: 'booking_time',
      allowNull: true
    },
    participantCount: {
      type: DataTypes.INTEGER,
      field: 'participant_count',
      defaultValue: 1
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'total_price',
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'IDR'
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending'
    },
    specialRequests: {
      type: DataTypes.TEXT,
      field: 'special_requests'
    },
    contactPhone: {
      type: DataTypes.STRING(50),
      field: 'contact_phone'
    },
    contactEmail: {
      type: DataTypes.STRING(255),
      field: 'contact_email'
    },
    paymentStatus: {
      type: DataTypes.STRING(20),
      field: 'payment_status',
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      field: 'payment_method'
    },
    paymentReference: {
      type: DataTypes.STRING(255),
      field: 'payment_reference'
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      field: 'cancellation_reason'
    },
    bookingReference: {
      type: DataTypes.STRING(50),
      field: 'booking_reference',
      unique: true
    },
    categorySpecificData: {
      type: DataTypes.JSONB,
      field: 'category_specific_data',
      allowNull: true,
      comment: 'Category-specific booking data for guide/photographer/planner/combo'
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
    tableName: 'bookings',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Booking.associate = function(models) {
    // Booking belongs to experience
    Booking.belongsTo(models.Experience, {
      foreignKey: 'experience_id',
      as: 'experience'
    });

    // Booking belongs to user
    Booking.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Booking has many reviews
    Booking.hasMany(models.Review, {
      foreignKey: 'booking_id',
      as: 'reviews'
    });
  };

  return Booking;
};
